// import { useState } from "react";
import "./App.css";
import { LoginPage } from "./frontend/pages/LoginPage";
import RecoverPassword from "./frontend/pages/RecoverPassword";
import SignUp from "./frontend/pages/SignUp";
import { ThemeProvider } from "./frontend/theme/ThemeContext";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";


function App() {

  return (
    <BrowserRouter>
      <ThemeProvider>

        <Routes>
            <Route path="/" element={<LoginPage/>} />
            <Route path="/forgotpassword" element={<RecoverPassword/>} />
            <Route path="/signup" element={<SignUp/>} />
        </Routes>

    </ThemeProvider>
    </BrowserRouter>
    
  );
}

export default App;
