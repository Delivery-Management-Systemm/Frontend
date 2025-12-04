import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/Login.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import Account from "./pages/Account.jsx";
import Home from "./pages/Home.jsx";   // 👈 IMPORT Home.jsx
import Vehicles from "./pages/Vehicles.jsx";
import Drivers from "./pages/Drivers.jsx";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard layout */}
        <Route path="/" element={<DashboardPage />}>

          {/* 👈 Trang chủ (Home) */}
          <Route index element={<Home />} />

          {/* Vehicles page */}
          <Route path="vehicles" element={<Vehicles />} />

          {/* Account page */}
          <Route path="account" element={<Account />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
