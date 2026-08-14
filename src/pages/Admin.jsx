import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { branches } from "../data/branches";

function Admin() {
  const navigate = useNavigate();

  const isAuth = sessionStorage.getItem("adminAuth");
  const adminData = sessionStorage.getItem("admin");

  // admin маалыматтарын коопсуз окуйбуз
  let admin = null;

  try {
    admin = adminData ? JSON.parse(adminData) : null;
  } catch (error) {
    console.log("Ошибка чтения данных администратора:", error);
    admin = null;
  }

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [bookings, setBookings] = useState([]);

  // Loading
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
    // Админ авторизациядан өткөн болсо гана брондорду жүктөйбүз
    if (isAuth && admin) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [isAuth, adminData]);

  // =========================
  // АВТОРИЗАЦИЯНЫ ТЕКШЕРҮҮ
  // =========================
  if (!isAuth || !admin) {
    return <Navigate to="/admin-login" replace />;
  }

  const adminBranch = admin.branch;

  const currentBranch = branches.find((branch) => branch.slug === adminBranch);

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

  // =========================
  // СТАТИСТИКА
  // =========================
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
    sessionStorage.removeItem("admin");

    navigate("/admin-login");
  };

  // =========================
  // ИЗМЕНЕНИЕ СТАТУСА
  // =========================
  const updateStatus = async (id, status) => {
    try {
      setLoading(true);

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
    try {
      setLoading(true);

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
              padding: "28px 35px",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.18)",
              minWidth: "220px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                border: "5px solid #e5e7eb",
                borderTop: "5px solid #2563eb",
                borderRadius: "50%",
                animation: "admin-loading-spin 0.8s linear infinite",
              }}
            />

            <div
              style={{
                fontSize: "17px",
                fontWeight: "600",
              }}
            >
              Бронирования загружаются...
            </div>

            <div
              style={{
                fontSize: "14px",
                color: "#666",
              }}
            >
              Пожалуйста, подождите.
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
              <th>Предоплата</th>
              <th>Статус</th>
              <th>Процесс</th>
            </tr>
          </thead>

          <tbody>
            {!loading && filteredBookings.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "55px 20px",
                    fontSize: "18px",
                    color: "#666",
                  }}
                >
                  <div
                    style={{
                      fontSize: "30px",
                      marginBottom: "10px",
                    }}
                  >
                    📋
                  </div>

                  <div style={{ fontWeight: "600" }}>
                    Пока нет активных бронирований.
                  </div>

                  <div
                    style={{
                      marginTop: "6px",
                      fontSize: "14px",
                      color: "#888",
                    }}
                  >
                    Новые бронирования появятся здесь.
                  </div>
                </td>
              </tr>
            ) : (
              filteredBookings.map((item) => (
                <tr key={item._id}>
                  <td>{item.table}</td>

                  <td>{item.name}</td>

                  <td>{item.phone}</td>

                  <td>{item.date}</td>

                  <td>{item.time}</td>

                  <td>
                    {item.prepaymentAmount !== undefined &&
                    item.prepaymentAmount !== null ? (
                      <strong>{item.prepaymentAmount} сом</strong>
                    ) : (
                      "—"
                    )}
                  </td>

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
              ))
            )}
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
