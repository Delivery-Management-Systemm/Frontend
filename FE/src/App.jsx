import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import Account from "./pages/Account.jsx";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard là layout chính */}
        <Route path="/" element={<DashboardPage />}>
          {/* Trang mặc định bên trong Dashboard */}
          <Route index element={<div>Chọn mục ở menu</div>} />

          {/* Trang Account */}
          <Route path="account" element={<Account />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


