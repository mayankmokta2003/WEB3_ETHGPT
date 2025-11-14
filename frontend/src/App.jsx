import AskAI from "./components/AskAi";
import GetResponse from "./components/GetResponse";
import { useState } from "react";
import History from "./components/History";
import Navbar from "./styling/Navbar";


function App() {

  return (
   <div className="bg-gradient-to-r from-purple-900 via-yellow-900 via-green-900 to-blue-900 rounded-2xl pt-4">
    <Navbar />
    <AskAI />
    {/* <History /> */}
   </div>
  )
}

export default App;
