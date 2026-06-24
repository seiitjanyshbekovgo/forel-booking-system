import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Booking from "./models/Booking.js";

dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is working");
});

// Жаңы бронь кошуу
app.post("/booking", async (req, res) => {
  try {
    console.log("BOOKING REQUEST RECEIVED");
    console.log(req.body);

    const { table, name, phone, date, time } = req.body;

    const booking = new Booking({
      table,
      name,
      phone,
      date,
      time,
    });

    await booking.save();

    const message = `
📌 Новый бронь

🍽 Стол: ${table}
👤 Имя: ${name}
📞 Телефон: ${phone}
📅 Дата: ${date}
🕒 Время: ${time}
`;

    await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.CHAT_ID,
        text: message,
      },
    );

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
});

// Бардык брондорду алуу
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ _id: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Статус өзгөртүү
app.put("/booking/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Бронь өчүрүү
app.delete("/booking/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Booking.findByIdAndDelete(id);

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(8000, () => {
  console.log("Server started on port 8000");
});
