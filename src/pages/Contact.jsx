import Header from "../components/Header";
function Contact() {
  return (
    <>
    <Header/>
    <div className="contact-page">
      <div className="contact-card">
        <h1>Байланыш</h1>

        <p>📍 Горького 1а/7</p>

        <p>
          <a className="phone-link" href="tel:+996701040606">
            📞 +996 701 040 606
          </a>
        </p>

        <a
          className="whatsapp-btn"
          href="https://wa.me/996701040606"
          target="_blank"
        >
          WhatsApp
        </a>

        <a className="menu-btn" href="https://forel1.qrmenu.kg/" target="_blank">
          Онлайн меню
        </a>
        <a className="gis-btn" href="https://2gis.kg/bishkek/geo/70000001082809282" target="_blank">
          📍 2GIS карта
        </a>
      </div>
    </div>
    </>
  );
}

export default Contact;
