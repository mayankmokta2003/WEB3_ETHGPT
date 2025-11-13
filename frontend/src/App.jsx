import AskAI from "./components/AskAi";
import GetResponse from "./components/GetResponse";
import RecentPrompts from "./components/RecentPrompts";
import { useState } from "react";

function App() {

  const [latestId, setLatestId] = useState(null);

  return (
   <div>
    <AskAI setLatestId={setLatestId}/>
    <GetResponse latestId={latestId}/>
    <RecentPrompts /> 
   </div>
  )
}

export default App;
