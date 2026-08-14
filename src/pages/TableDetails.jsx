import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import SuccessModal from "../components/SuccessModal";
import { branches } from "../data/branches";
import { axunTables } from "../data/tables/axun";
import { gorkiyTables } from "../data/tables/gorkiy";
import { jalTables } from "../data/tables/jal";
import { shopokTables } from "../data/tables/shopok";

function TableDetails() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+996");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [prepaymentAmount, setPrepaymentAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const branch = searchParams.get("branch");

  const currentBranch = branches.find((item) => item.slug === branch);

  const handleBooking = async () => {
    // Экинчи жолу басууга жол бербейт
    if (loading) return;

    // =========================
    // БОШ ТАЛААЛАР
    // =========================

    if (!name || !phone || !date || !time) {
      alert("Заполните все поля.");
      return;
    }

    // =========================
    // ПРЕДОПЛАТА
    // =========================

    if (prepaymentAmount === "" || prepaymentAmount === null) {
      alert("Введите сумму предоплаты.");
      return;
    }

    const amount = Number(prepaymentAmount);

    if (Number.isNaN(amount)) {
      alert("Введите корректную сумму предоплаты.");
      return;
    }

    if (amount < 1000) {
      alert("Минимальная сумма предоплаты — 1000 сом.");
      return;
    }

    // =========================
    // ТЕЛЕФОН
    // =========================

    if (!phone.startsWith("+996")) {
      alert("Номер телефона должен начинаться с +996!");
      return;
    }

    if (phone.length !== 13) {
      alert("Неправильный формат номера телефона!");
      return;
    }

    // =========================
    // ДАТА
    // =========================

    const today = new Date().toISOString().split("T")[0];

    if (date < today) {
      alert("Нельзя бронировать на прошедшую дату!");
      return;
    }

    // =========================
    // LOADING
    // =========================

    setLoading(true);

    try {
      const newBooking = {
        branch,
        table: table.name,
        name,
        phone,
        date,
        time,
        prepaymentAmount: amount,
        status: "pending",
      };

      console.log("NEW BOOKING:", newBooking);

      // =========================
      // СЕРВЕР
      // =========================

      const response = await fetch(
        "https://forel-booking-system.onrender.com/booking",
        //  "http://localhost:8000/booking"
        // "http://localhost:8000/booking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBooking),
        },
      );

      const result = await response.json();

      // =========================
      // ЕСЛИ СЕРВЕР КАТА БЕРСЕ
      // =========================

      if (!response.ok) {
        alert(result.message || "Не удалось оформить бронирование.");

        return;
      }

      // =========================
      // LOCALSTORAGE
      // СЕРВЕР ИЙГИЛИКТҮҮ БОЛГОНДОН КИЙИН
      // =========================

      const oldBookings = JSON.parse(localStorage.getItem("bookings")) || [];

      oldBookings.push(result.booking || newBooking);

      localStorage.setItem("bookings", JSON.stringify(oldBookings));

      // =========================
      // SUCCESS
      // =========================

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/");
      }, 20000);

      // =========================
      // ФОРМАНЫ ТАЗАЛОО
      // =========================

      setName("");
      setPhone("+996");
      setDate("");
      setTime("");
      setPrepaymentAmount("");
    } catch (error) {
      console.error("BOOKING ERROR:", error);

      alert("Не удалось связаться с сервером. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ФИЛИАЛДЫН СТОЛДОРУ
  // =========================

  let tables = [];

  switch (branch) {
    case "gorkiy":
      tables = gorkiyTables;
      break;

    case "jal":
      tables = jalTables;
      break;

    case "axun":
      tables = axunTables;
      break;

    case "shopok":
      tables = shopokTables;
      break;

    default:
      tables = [];
  }

  const table = tables.find((item) => item.id === Number(id));

  // =========================
  // СТОЛ ТАБЫЛБАСА
  // =========================

  if (!table) {
    return (
      <>
        <Header />

        <div
          style={{
            padding: "50px",
            textAlign: "center",
          }}
        >
          <h2>Стол не найден.</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      {/* =========================
          LOADING OVERLAY
      ========================= */}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-box">
            <div className="spinner"></div>

            <h2>Бронь оформляется...</h2>

            <p>Пожалуйста, не закрывайте страницу.</p>
          </div>
        </div>
      )}

      <div style={{ padding: "50px" }}>
        <h1>{table.name}</h1>

        <div className="table-info">
          <p>👥 {table.seats}</p>
          <p>📍 {table.location}</p>
        </div>

        <div className="details-container">
          <img
            src={table.image}
            alt={table.name}
            style={{
              width: "450px",
              height: "600px",
              objectFit: "cover",
              borderRadius: "12px",
              margin: "20px 0",
            }}
          />

          <div className="booking-form">
            <h5>Для бронирования стола заполните все необходимые поля.</h5>

            <input
              type="text"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="999766050"
              value={phone}
              onChange={(e) => {
                const value = e.target.value;

                if (!value.startsWith("+996")) {
                  setPhone("+996");
                  return;
                }

                setPhone(value);
              }}
            />

            <label>Дата бронирования</label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <label>Время бронирования</label>

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />

            {/* =========================
                ПРЕДОПЛАТА
            ========================= */}

            <div
              style={{
                background: "#b16666",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "15px",
                lineHeight: "1.6",
              }}
            >
              💳 Предоплата: строго от 1000 сом
              <br />
              MBANK: {currentBranch?.mbank ?? ""}
              <br />
              <br />
              После проверки предоплаты администратор подтвердит бронирование.
            </div>

            <label
              style={{
                display: "block",
                width: "100%",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Сумма предоплаты
              <p>напишите сколько вы оставили предоплата</p>
            </label>

            <input
              type="number"
              min="1000"
              step="50"
              placeholder="Например: 1500"
              value={prepaymentAmount}
              onChange={(e) => setPrepaymentAmount(e.target.value)}
            />

            <button onClick={handleBooking} disabled={loading}>
              {loading ? "Бронь оформляется..." : "Бронировать"}
            </button>
          </div>
        </div>
      </div>

      {showSuccess && <SuccessModal />}
    </>
  );
}

export default TableDetails;
