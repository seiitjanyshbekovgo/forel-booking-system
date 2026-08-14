import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import Booking from "./models/Booking.js";

dotenv.config({ path: "../.env" });

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

app.post("/booking", async (req, res) => {
  console.log("REQ BODY:", req.body);

  try {
    console.log("BOOKING REQUEST RECEIVED");

    const { branch, table, name, phone, date, time } = req.body;

    if (!branch || !table || !name || !phone || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Заполните все данные для бронирования.",
      });
    }

    const existingBookings = await Booking.find({
      branch,
      table,
      date,
      status: { $ne: "rejected" },
    });

    const newTime = new Date(`2000-01-01T${time}`);

    const hasConflict = existingBookings.some((item) => {
      const bookingTime = new Date(`2000-01-01T${item.time}`);

      const diffHours = Math.abs(newTime - bookingTime) / (1000 * 60 * 60);

      return diffHours <= 4;
    });

    if (hasConflict) {
      return res.status(409).json({
        success: false,
        message:
          "Этот стол уже забронирован на выбранное время. Выберите другое время.",
      });
    }

    const booking = new Booking({
      branch,
      table,
      name,
      phone,
      date,
      time,
      status: "pending",
    });

    await booking.save();

    const message = `
📌 Новый бронь

🏢 Филиал: ${branch}

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

    res.json({
      success: true,
      message: "Бронь успешно создана.",
      booking,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Ошибка сервера.",
    });
  }
});

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
