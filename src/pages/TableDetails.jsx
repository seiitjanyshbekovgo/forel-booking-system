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
  const [isPaid, setIsPaid] = useState(false);
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

    if (!isPaid) {
      alert("Пожалуйста, подтвердите внесение предоплаты!");
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
        status: "pending",
      };

      console.log("NEW BOOKING:", newBooking);

      // =========================
      // СЕРВЕР
      // =========================

      const response = await fetch(
        "https://forel-booking-system.onrender.com/booking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBooking),
        },
      );

      // JSON жоопту окуйбуз
      const result = await response.json();

      // =========================
      // ЭГЕР СЕРВЕР КАТА БЕРСЕ
      // =========================

      if (!response.ok) {
        alert(result.message || "Не удалось оформить бронирование.");

        return;
      }

      // =========================
      // СЕРВЕР ИЙГИЛИКТҮҮ КАБЫЛ АЛДЫ
      // ЭМИ ГАНА LOCALSTORAGE
      // =========================

      const oldBookings = JSON.parse(localStorage.getItem("bookings")) || [];

      oldBookings.push(newBooking);

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
      setIsPaid(false);
    } catch (error) {
      console.error("BOOKING ERROR:", error);

      alert("Не удалось связаться с сервером. Попробуйте еще раз.");
    } finally {
      // Эмне болсо да loading өчөт
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

  // Эгер стол табылбаса
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

            <div
              style={{
                background: "#b16666",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            >
              💳 Предоплата: {currentBranch?.prepayment ?? 0} сом
              <br />
              MBANK: {currentBranch?.mbank ?? ""}
              <br />
              <br />
              После проверки предоплаты администратор подтвердит бронирование.
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "10px",
                width: "100%",
                marginBottom: "20px",
              }}
            >
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
              />

              {/* <span>Оплату подтвердил</span> */}
            </label>

            <button onClick={handleBooking} disabled={loading}>
              {loading ? "⏳ «Бронь оформляется...» ✅" : "Бронировать"}
            </button>
          </div>
        </div>
      </div>

      {showSuccess && <SuccessModal />}
    </>
  );
}

export default TableDetails;
