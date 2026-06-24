import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function AdminLogin() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    if (login === "admin" && password === "1980") {
      sessionStorage.setItem("adminAuth", "true");
      navigate("/admin");
    } else {
      alert("Логин или пароль не провиьно!");
    }
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
