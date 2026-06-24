import Header from "../components/Header";
function Branches() {
  const branches = [
    {
      name: "Форель №1",
      address: "филиал горького 1а/7",
      phone: "+996 701 04 06 06",
      map: "https://2gis.kg/bishkek/geo/70000001082809282",
    },
    {
      name: "Форель №1",
      address: "филиал МКР-Джал",
      phone: "+996 501 13 80 06",
      map: "https://2gis.kg/bishkek/geo/70000001114257485",
    },
    {
      name: "Форель №1",
      address: "филиал Ахунбаеа 63",
      phone: "+996 507 08 06 06",
      map: "https://2gis.kg/bishkek/geo/70000001068592133",
    },
    {
      name: "Форель №1",
      address: "филиал Шопокова 126",
      phone: "+996 505 06 06 55",
      map: "https://2gis.kg/bishkek/geo/70000001103467511",
    },
  ];

  return (
    <>
      <Header />
      <div className="branches-page">
        <h1>НАШИ ФИЛИАЛЫ</h1>

        <div className="branches-grid">
          {branches.map((branch, index) => (
            <div key={index} className="branch-card">
              <h2>{branch.name}</h2>

              <p>📍 {branch.address}</p>

              <p>📞 {branch.phone}</p>

              <a href={`tel:${branch.phone}`} className="call-btn">
                позвонить
              </a>

              <a
                href={branch.map}
                target="_blank"
                rel="noreferrer"
                className="map-btn"
              >
                2GIS
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Branches;
