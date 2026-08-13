import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { branches } from "../data/branches";

function Admin() {
  const navigate = useNavigate();

  const isAuth = sessionStorage.getItem("adminAuth");
  const admin = JSON.parse(sessionStorage.getItem("admin"));

  const adminBranch = admin.branch;
  const currentBranch = branches.find((branch) => branch.slug === adminBranch);

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // БРОНДОРДУ ЖҮКТӨӨ
  // =========================
  const fetchBookings = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        "https://forel-booking-system.onrender.com/bookings",
      );

      setBookings(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (!isAuth) {
    return <Navigate to="/admin-login" />;
  }

  // =========================
  // ФИЛЬТРАЦИЯ
  // =========================
  const filteredBookings = bookings.filter((item) => {
    if (item.branch !== adminBranch) {
      return false;
    }

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

  // =========================
  // ВЫХОД
  // =========================
  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    navigate("/admin-login");
  };

  // =========================
  // ИЗМЕНЕНИЕ СТАТУСА
  // =========================
  const updateStatus = async (id, status) => {
    setLoading(true);

    try {
      await axios.put(
        `https://forel-booking-system.onrender.com/booking/${id}/status`,
        { status },
      );

      await fetchBookings();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // =========================
  // УДАЛЕНИЕ БРОНИ
  // =========================
  const deleteBooking = async (id) => {
    setLoading(true);

    try {
      await axios.delete(
        `https://forel-booking-system.onrender.com/booking/${id}`,
      );

      await fetchBookings();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      {/* =========================
          LOADING
      ========================= */}
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "25px 35px",
              borderRadius: "15px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px",
              boxShadow: "0 5px 25px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                width: "45px",
                height: "45px",
                border: "5px solid #ddd",
                borderTop: "5px solid #2563eb",
                borderRadius: "50%",
                animation: "adminSpinner 0.8s linear infinite",
              }}
            ></div>

            <div
              style={{
                fontSize: "17px",
                fontWeight: "600",
              }}
            >
              Загрузка...
            </div>
          </div>
        </div>
      )}

      {/* =========================
          ADMIN PANEL
      ========================= */}
      <div style={{ padding: "40px" }}>
        <h1>{currentBranch?.name || "FOREL"}</h1>

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

      {/* Spinner animation */}
      <style>
        {`
          @keyframes adminSpinner {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </>
  );
}

export default Admin;
