// import { useState } from "react";
import "./App.css";
import { LoginPage } from "./frontend/pages/LoginPage";
import RecoverPassword from "./frontend/pages/RecoverPassword";
import SignUp from "./frontend/pages/SignUp";
import { Dashboard } from "./frontend/pages/Dashboard";
import { SidebarProvider } from "./frontend/Sidebar/SidebarContext";
import { ThemeProvider } from "./frontend/theme/ThemeContext";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AppLayout from "./frontend/components/AppLayout";
import BannerLayout from "./frontend/components/BannerLayout";


function App() {

  return (
    
      <ThemeProvider>
        <SidebarProvider>
          <BrowserRouter>
            <Routes>

                <Route element={<AppLayout/>}>

                  <Route path="/dashboard" element={<Dashboard/>} />

                </Route>

                <Route element={<BannerLayout/>}>

                  <Route path="/signup" element={<SignUp/>} />
                  <Route path="/" element={<LoginPage/>} />
                  <Route path="/forgotpassword" element={<RecoverPassword/>} />

                </Route>
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
    </ThemeProvider>
    
    
  );
}

export default App;
