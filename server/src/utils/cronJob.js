import cron from "node-cron"
import { subDays, startOfDay, endOfDay } from "date-fns"
import ConnectionRequest from "../models/connectionRequest.js"
import sendEmail from "./sendEmail.js"
import connectDB from '../config/database.js'

await connectDB()

cron.schedule("17 18 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 0)
    const yesterdayStart = startOfDay(yesterday)
    const yesterdayEnd = endOfDay(yesterday)

    const pendingRequests = await ConnectionRequest.find({
      status: "like",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId")

    console.log(pendingRequests);

    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ]

    for (const email of listOfEmails) {
      const textContent = `You have pending requests, please visit https://meetdev.online/connections to accept or reject`

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .content {
      background: #ffffff;
      padding: 30px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .request-list {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .request-list ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .request-list li {
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .request-list li:last-child {
      border-bottom: none;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0;">💌 New Connection Requests!</h1>
  </div>
  <div class="content">
    <p>Hi there!</p>
    <p>You have pending connection requests on MeetDev from yesterday:</p>
    
    <div class="footer">
      <p>Best regards,<br>The MeetDev Team</p>
      <p style="font-size: 12px; color: #9ca3af;">
        You're receiving this because you have pending connection requests on MeetDev.
      </p>
    </div>
  </div>
</body>
</html>
        `.trim()

      const res = await sendEmail({
        from: "no-reply@meetdev.online",
        to: "abhi.sankhwar22@gmail.com",
        subject: `You have new connection requests on MeetDev!`,
        text: textContent,
        html: htmlContent,
      })
      console.log(res);
    }
  } catch (err) {
    console.error(err);
  }
})
