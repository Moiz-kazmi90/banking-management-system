const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const accountController = require("../controllers/account.controller")
const accountModel = require("../models/account.model") 

const router = express.Router()


// account.routes.js 
router.get("/all", authMiddleware.authSystemUserMiddleware, async (req, res) => {
  try {
    const accounts = await accountModel.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ accounts });
  } catch (err) {
    console.error("All accounts error:", err.message);
    res.status(500).json({ message: err.message });
  }
})

/**
 * - POST /api/accounts/
 * - Create a new account
 * - Protected Route
 */
router.post("/", authMiddleware.authMiddleware , accountController.createAccountController)

/**
 * - GET /api/accounts/
 * - Get all accounts of the logged-in user
 * - Protected Route
 */
router.get("/", authMiddleware.authMiddleware, accountController.getUserAccountsController)

/**
 * - GET /api/accounts/balance/:accountId
 */
router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController)

/**
 * - DELETE /api/accounts/:accountId
 * - Delete/Close a specific account
 */
router.delete(
    "/:accountId", 
    authMiddleware.authMiddleware, 
    accountController.deleteAccountController
);



module.exports = router