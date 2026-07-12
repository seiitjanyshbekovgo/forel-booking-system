import Header from "../components/Header";
import { useState } from "react";
import axios from "axios";
import { branches } from "../data/branches";

function BookingStatus() {
  const [bookings, setBookings] = useState([]);
  const [phone, setPhone] = useState("+996");
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(false);

  const checkBooking = async () => {
    if (!branch) {
      alert("Пожалуйста, сначала выберите филиал.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(
        "https://forel-booking-system.onrender.com/bookings",
      );

      const foundBookings = res.data.filter(
        (item) => item.phone === phone && item.branch === branch,
      );

      if (foundBookings.length === 0) {
        alert(
          "По указанному номеру телефона активных бронирований не обнаружено. Проверьте правильность введённого номера и попробуйте снова.",
        );
        setBookings([]);
        return;
      }

      setBookings(foundBookings);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="booking-status-page">
        <div className="booking-status-container">
          <h1>📋 Мои брони</h1>

          <p className="booking-description">
            Проверьте статус бронирования по номеру телефона. После проверки
            администрацией вы увидите результат подтверждения или отклонения
            вашей брони.
          </p>
          <div className="search-box">
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="booking-search-input"
            >
              <option value="">Выберите филиал</option>

              {branches.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="+996999766050"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="booking-search-input"
            />

            <button
              onClick={checkBooking}
              className="booking-search-btn"
              disabled={loading}
            >
              {loading ? "⏳ Проверяем..." : "Проверить"}
            </button>
          </div>

          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <h2>{booking.table}</h2>

              <div className="booking-info">
                <p>
                  <strong>Имя:</strong> {booking.name}
                </p>
                <p>
                  <strong>Дата:</strong> {booking.date}
                </p>
                <p>
                  <strong>Время:</strong> {booking.time}
                </p>
              </div>

              <div className="booking-result">
                {booking.status === "accepted" ? (
                  <span className="success-status">✅ Бронь подтверждена</span>
                ) : booking.status === "rejected" ? (
                  <span className="error-status">
                    ❌ Бронирование отклонено из-за отсутствия предоплаты.
                  </span>
                ) : (
                  <span className="pending-status">
                    ⏳ Ожидает проверки администратора
                  </span>
                )}
              </div>

              <div className="booking-help">
                Если статус долго не меняется, свяжитесь с администрацией.
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default BookingStatus;
