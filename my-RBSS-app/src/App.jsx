import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import BigButton from "./components/BigButton";
import LoginPage from "./pages/Login";

function App() {
  const [count, setCount] = useState(0);

  return (
    
      <LoginPage />
    
  );
}

export default App;
