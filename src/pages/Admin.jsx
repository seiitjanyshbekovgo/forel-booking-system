import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Admin() {
  const navigate = useNavigate();
  const isAuth = sessionStorage.getItem("adminAuth");

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("https://forel-booking-system.onrender.com/bookings");
      setBookings(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!isAuth) {
    return <Navigate to="/admin-login" />;
  }

  const filteredBookings = bookings.filter((item) => {
    const matchesSearch =
      (item.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.phone || "").includes(search) ||
      (item.table || "").toLowerCase().includes(search.toLowerCase());

    const matchesDate = selectedDate === "" || item.date === selectedDate;

    return matchesSearch && matchesDate;
  });

  const totalBookings = filteredBookings.length;

  const acceptedBookings = filteredBookings.filter(
    (item) => item.status === "accepted",
  ).length;

  const pendingBookings = filteredBookings.filter(
    (item) => item.status === "pending" || !item.status,
  ).length;

  const rejectedBookings = filteredBookings.filter(
    (item) => item.status === "rejected",
  ).length;

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    navigate("/admin-login");
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`https://forel-booking-system.onrender.com/booking/${id}/status`, { status });

      fetchBookings();
    } catch (error) {
      console.log(error);
    }
  };
  const deleteBooking = async (id) => {
    try {
      await axios.delete(`https://forel-booking-system.onrender.com/booking/${id}`);

      fetchBookings();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>FOREL</h1>

      <div className="stats">
        <div>📋 все бронирование: {totalBookings}</div>
        <div>✅ Подтверждено: {acceptedBookings}</div>
        <div>⏳ в ожидании: {pendingBookings}</div>
        <div>❌ Отклонено: {rejectedBookings}</div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Выйти
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Стол</th>
            <th>Имя</th>
            <th>Телефон</th>
            <th>Дата</th>
            <th>Время</th>
            <th>Статус</th>
            <th>Процесс</th>
          </tr>
        </thead>

        <tbody>
          {filteredBookings.map((item) => (
            <tr key={item._id}>
              <td>{item.table}</td>
              <td>{item.name}</td>
              <td>{item.phone}</td>
              <td>{item.date}</td>
              <td>{item.time}</td>

              <td>
                {item.status === "accepted"
                  ? "✅ принято"
                  : item.status === "rejected"
                    ? "❌ отказано"
                    : "⏳ в ожидании"}
              </td>

              <td>
                <button
                  className="accept-btn"
                  onClick={() => updateStatus(item._id, "accepted")}
                >
                  принять
                </button>

                <button
                  className="reject-btn"
                  onClick={() => updateStatus(item._id, "rejected")}
                >
                  отменить
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteBooking(item._id)}
                >
                  очистить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
