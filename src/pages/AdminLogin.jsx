import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function AdminLogin() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const admins = [
    {
      login: "Горький",
      password: "5555",
      branch: "gorkiy",
    },
    {
      login: "Жал",
      password: "123456",
      branch: "jal",
    },
    {
      login: "Ахунбаева",
      password: "123456",
      branch: "axun",
    },
    {
      login: "Шопокова",
      password: "123456",
      branch: "shopok",
    },
  ];

  const handleLogin = () => {
    const admin = admins.find(
      (item) => item.login === login && item.password === password,
    );

    if (!admin) {
      alert("Логин или пароль неправильный!");
      return;
    }

    sessionStorage.setItem("adminAuth", "true");

    sessionStorage.setItem("admin", JSON.stringify(admin));

    navigate("/admin");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>🔐 Admin Panel</h1>

        <input
          type="text"
          placeholder="Логин"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>войти</button>
      </div>
    </div>
  );
}

export default AdminLogin;
