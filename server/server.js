import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import Booking from "./models/Booking.js";

dotenv.config({ path: "../.env" });

const app = express();

app.use(cors());
app.use(express.json());

// =========================
// MONGODB
// =========================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

// =========================
// TEST
// =========================

app.get("/", (req, res) => {
  res.send("Server is working");
});

// =========================
// ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ
// Время -> минуты
// =========================

const timeToMinutes = (time) => {
  if (!time || typeof time !== "string") {
    return null;
  }

  const parts = time.split(":");

  if (parts.length !== 2) {
    return null;
  }

  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
};

// =========================
// НОВЫЙ БРОНЬ
// =========================

app.post("/booking", async (req, res) => {
  console.log("REQ BODY:", req.body);
  console.log("BOOKING REQUEST RECEIVED");

  try {
    const { branch, table, name, phone, date, time } = req.body;

    // =========================
    // ПРОВЕРКА ДАННЫХ
    // =========================

    if (!branch || !table || !name || !phone || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Заполните все данные для бронирования.",
      });
    }

    // =========================
    // ПРОВЕРКА ВРЕМЕНИ
    // =========================

    const newTimeMinutes = timeToMinutes(time);

    if (newTimeMinutes === null) {
      return res.status(400).json({
        success: false,
        message: "Неверный формат времени.",
      });
    }

    // =========================
    // ПОЛУЧАЕМ СУЩЕСТВУЮЩИЕ БРОНИ
    // ЭТОГО ФИЛИАЛА / СТОЛА / ДАТЫ
    //
    // rejected НЕ БЕРЕМ В УЧЕТ
    // =========================

    const existingBookings = await Booking.find({
      branch,
      table,
      date,
      status: {
        $ne: "rejected",
      },
    });

    console.log("Найдено существующих броней:", existingBookings.length);

    // =========================
    // ПРОВЕРКА ±4 ЧАСА
    // =========================

    const hasConflict = existingBookings.some((item) => {
      const bookingTimeMinutes = timeToMinutes(item.time);

      if (bookingTimeMinutes === null) {
        return false;
      }

      const diffMinutes = Math.abs(newTimeMinutes - bookingTimeMinutes);

      const diffHours = diffMinutes / 60;

      console.log(
        `Существующее время: ${item.time}, новое время: ${time}, разница: ${diffHours} часов`,
      );

      // 4 часа включительно — нельзя
      // больше 4 часов — можно
      return diffHours <= 4;
    });

    // =========================
    // ЕСЛИ ЕСТЬ КОНФЛИКТ
    // =========================

    if (hasConflict) {
      console.log("БРОНЬ ОТКЛОНЕНА: разница между бронями 4 часа или меньше");

      return res.status(409).json({
        success: false,
        message:
          "Этот стол уже забронирован на выбранное время. Выберите другое время.",
      });
    }

    // =========================
    // СОЗДАЁМ НОВУЮ БРОНЬ
    // =========================

    const booking = new Booking({
      branch,
      table,
      name,
      phone,
      date,
      time,
      status: "pending",
    });

    console.log("Сохраняем бронь в MongoDB...");

    await booking.save();

    console.log("Бронь успешно сохранена в MongoDB:", booking._id);

    // =========================
    // TELEGRAM
    // =========================

    const message = `
📌 Новый бронь

🏢 Филиал: ${branch}

🍽 Стол: ${table}
👤 Имя: ${name}
📞 Телефон: ${phone}
📅 Дата: ${date}
🕒 Время: ${time}

⏳ Статус: в ожидании
`;

    try {
      console.log("Отправляем бронь в Telegram...");

      await axios.post(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
        {
          chat_id: process.env.CHAT_ID,
          text: message,
        },
      );

      console.log("Бронь успешно отправлена в Telegram");
    } catch (telegramError) {
      console.log(
        "Ошибка отправки в Telegram:",
        telegramError.response?.data || telegramError.message,
      );

      // ВАЖНО:
      // Даже если Telegram не сработал,
      // бронь уже сохранена в MongoDB.
    }

    // =========================
    // УСПЕШНЫЙ ОТВЕТ
    // =========================

    return res.status(201).json({
      success: true,
      message: "Бронь успешно создана.",
      booking,
    });
  } catch (error) {
    console.log("ОШИБКА СОЗДАНИЯ БРОНИ:", error);

    return res.status(500).json({
      success: false,
      message: "Ошибка сервера.",
    });
  }
});

// =========================
// ВСЕ БРОНИ
// =========================

app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({
      _id: -1,
    });

    res.json(bookings);
  } catch (error) {
    console.log("Ошибка получения броней:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =========================
// ИЗМЕНЕНИЕ СТАТУСА
// =========================

app.put("/booking/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "accepted", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Неверный статус.",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Бронь не найдена.",
      });
    }

    res.json(booking);
  } catch (error) {
    console.log("Ошибка изменения статуса:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =========================
// УДАЛЕНИЕ БРОНИ
// =========================

app.delete("/booking/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Бронь не найдена.",
      });
    }

    res.json({
      success: true,
      message: "Бронь удалена.",
    });
  } catch (error) {
    console.log("Ошибка удаления брони:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =========================
// SERVER
// =========================

app.listen(8000, () => {
  console.log("Server started on port 8000");
});
