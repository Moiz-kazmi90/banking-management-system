const { Router } = require('express');
const authMiddleware = require("../middleware/auth.middleware");
const transactionController = require("../controllers/transaction.controller")

const transactionRoutes = Router();

// Admin only: Get all system transactions
transactionRoutes.get("/all", authMiddleware.authSystemUserMiddleware, transactionController.getAllTransactions);

/**
 * - POST /api/transactions/
 * - Create a new transaction
 */

transactionRoutes.post("/", authMiddleware.authMiddleware , transactionController.createTransaction)


/**
 * - POST /api/transactions/system/initial-funds
 * - Create initial funds transaction from system user
 */
// transactionRoutes.post("/system/initial-funds", authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransaction)

transactionRoutes.get("/:accountId", authMiddleware.authMiddleware, transactionController.getAccountTransactions)


// Initial funds transfer
transactionRoutes.post("/system/initial-funds", authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransaction);



module.exports = transactionRoutes;