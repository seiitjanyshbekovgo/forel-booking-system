import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
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

  // Loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

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

  if (!isAuth) {
    return <Navigate to="/admin-login" />;
  }

  const filteredBookings = bookings.filter((item) => {
    if (item.branch !== adminBranch) {
      return false;
    }

    const matchesSearch =
      (item.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.phone || "").includes(search) ||
      (item.table || "").toLowerCase().includes(search.toLowerCase());

    const matchesDate =
      selectedDate === "" || item.date === selectedDate;

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
      await axios.put(
        `https://forel-booking-system.onrender.com/booking/${id}/status`,
        { status },
      );

      fetchBookings();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBooking = async (id) => {
    try {
      await axios.delete(
        `https://forel-booking-system.onrender.com/booking/${id}`,
      );

      fetchBookings();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* =========================
          LOADING OVERLAY
      ========================= */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.25)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999,
          }}
        >
          <div
            style={{
              width: "55px",
              height: "55px",
              border: "6px solid rgba(255, 255, 255, 0.5)",
              borderTop: "6px solid white",
              borderRadius: "50%",
              animation: "admin-loading-spin 0.8s linear infinite",
            }}
          />
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
                    onClick={() =>
                      updateStatus(item._id, "accepted")
                    }
                  >
                    принять
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() =>
                      updateStatus(item._id, "rejected")
                    }
                  >
                    отменить
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteBooking(item._id)
                    }
                  >
                    очистить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================
          LOADING ANIMATION
      ========================= */}
      <style>
        {`
          @keyframes admin-loading-spin {
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