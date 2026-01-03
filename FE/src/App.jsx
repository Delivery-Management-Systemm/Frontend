import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/Login.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import Account from "./pages/Account.jsx";
import Home from "./pages/Home.jsx";
import Vehicles from "./pages/Vehicles.jsx";
import Drivers from "./pages/Drivers.jsx";
import TripManagement from "./pages/TripManagement.jsx";
import Maintenance from "./pages/Maintenance.jsx";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("fms.currentUser");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem("fms.currentUser", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("fms.currentUser");
      }
    } catch (error) {
      // ignore storage errors (private mode, quota, etc.)
    }
  }, [currentUser]);

  if (!currentUser) {
    return <LoginPage onLogin={(user) => setCurrentUser(user)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard layout */}
        <Route
          path="/"
          element={
            <DashboardPage
              currentUser={currentUser}
              onLogout={() => setCurrentUser(null)}
            />
          }
        >
          {/* Trang chủ (Home) */}
          <Route index element={<Home />} />

          {/* Vehicles page */}
          <Route path="vehicles" element={<Vehicles />} />

          {/* Drivers page */}
          <Route path="drivers" element={<Drivers />} />

          {/* Trip Management */}
          <Route path="trips" element={<TripManagement />} />

          {/* Maintenance */}
          <Route path="maintenance" element={<Maintenance />} />
          {/* GPS Tracking (removed) */}

          {/* Account page */}
          <Route path="account" element={<Account />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

