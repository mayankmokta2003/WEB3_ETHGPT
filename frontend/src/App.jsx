import AskAI from "./components/AskAi";
import GetResponse from "./components/GetResponse";
import { useState } from "react";
import History from "./components/History";
import Navbar from "./styling/Navbar";


function App() {

  return (
   <div>
    <Navbar />
    <AskAI />
    {/* <History /> */}
   </div>
  )
}

export default App;
