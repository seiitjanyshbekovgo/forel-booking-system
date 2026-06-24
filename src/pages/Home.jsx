import Header from "../components/Header";
import heroImage from "../assets/fon.png";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <Header />

      <section
        className="hero"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="hero-overlay">
          <h1>Форель №1</h1>

          <p>Онлайн бронирование</p>

          <Link to="/tables">
            <button>бронирование стола</button>
          </Link>
        </div>
      </section>
      <section
        style={{
          padding: "80px",
          textAlign: "center",
          background: "#f8fafc",
        }}
      >
        <h2 style={{ fontSize: "40px", marginBottom: "20px" }}>
          Почему стоит выбрать нас?
        </h2>

        <p
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            color: "#555",
            fontSize: "18px",
          }}
        >
          В ресторане «Форель» вас ждут комфортные столики, VIP-кабинки, удобная
          система онлайн-бронирования и высокий уровень обслуживания.
        </p>
      </section>
      <section
        style={{
          padding: "80px",
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        <div className="feature-card">
          <h3>🍽️ Блюда на любой вкус</h3>
          <p>Свежеприготовленная рыба и блюда разных национальных кухонь.</p>
        </div>

        <div className="feature-card">
          <h3>🏡 Комфортная обстановка</h3>
          <p>Уютная атмосфера для семьи и друзей.</p>
        </div>

        <div className="feature-card">
          <h3>📱 онлайн бронирование</h3>
          <p>Вы можете забронировать стол всего за несколько секунд.</p>
        </div>
      </section>
    </>
  );
}

export default Home;
