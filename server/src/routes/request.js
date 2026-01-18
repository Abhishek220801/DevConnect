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
      console.error("Email missing for user:", toUserId)
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
    console.log(toUser)
    await sendEmail({
      to: 'abhi.sankhwar22@gmail.com',
      from: "no-reply@meetdev.online", 
      subject: "New connection request on DevMeet",
      text: `${req.user.firstName} sent you a ${status} request on DevMeet.`,
      html: `
        <h2>Hello ${toUser.firstName},</h2>
        <p>${req.user.firstName} sent you a <b>${status}</b> request.</p>
        <p><a target="_blank" href="meetdev.online/login">Login</a> to DevMeet to respond.</p>
      `,
    })

    res.json({
      message: `${req.user.firstName} sent ${status} request to ${toUser.firstName}`,
      data,
    })
  } catch (err) {
    console.error("Send request error:", err)
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
