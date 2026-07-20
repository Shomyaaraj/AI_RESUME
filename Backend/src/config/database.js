const mongoose = require("mongoose");

async function connectToDB() {
    const primaryUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/interviewMaster";
    const localUri = "mongodb://127.0.0.1:27017/interviewMaster";

    try {
        await mongoose.connect(primaryUri, {
            serverSelectionTimeoutMS: 4000
        });
        console.log("Connected to MongoDB database successfully.");
    } catch (err) {
        console.warn("Primary MongoDB URI connection failed:", err.message);
        if (primaryUri !== localUri) {
            console.log("Attempting fallback connection to local MongoDB database (mongodb://127.0.0.1:27017/interviewMaster)...");
            try {
                await mongoose.connect(localUri, {
                    serverSelectionTimeoutMS: 4000
                });
                console.log("Connected to local MongoDB database successfully.");
            } catch (fallbackErr) {
                console.error("Local MongoDB connection also failed:", fallbackErr.message);
            }
        }
    }
}

module.exports = connectToDB;