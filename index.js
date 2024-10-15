import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import route from "./src/routes/route.js";
import * as rankingController from "./src/controllers/rankingController.js";

const app = express();
const PORT = 3000;

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(route);

app.get("/", (req, res) => {
  res.send("Api quiz-game");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Manejar conexiones de socket
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("sendRankingData", async (data) => {
    console.log("Recibido en sendRankingData:", data);

    if (!data || Object.values(data).every((value) => value === null)) {
      console.error("Datos inválidos recibidos:", data);
      return;
    }

    try {
      const req = { body: data };
      const res = {
        status: (statusCode) => ({
          json: (responseBody) => {
            console.log(`Response: ${statusCode}`, responseBody);
          },
        }),
      };

      await rankingController.sendToRanking(req, res);
      const updatedRanking = await rankingController.getRanking(req, res);
      io.emit("rankingUpdated", updatedRanking); // Emitir el ranking actualizado
      console.log("Datos enviados exitosamente");
    } catch (error) {
      console.error("Error al enviar datos a la API:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Inicia el servidor
server.listen(PORT, () => {
  console.log(`El servidor está corriendo en http://localhost:${PORT}`);
});
