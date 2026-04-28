const accountModel = require("../models/account.model");


async function createAccountController(req, res) {

    const user = req.user;

    const account = await accountModel.create({
        user: user._id
    })

    res.status(201).json({
        account
    })

}

// get the user account
async function getUserAccountsController(req, res) {

    const accounts = await accountModel.find({ user: req.user._id });

    res.status(200).json({
        accounts
    })
}

// get the user balance

async function getAccountBalanceController(req, res) {
    const { accountId } = req.params;

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        })
    }

    const balance = await account.getBalance();

    res.status(200).json({
        accountId: account._id,
        balance: balance
    })
}

// account.controller.js mein ye function add karein

// account.controller.js

async function deleteAccountController(req, res) {
    const { accountId } = req.params;

    try {
        const account = await accountModel.findOne({
            _id: accountId,
            user: req.user._id
        });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        // Balance check (paisa zero hona chahiye)
        const balance = await account.getBalance();
        if (balance > 0) {
            return res.status(400).json({
                message: `Account band nahi ho sakta kyunki isme ₨ ${balance} maujood hain.`
            });
        }

        //  FIX: Status ko exactly "CLOSED" set karein (Enum match hona chahiye)
        account.status = "CLOSED"; 
        await account.save();

        res.status(200).json({
            message: "Account has been CLOSED successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting account",
            error: error.message
        });
    }
}
module.exports = {
    createAccountController,
    getUserAccountsController,
    getAccountBalanceController,
    deleteAccountController
}