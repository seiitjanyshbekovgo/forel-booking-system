import "./SuccessModal.css";

function SuccessModal() {
  return (
    <div className="success-overlay">
      <div className="success-modal">
        <div className="success-icon">✅</div>

        <h2>Бронирование успешно оформлено!</h2>

        <p>
          После проверки предоплаты администратор подтвердит ваше бронирование.
        </p>

        <p>
          Проверить статус заявки можно в разделе
          <strong> «Мои заявки»</strong>.
        </p>

        <div className="success-info">
          Автоматический переход на главную страницу через{" "}
          <strong>20 секунд</strong>...
        </div>

        <div className="progress">
          <div className="progress-bar"></div>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;
