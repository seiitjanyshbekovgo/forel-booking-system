import Header from "../components/Header";
import { Link, useSearchParams } from "react-router-dom";
import { gorkiyTables } from "../data/tables/gorkiy";
import { jalTables } from "../data/tables/jal";
import { axunTables } from "../data/tables/axun";
import { shopokTables } from "../data/tables/shopok";

function Tables() {
  const [searchParams] = useSearchParams();

  const branch = searchParams.get("branch");
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  let tables = [];

  switch (branch) {
    case "gorkiy":
      tables = gorkiyTables;
      break;

    case "jal":
      tables = jalTables;
      break;

    case "axun":
      tables = axunTables;
      break;

    case "shopok":
      tables = shopokTables;
      break;

    default:
      tables = [];
  }

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

                <Link to={`/table/${table.id}?branch=${branch}`}>
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
