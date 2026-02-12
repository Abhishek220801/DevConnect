import mongoose from "mongoose"

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log("Connected successfully to mongoDB")
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`)
    process.exit(1)
  }
}

process.on("SIGINT", async () => {
  await mongoose.disconnect()
  console.log("Disconnect gracefully with mongoDB")
  process.exit(0)
})
