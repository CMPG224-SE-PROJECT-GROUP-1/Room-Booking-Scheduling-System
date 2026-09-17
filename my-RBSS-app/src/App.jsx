// import { useState } from "react";
import "./App.css";
import ClickableBox from './frontend/components/TestButton'
import Button from './frontend/components/Button'
import Logo from './frontend/components/Logo'
import ThemeToggle from "./frontend/components/ThemeToggle";
import TopNav from "./frontend/components/TopNav";
import { ThemeProvider } from "./frontend/theme/ThemeContext";


function App() {

  return (
    <ThemeProvider>
      <div>
        <TopNav/>
        <Button variant="solid" fullWidth>Sign in</Button>
        <ClickableBox text="HELLO, WORLD"/>
        <Button variant="outline" fullWidth>Cancel</Button>

      </div>
    </ThemeProvider>
  );
}

export default App;
