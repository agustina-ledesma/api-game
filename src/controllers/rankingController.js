import * as rankingService from "../services/rankingService.js";

let io; 

export const setSocketIO = (socketIO) => {
  io = socketIO; 
};

export async function sendToRanking(req, res) {
  const { score, time, name, tiktok } = req.body;

  // Validación de campos requeridos
  if (score == null || time == null || !name) {
    return res.status(400).json({ message: "Los campos son requeridos." });
  }

  try {
    const result = await rankingService.sendToRanking({
      score,
      time,
      name,
      tiktok: tiktok || null,
    });

    const updatedRanking = await rankingService.getRanking();
    if (io) {
      io.emit("rankingUpdated", updatedRanking);
    }
    res.status(200).json({ message: "Send to Ranking successfully", result });
  } catch (error) {
    console.error("Error updating ranking:", error);
    res.status(500).json({ message: "Error updating ranking" });
  }
}


export async function getRanking(req, res) {
  try {
    const rankings = await rankingService.getRanking();
    res.status(200).json(rankings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rankings" });
  }
}

export default {
  sendToRanking,
  getRanking,
  setSocketIO, 
};
