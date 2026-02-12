import express from "express"
import { validateProfileEditData } from "../utils/validation.js"
import bcrypt from "bcrypt"
import validator from "validator"
const profileRouter = express.Router()

import { userAuth } from "../middlewares/auth.js"
import upload from "../middlewares/upload.js"

profileRouter.get("/", userAuth, async (req, res) => {
  try {
    const user = req.user
    res.send(user)
  } catch (err) {
    res.status(400).send("ERROR : " + err.message)
  }
})

// profileRouter.patch(
//   "/edit",
//   userAuth,
//   upload.single("photo"),
//   async (req, res) => {
//     try {
//       if (!validateProfileEditData(req)) {
//         return res.status(400).json({ message: "Invalid Edit Request" })
//       }
//       const loggedInUser = req.user
//       const updates = req.body || {}
//       // Reject empty update
//       if (Object.keys(updates).length === 0 && !req.file) {
//         return res.status(400).json({ message: "No fields provided" })
//       }
//       if(updates.skills && typeof updates.skills === 'string'){
//         try{
//           updates.skills = JSON.parse(updates.skills);
//         } catch (e) {
//           console.error('Skills parsing error:', e)
//           updates.skills = []
//         }
//       }
//       Object.keys(updates).forEach((key) => {
//         if (updates[key] === undefined || updates[key] === '') return;
//         if(Array.isArray(updates[key]) && updates[key].length === 0) return;
//         loggedInUser[key] = updates[key];
//       })
//       if (req.file) {
//         loggedInUser.photoUrl = `/uploads/${req.file.filename}`
//       }
//       await loggedInUser.save()
//       return res.json({
//         message: `${loggedInUser.firstName}, your profile was updated successfully!`,
//         data: loggedInUser,
//           })
//     } catch (err) {
//       console.error('Profile edit error:', err)
//       return res.status(400).json({
//         message: err.message || "Edit request failed",
//       })
//     }
//   }
// )

profileRouter.patch(
  "/edit",
  userAuth,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!validateProfileEditData(req)) {
        return res.status(400).json({ message: "Invalid Edit Request" })
      }

      const loggedInUser = req.user
      const updates = req.body || {}

      if (Object.keys(updates).length === 0 && !req.file) {
        return res.status(400).json({ message: "No fields provided" })
      }

      // Parse skills
      if ("skills" in updates) {
        if (typeof updates.skills === "string") {
          try {
            const parsed = JSON.parse(updates.skills)
            updates.skills = Array.isArray(parsed) ? parsed : []
          } catch (e) {
            updates.skills = []
          }
        }
        if (Array.isArray(updates.skills)) {
          updates.skills = updates.skills
            .filter(
              (skill) =>
                skill && typeof skill === "string" && skill.trim() !== ""
            )
            .map((skill) => skill.trim())
        } else {
          updates.skills = []
        }
      }

      // Update fields
      Object.keys(updates).forEach((key) => {
        if (key === "photoUrl") return // Skip photoUrl from body
        loggedInUser[key] = updates[key]
      })

      // Handle file upload
      if (req.file) {
        const photoPath = `/uploads/${req.file.filename}`
        loggedInUser.photoUrl = photoPath
      }

      const savedUser = await loggedInUser.save()

      return res.json({
        message: `${savedUser.firstName}, your profile was updated successfully!`,
        data: savedUser,
      })
    } catch (err) {
      return res.status(400).json({
        message: err.message || "Edit request failed",
      })
    }
  }
)

profileRouter.patch("/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user
    const { currentPassword, newPassword } = req.body
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      loggedInUser.password
    )
    if (!isPasswordValid)
      throw new Error("Please enter correct current password")
    if (!validator.isStrongPassword(newPassword))
      throw new Error("Please enter a strong password")
    loggedInUser.password = newPassword
    await loggedInUser.save()
    return res.json({
      message: "Password updated successfully",
    })
  } catch (err) {
    res.status(400).send("ERROR : " + err.message)
  }
})

export default profileRouter
