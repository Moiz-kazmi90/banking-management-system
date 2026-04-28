const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const accountModel = require("../models/account.model")
const mongoose = require("mongoose")

async function createTransaction(req, res) {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "FromAccount, toAccount, amount and idempotencyKey are required"
        })
    }

    const fromUserAccount = await accountModel.findOne({ _id: fromAccount })
    const toUserAccount   = await accountModel.findOne({ _id: toAccount })

    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({ message: "Invalid fromAccount or toAccount" })
    }

    const isTransactionAlreadyExists = await transactionModel.findOne({ idempotencyKey })

    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: isTransactionAlreadyExists
            })
        }
        if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(200).json({ message: "Transaction is still processing" })
        }
        if (isTransactionAlreadyExists.status === "FAILED") {
            return res.status(500).json({ message: "Transaction processing failed, please retry" })
        }
        if (isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(500).json({ message: "Transaction was reversed, please retry" })
        }
    }

    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Both fromAccount and toAccount must be ACTIVE to process transaction"
        })
    }

    const balance = await fromUserAccount.getBalance()

    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`
        })
    }

    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const transaction = (await transactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        }], { session }))[0]

        await ledgerModel.create([{
            account:     fromAccount,
            amount:      amount,
            transaction: transaction._id,
            type:        "DEBIT"
        }], { session })

        await ledgerModel.create([{
            account:     toAccount,
            amount:      amount,
            transaction: transaction._id,
            type:        "CREDIT"
        }], { session })

        await transactionModel.findOneAndUpdate(
            { _id: transaction._id },
            { status: "COMPLETED" },
            { session }
        )

        await session.commitTransaction()
        session.endSession()

        return res.status(201).json({
            message: "Transaction completed successfully",
            transaction
        })

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        console.error("Transaction error:", error.message)
        return res.status(400).json({
            message: "Transaction failed: " + error.message
        })
    }
}

async function getAccountTransactions(req, res) {
    const { accountId } = req.params;
    try {
        const account = await accountModel.findOne({
            _id:  accountId,
            user: req.user._id
        });

        if (!account) {
            return res.status(404).json({ message: "Account not found or access denied" });
        }

        const transactions = await transactionModel.find({
            $or: [
                { fromAccount: accountId },
                { toAccount:   accountId }
            ]
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success:      true,
            count:        transactions.length,
            transactions: transactions
        });

    } catch (error) {
        console.error("Error fetching transactions:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getAllTransactions(req, res) {
    try {
        if (!req.user.systemUser) {
            return res.status(403).json({ message: "Forbidden: Admin access only" });
        }

        const transactions = await transactionModel.find()
            .populate({
                path:     "toAccount",
                populate: { path: "user", select: "name email" }
            })
            .populate({
                path:     "fromAccount",
                populate: { path: "user", select: "name" }
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({ transactions });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching transactions", error: error.message });
    }
}

async function createInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !mongoose.Types.ObjectId.isValid(toAccount)) {
        return res.status(400).json({ message: "Invalid or missing Target Account ID" });
    }

    if (!req.user.systemUser) {
        return res.status(403).json({ message: "Only system users can inject funds" });
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const toUserAccount = await accountModel.findById(toAccount).session(session);
        if (!toUserAccount) throw new Error("Target account not found");

        const fromUserAccount = await accountModel.findOne({ user: req.user._id }).session(session);
        if (!fromUserAccount) throw new Error("System Admin bank account not found");

        const transaction = (await transactionModel.create([{
            fromAccount:    fromUserAccount._id,
            toAccount:      toUserAccount._id,
            amount:         Number(amount),
            idempotencyKey: idempotencyKey,
            status:         "COMPLETED",
        }], { session }))[0]

        await ledgerModel.create([{
            account:     fromUserAccount._id,
            amount:      Number(amount),
            transaction: transaction._id,
            type:        "DEBIT"
        }], { session })

        await ledgerModel.create([{
            account:     toUserAccount._id,
            amount:      Number(amount),
            transaction: transaction._id,
            type:        "CREDIT"
        }], { session })

        await session.commitTransaction()
        session.endSession()

        return res.status(201).json({
            message: "Funds deposited successfully",
            transaction
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession()
        console.error("Deposit error:", error.message);
        return res.status(400).json({ message: error.message });
    }
}

module.exports = {
    createTransaction,
    getAccountTransactions,
    getAllTransactions,
    createInitialFundsTransaction
}