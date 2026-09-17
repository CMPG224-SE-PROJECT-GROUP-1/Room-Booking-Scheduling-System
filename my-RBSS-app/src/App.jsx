// import { useState } from "react";
import "./App.css";
import {LikeButton} from './frontend/components/TestButton'
import Button from './frontend/components/Button'
import Logo from './frontend/components/Logo'


function App() {

  return (
      <div>
        <Logo/>
        <Button variant="solid" fullWidth>Sign in</Button>
        <Button variant="outline" fullWidth>Cancel</Button>
      </div>
      
  );
}

export default App;
