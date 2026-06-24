function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2>Форель</h2>
          <p>
            Вкусная кухня и уютная атмосфера для отдыха с семьей и друзьями.
          </p>
        </div>

        <div className="footer-section">
          <h3>Контакты</h3>
          <p>📞 +996 999 999 999</p>
          <p>📍 Бишкек, Кыргызстан</p>
          <p>🕒 Ежедневно: 10:00 – 00:00</p>
        </div>

        <div className="footer-section">
          <h3>Социальные сети</h3>

          <a
            href="https://www.instagram.com/forel_nomer_1?igsh=cmRrcm0zbmQ3bHJz/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>

          <a href="https://wa.me/996701040606" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Ресторан «Форель». Все права защищены.</p>

        <p className="developer">
          Разработано <strong>Seiit Suyunaly uulu</strong>
          <p>telegram @Janyshbekovgo</p>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
