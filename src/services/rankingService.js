import { MongoClient, ObjectId } from "mongodb";
import { connectToDatabase } from "../db/db.js";
const db = await connectToDatabase();

async function sendToRanking({ score, time, name, tiktok }) {
  const db = await connectToDatabase();
  const rankingCollection = db.collection("ranking");

  try {
    const newEntry = {
      name,
      tiktok,
      score,
      time,
    };

    const result = await rankingCollection.insertOne(newEntry);
    return result;
  } catch (error) {
    console.error("Error sending to ranking:", error);
    throw error;
  }
}

async function getRanking() {
  try {
    const db = await connectToDatabase();
    const rankingCollection = db.collection("ranking");

    const rankings = await rankingCollection
      .aggregate([
        {
          $addFields: {
            prioridad: {
              $cond: { if: { $gt: ["$time", 0] }, then: 1, else: 0 },
            },
          },
        },
        {
          $sort: { prioridad: -1, score: -1, time: -1 },
        },
      ])
      .toArray();

    return rankings;
  } catch (error) {
    console.error("Error fetching rankings:", error);
    throw error;
  }
}

export { sendToRanking, getRanking };
