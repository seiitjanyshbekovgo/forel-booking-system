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
  //
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const branch = searchParams.get("branch");
  const currentBranch = branches.find((item) => item.slug === branch);
  //
  const handleBooking = async () => {
    if (loading) return;

    if (!name || !phone || !date || !time) {
      alert("Заполните все поля.");
      return;
    }

    if (!isPaid) {
      alert("Пожалуйста, подтвердите внесение предоплаты!");
      return;
    }

    if (!phone.startsWith("+996")) {
      alert("Номер телефона должен начинаться с +996!");
      return;
    }

    if (phone.length !== 13) {
      alert("Не правильный формат номер телефона!");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (date < today) {
      alert("Нельзя бронировать на прошедшую дату!");
      return;
    }

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

      const oldBookings = JSON.parse(localStorage.getItem("bookings")) || [];

      const existingBooking = oldBookings.find((item) => {
        if (
          item.table !== table.name ||
          item.date !== date ||
          item.status !== "accepted"
        ) {
          return false;
        }

        const bookingTime = new Date(`2000-01-01T${item.time}`);
        const newTime = new Date(`2000-01-01T${time}`);

        const diffHours = Math.abs(newTime - bookingTime) / (1000 * 60 * 60);

        return diffHours < 4;
      });

      if (existingBooking) {
        alert("Этот стол уже забронирован на выбранные дату и время!");
        return;
      }

      oldBookings.push(newBooking);

      localStorage.setItem("bookings", JSON.stringify(oldBookings));

      const response = await fetch(
        "https://forel-booking-system.onrender.com/booking",
        // "http://localhost:8000/booking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBooking),
        },
      );

      if (!response.ok) {
        throw new Error("Ошибка сервера");
      }

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/");
      }, 20000);

      setName("");
      setPhone("+996");
      setDate("");
      setTime("");
      setIsPaid(false);
    } catch (error) {
      console.error(error);
      alert("Ошибка при бронировании. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };
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

  return (
    <>
      <Header />
      {loading && (
        <div className="loading-overlay">
          <div className="loading-box">
            <div className="spinner"></div>

            <h2>Бронь оформляется...</h2>

            <p>Пожалуйста, подождите</p>
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
              💳 Предоплата: {currentBranch.prepayment} сом
              <br />
              MBANK: {currentBranch.mbank}
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

              {/* <span>Я оплатил предоплату.</span> */}
            </label>

            <button onClick={handleBooking} disabled={loading}>
              {loading ? "⏳ Брондолууда..." : "Бронировать"}
            </button>
          </div>
        </div>
      </div>
      {showSuccess && <SuccessModal />}
    </>
  );
}

export default TableDetails;
