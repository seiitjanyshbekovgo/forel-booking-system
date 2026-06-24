import Header from "../components/Header";
import { Link } from "react-router-dom";

function Tables() {
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  const tables = [
    {
      id: 1,
      name: "Стол 1",
      seats: "на 4 человека",
      location: "возле окны",
    },
    {
      id: 2,
      name: "Стол 2",
      seats: " на 4 человека",
      location: "возле окны",
    },
    {
      id: 3,
      name: "Стол 3",
      seats: " на 4 человека",
      location: "возле окны",
    },
    {
      id: 4,
      name: "Стол 4",
      seats: " на 4 человека",
      location: "возле окны",
    },
    {
      id: 5,
      name: "Стол 5",
      seats: " на 4 человека",
      location: "возле окны",
    },
    {
      id: 6,
      name: "Стол 6",
      seats: " на 6 человека",
      location: "возле аквариума",
    },
    {
      id: 7,
      name: "Стол 7",
      seats: " на 4 человека",
      location: "главный зал",
    },
    {
      id: 8,
      name: "Стол 8",
      seats: " на 4 человека",
      location: "главный зал",
    },
    {
      id: 9,
      name: "Стол 9",
      seats: " на 4 человека",
      location: "в краю зала",
    },
    {
      id: 10,
      name: "Стол 10",
      seats: " на 6 человека",
      location: "в краю где кабинка",
    },
    {
      id: 11,
      name: "Стол 11",
      seats: " на 12 человека",
      location: "в краю",
    },
    {
      id: 12,
      name: "VIP Кабина",
      seats: " на 14 человека",
      location: "отдельно VIP кабинка ",
    },
    {
      id: 13,
      name: "большая кабина",
      seats: " на 25 человека",
      location: "для большая компания",
    },
  ];

  return (
    <>
      return (
      <>
        <Header />

        <div className="table-grid">
          {tables.map((table) => {
            const isBooked = bookings.some(
              (booking) =>
                booking.table === table.name && booking.status === "accepted",
            );

            return (
              <div
                key={table.id}
                className={`table-card ${isBooked ? "booked-card" : ""}`}
              >
                <h3>{table.name}</h3>

                <p>{table.seats}</p>

                <p>{table.location}</p>

                <Link to={`/table/${table.id}`}>
                  <button>Посмотреть</button>
                </Link>
              </div>
            );
          })}
        </div>
      </>
      );
    </>
  );
}

export default Tables;
