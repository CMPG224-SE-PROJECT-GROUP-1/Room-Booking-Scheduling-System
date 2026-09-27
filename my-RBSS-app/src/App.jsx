// import { useState } from "react";
import "./App.css";
import { LoginPage } from "./frontend/pages/LoginPage";
import { ThemeProvider } from "./frontend/theme/ThemeContext";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";


function App() {

  return (
    <BrowserRouter>
      <ThemeProvider>

        <Routes>
            <Route path="/" element={<LoginPage/>} />
        </Routes>

    </ThemeProvider>
    </BrowserRouter>
    
  );
}

export default App;
