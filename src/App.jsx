import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

import Home from "./pages/Home";
import Tables from "./pages/Tables";
import TableDetails from "./pages/TableDetails";
import Contact from "./pages/Contact";
import Branches from "./pages/Branches";
import BookingStatus from "./pages/BookingStatus";

import Footer from "./components/Footer";

function AppContent() {
  const location = useLocation();

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
