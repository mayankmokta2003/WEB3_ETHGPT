import AskAI from "./components/AskAi";
import GetResponse from "./components/GetResponse";
import RecentPrompts from "./components/RecentPrompts";
import { useState } from "react";
import History from "./components/History";

function App() {

  const [latestId, setLatestId] = useState(null);

  return (
   <div>
    <AskAI setLatestId={setLatestId}/>
    <GetResponse latestId={latestId}/>
    <History />
    {/* <RecentPrompts />  */}
   </div>
  )
}

export default App;
