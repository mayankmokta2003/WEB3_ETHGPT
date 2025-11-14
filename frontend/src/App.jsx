import AskAI from "./components/AskAi";
import GetResponse from "./components/GetResponse";
import { useState } from "react";
import History from "./components/History";
import Navbar from "./styling/Navbar";


function App() {

  const [latestId, setLatestId] = useState(null);

  return (
   <div>
    <Navbar />
    <AskAI setLatestId={setLatestId}/>
    <GetResponse latestId={latestId}/>
    <History />
   </div>
  )
}

export default App;
