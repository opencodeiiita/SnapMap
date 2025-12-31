import express from "express";
import dotenv from "dotenv";
dotenv.config();

//-----db connection--------
import connectDB from "./config/db.js";
connectDB();
//------------------------------------------------------------
const app = express();
app.use(express.json());

import router from "./v1.js";

app.use("/api/v1", router);

app.get("/", (req, res) => {
    res.send("Welcome to SnapMap API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));