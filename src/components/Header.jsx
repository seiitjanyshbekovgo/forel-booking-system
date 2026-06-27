import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <div className="logo">
        <img src={logo} alt="Форель №1" />
      </div>

      <nav>
        <Link to="/">Главная</Link>
        <Link to="/branches">Филиалы</Link>
        <Link to="/contact">Контакты</Link>
        <Link to="/booking-status">Мои заявки</Link>
      </nav>
    </header>
  );
}

export default Header;
