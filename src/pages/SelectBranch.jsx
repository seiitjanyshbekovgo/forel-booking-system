import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { branches } from "../data/branches";

function SelectBranch() {
  const navigate = useNavigate();

  return (
    <>
      <Header />

     <div className="branch-select-page">
  <h1>Выберите филиал</h1>
  <p>Выберите филиал для бронирования стола.</p>

  <div className="branch-list">
    {branches.map((branch) => (
      <div key={branch.id} className="branch-card">
        <div>
          <h2>{branch.name}</h2>
          <p>📍 {branch.address}</p>
          <p>📞 {branch.phone}</p>
        </div>

        <button
          className="select-btn"
          onClick={() => navigate(`/tables?branch=${branch.slug}`)}
        >
          Выбрать →
        </button>
      </div>
    ))}
  </div>
</div>
    </>
  );
}

export default SelectBranch;
