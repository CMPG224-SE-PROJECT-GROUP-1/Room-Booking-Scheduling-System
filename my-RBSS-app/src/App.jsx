// import { useState } from "react";
import "./App.css";
import { LoginPage } from "./frontend/pages/LoginPage";
import RecoverPassword from "./frontend/pages/RecoverPassword";
import SignUp from "./frontend/pages/SignUp";
import { SidebarProvider } from "./frontend/Sidebar/SidebarContext";
import { ThemeProvider } from "./frontend/theme/ThemeContext";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";


function App() {

  return (
    
      <ThemeProvider>
        <SidebarProvider>
          <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage/>} />
                <Route path="/forgotpassword" element={<RecoverPassword/>} />
                <Route path="/signup" element={<SignUp/>} />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
    </ThemeProvider>
    
    
  );
}

export default App;
