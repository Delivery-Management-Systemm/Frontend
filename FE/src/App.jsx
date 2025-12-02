import React, { useState } from "react";
import LoginPage from "./pages/Login.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return <DashboardPage />;
}

export default App;


