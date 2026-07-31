const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const appRouter = require("./appRouter");
const connectDB = require("./config/connectDB");
const cookieParser = require("cookie-parser");
const dns = require("dns");
const http = require("http");
const intitiliseSocket = require("./config/socket");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = intitiliseSocket(server);
 
 

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1", appRouter);

async function startServer() {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
