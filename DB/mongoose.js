import mongoose from "mongoose";
import "dotenv/config"

export async function mongooseConnect() {
    try {
        const mongoUri = process.env.MONGO_URI

        if (!mongoUri) {
            throw new Error('MONGO_URI is missing in your .env file!')
        }

        await mongoose.connect(mongoUri)

        console.log("DataBase Connected Successfully")
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`)
        process.exit(1)
    }
}
