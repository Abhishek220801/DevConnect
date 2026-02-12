import express from "express"
import mongoose from "mongoose"
const requestRouter = express.Router()

import { userAuth } from "../middlewares/auth.js"
import User from "../models/user.js"
import ConnectionRequest from "../models/connectionRequest.js"
import sendEmail from "../utils/sendEmail.js"

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id
    const toUserId = req.params.toUserId
    const status = req.params.status

    // validate ObjectId first
    if (!mongoose.isValidObjectId(toUserId)) {
      return res.status(400).json({ message: "Invalid user id format" })
    }

    // prevent self-like
    if (fromUserId.toString() === toUserId.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot send request to yourself" })
    }

    // safe fetch
    const toUser = await User.findById(toUserId).select(
      "+_id emailId firstName",
    ) // minimal fetch

    if (!toUser) {
      return res.status(404).json({ message: "User not found" })
    }

    if (!toUser.emailId) {
      return res.status(400).json({ message: "Recipient email not available" })
    }

    const allowedStatus = ["like", "pass"]
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status type: " + status,
      })
    }

    // if there is an existing connectionRequest
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId }, // You -> Them
        { fromUserId: toUserId, toUserId: fromUserId }, // Them -> You
      ],
    })

    if (existingConnectionRequest) {
      return res
        .status(400)
        .json({ message: "Connection Request Already Exists!" })
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    })

    const data = await connectionRequest.save()
    await sendEmail({
      to: "abhi.sankhwar22@gmail.com",
      from: "no-reply@meetdev.online",
      subject: "New connection request on MeetDev",
      text: `${req.user.firstName} sent you a ${status} request on MeetDev.`,
      html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Connection Request</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
              
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                    MeetDev
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  
                  <!-- Greeting -->
                  <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                    Hi ${toUser.firstName}! 👋
                  </h2>
                  
                  <!-- Main Message -->
                  <p style="margin: 0 0 24px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                    You have a new connection request from <strong style="color: #667eea;">${req.user.firstName}</strong>. They're interested in connecting with you on MeetDev!
                  </p>
                  
                  <!-- Card Box -->
                  <div style="background-color: #f7fafc; border-left: 4px solid #667eea; padding: 20px; margin: 24px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #2d3748; font-size: 14px; line-height: 1.5;">
                      <strong>Request Type:</strong> <span style="color: #667eea; text-transform: capitalize;">${status}</span>
                    </p>
                  </div>
                  
                  <!-- CTA Button -->
                  <table role="presentation" style="margin: 32px 0;">
                    <tr>
                      <td align="center">
                        <a href="https://meetdev.online/requests" target="_blank" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                          View Request
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Secondary Text -->
                  <p style="margin: 24px 0 0; color: #718096; font-size: 14px; line-height: 1.5;">
                    Building connections is the first step to building something amazing together. Don't keep them waiting!
                  </p>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; background-color: #f7fafc; border-radius: 0 0 12px 12px; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 8px; color: #718096; font-size: 13px; line-height: 1.5; text-align: center;">
                    This email was sent to you because someone sent you a connection request on MeetDev.
                  </p>
                  <p style="margin: 0; color: #a0aec0; font-size: 12px; text-align: center;">
                    © ${new Date().getFullYear()} MeetDev. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
            
            <!-- Email Footer Links -->
            <table role="presentation" style="max-width: 600px; width: 100%; margin-top: 20px;">
              <tr>
                <td style="text-align: center; padding: 0 20px;">
                  <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                    <a href="https://meetdev.online" style="color: #667eea; text-decoration: none; margin: 0 10px;">Visit MeetDev</a>
                  </p>
                </td>
              </tr>
            </table>
            
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
    })

    res.json({
      message: `${req.user.firstName} sent ${status} request to ${toUser.firstName}`,
      data,
    })
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message })
  }
})

requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user
    const { status, requestId } = req.params
    const allowedStatus = ["accept", "reject"]
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: `Status: ${status} not allowed` })
    }
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "like",
    })
    if (!connectionRequest) {
      return res.status(400).json({ message: "Connection request not found" })
    }
    connectionRequest.status = "accepted"
    const data = await connectionRequest.save()
    res.json({ message: `Connection request ${status}ed`, data })
  } catch (err) {
    res.status(400).send("ERROR : " + err.message)
  }
})

export default requestRouter
