import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";

import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

import BookingStatus from "./pages/BookingStatus";
import Branches from "./pages/Branches";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import TableDetails from "./pages/TableDetails";
import Tables from "./pages/Tables";

import Footer from "./components/Footer";
import SelectBranch from "./pages/SelectBranch";

function AppContent() {
  const location = useLocation();
  // test 
  const hideFooter =
    location.pathname === "/admin" || location.pathname === "/admin-login";

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/table/:id" element={<TableDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/branches" element={<Branches />} />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/booking-status" element={<BookingStatus />} />
        <Route path="/select-branch" element={<SelectBranch />} />
      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
