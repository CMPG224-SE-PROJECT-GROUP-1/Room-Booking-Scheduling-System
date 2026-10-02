// import { useState } from "react";
import "./App.css";
import { LoginPage } from "./frontend/pages/LoginPage";
import RecoverPassword from "./frontend/pages/RecoverPassword";
import SignUp from "./frontend/pages/SignUp";
import { Dashboard } from "./frontend/pages/Dashboard";
import { SidebarProvider } from "./frontend/Sidebar/SidebarContext";
import { ThemeProvider } from "./frontend/theme/ThemeContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./frontend/components/AppLayout";
import BannerLayout from "./frontend/components/BannerLayout";
import VerifySignup from "./frontend/pages/VerifySignup";
import Browse from "./frontend/pages/Browse";
import BookingPage from "./frontend/pages/BookingPage";
import ConfirmationPage from "./frontend/pages/ConfirmationPage";
import MyBookings from "./frontend/pages/MyBookings";
import ProtectedRoutes from "./frontend/components/ProtectedRoutes";


function App() {

  return (
    
      <ThemeProvider>
        <SidebarProvider>
          <BrowserRouter>
            <Routes>

              <Route element={<ProtectedRoutes/>}>
                  <Route element={<AppLayout/>}>

                      <Route path="/dashboard" element={<Dashboard/>} />
                      <Route path="/browse" element={<Browse/>} />
                      <Route path="/booking" element={<BookingPage/>} />
                      <Route path="/confirmation" element={<ConfirmationPage/>} />
                      <Route path="/mybookings" element={<MyBookings/>} />

                  </Route>
              </Route>

              <Route element={<BannerLayout/>}>

                  <Route path="/signup" element={<SignUp/>} />
                  <Route path="/" element={<LoginPage/>} />
                  <Route path="/forgotpassword" element={<RecoverPassword/>} />
                  <Route path="/verifyotp" element={<VerifySignup/>} />

              </Route>

    
              <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
          </BrowserRouter>
        </SidebarProvider>
    </ThemeProvider>
    
    
  );
}

export default App;
