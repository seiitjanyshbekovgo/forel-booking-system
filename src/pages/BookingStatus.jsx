import Header from "../components/Header";
import { useState } from "react";
import axios from "axios";

function BookingStatus() {
  const [bookings, setBookings] = useState([]);
  const [phone, setPhone] = useState("+996");

  const checkBooking = async () => {
    try {
      const res = await axios.get("https://forel-booking-system.onrender.com/bookings");

      const foundBookings = res.data.filter((item) => item.phone === phone);

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
            <input
              type="text"
              placeholder="+996999766050"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="booking-search-input"
            />

            <button onClick={checkBooking} className="booking-search-btn">
              Проверить
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
