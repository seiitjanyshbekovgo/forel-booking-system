import Header from "../components/Header";
import { useParams } from "react-router-dom";
import table1 from "../assets/table1.jpg";
import table2 from "../assets/table2.jpg";
import table3 from "../assets/table3.jpg";
import table4 from "../assets/table4.jpg";
import table5 from "../assets/table5.jpg";
import table6 from "../assets/table6.jpg";
import table7 from "../assets/table7.jpg";
import table8 from "../assets/table8.jpg";
import table9 from "../assets/table9.jpg";
import table10 from "../assets/table10.jpg";
import table11 from "../assets/table11.jpg";
import vip from "../assets/vip.jpg";
import bigCabin from "../assets/bigCabin.jpg";
import { useState } from "react";

function TableDetails() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+996");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const handleBooking = async () => {
    if (!name || !phone || !date || !time) {
      alert("Заполните все поля.");
      return;
    }
    if (!isPaid) {
      alert("Пожалуйста, подтвердите внесение предоплаты!");
      return;
    }

    if (!phone.startsWith("+996")) {
      alert("Номер телефона должен начинаться с +996!");
      return;
    }

    if (phone.length !== 13) {
      alert("Не провильный формат номер телефона!");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (date < today) {
      alert("Нельзя бронировать на прошедшую дату!");
      return;
    }

    const newBooking = {
      table: table.name,
      name,
      phone,
      date,
      time,
      status: "pending",
    };
    const oldBookings = JSON.parse(localStorage.getItem("bookings")) || [];

    const existingBooking = oldBookings.find((item) => {
      if (
        item.table !== table.name ||
        item.date !== date ||
        item.status !== "accepted"
      ) {
        return false;
      }

      const bookingTime = new Date(`2000-01-01T${item.time}`);
      const newTime = new Date(`2000-01-01T${time}`);

      const diffHours = Math.abs(newTime - bookingTime) / (1000 * 60 * 60);

      return diffHours < 4;
    });

    if (existingBooking) {
      alert("Этот стол уже забронирован на выбранные дату и время!");
      return;
    }

    oldBookings.push(newBooking);

    localStorage.setItem("bookings", JSON.stringify(oldBookings));

    await fetch("http://localhost:8000/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBooking),
    });

    alert(
      "Бронь принята!После проверки предоплаты администратор подтвердит бронирование.Проверить статус брони можно в разделе «Мои заявки».",
    );
    setName("");
    setPhone("");
    setDate("");
    setTime("");
  };

  const tables = [
    {
      id: 1,
      name: "Стол 1",
      seats: "4 мест",
      location: "возле окны",
      image: table1,
    },
    {
      id: 2,
      name: "Стол 2",
      seats: "4 мест",
      location: "возле окны",
      image: table2,
    },
    {
      id: 3,
      name: "Стол 3",
      seats: "4 мест",
      location: "возле окны",
      image: table3,
    },
    {
      id: 4,
      name: "Стол 4",
      seats: "4 мест",
      location: "возле окны",
      image: table4,
    },
    {
      id: 5,
      name: "Стол 5",
      seats: "4 мест",
      location: "возле окны",
      image: table5,
    },
    {
      id: 6,
      name: "Стол 6",
      seats: "6 мест",
      location: "возле аквариума",
      image: table6,
    },
    {
      id: 7,
      name: "Стол 7",
      seats: "4 мест",
      location: "главный зал",
      image: table7,
    },
    {
      id: 8,
      name: "Стол 8",
      seats: "4 мест",
      location: "главный зал",
      image: table8,
    },
    {
      id: 9,
      name: "Стол 9",
      seats: "4 мест",
      location: "в краю",
      image: table9,
    },
    {
      id: 10,
      name: "Стол 10",
      seats: "6 местных",
      location: "Где кабинки",
      image: table10,
    },
    {
      id: 11,
      name: "Стол 11",
      seats: "12 мест",
      location: "где кабинки",
      image: table11,
    },
    {
      id: 12,
      name: "VIP Кабина",
      seats: "14 мест",
      location: " VIP ",
      image: vip,
    },
    {
      id: 13,
      name: "большая кабина",
      seats: "25 местеных",
      location: "для компашка",
      image: bigCabin,
    },
  ];

  const table = tables.find((item) => item.id === Number(id));

  return (
    <>
      <Header />
      <div style={{ padding: "50px" }}>
        <h1>{table.name}</h1>

        <div className="table-info">
          <p>👥 {table.seats}</p>
          <p>📍 {table.location}</p>
        </div>

        <div className="details-container">
          <img
            src={table.image}
            alt={table.name}
            style={{
              width: "450px",
              height: "600px",
              objectFit: "cover",
              borderRadius: "12px",
              margin: "20px 0",
            }}
          />

          <div className="booking-form">
            <h2>FOREL</h2>
            <div
              style={{
                background: "#fff3cd",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            >
              💳 Предоплата: 1500 сом <br /> MBANK: +996 999 76 60 50 <br /> <br />Предоплата
              төлөнгөндөн кийин администратор бронду ырастайт.
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
              />

              <span>Предоплата <br />успешно оплачена.</span>
            </div>
            <input
              type="text"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="999766050"
              value={phone}
              onChange={(e) => {
                const value = e.target.value;

                if (!value.startsWith("+996")) {
                  setPhone("+996");
                  return;
                }

                setPhone(value);
              }}
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />

            <button onClick={handleBooking}>бронировать</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TableDetails;
