import express from 'express'
import { getAllMessages, sendMessage } from '../Controller/messageController.js';
import asyncAwaitErrors from '../Middleware/asyncAwaitErrors.js';
import { isAdminAuthenticated } from '../Middleware/auth.js';
const router = express.Router();

router.post("/sendMessage", asyncAwaitErrors(sendMessage));
router.get("/getMessages", isAdminAuthenticated, asyncAwaitErrors(getAllMessages));
export default router; 