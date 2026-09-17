// import { useState } from "react";
import "./App.css";
import {LikeButton} from './frontend/components/TestButton'
import Button from './frontend/components/Button'


function App() {

  return (
      <div>
        <Button variant="solid" fullWidth>Sign in</Button>
        <Button variant="outline">Cancel</Button>
      </div>
      
  );
}

export default App;
