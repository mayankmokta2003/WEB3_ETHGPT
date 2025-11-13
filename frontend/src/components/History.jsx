
import { useState, useEffect } from "react";


export default function History() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("history")) || [];
        setHistory(stored);
    },[]);


    return(

        <div>

            <h1>📜 Recent Q&A History</h1>

            {history.length === 0 ? (
                <p>No AI responses yet</p>
            ) : (
                <div>
                    {history.map((item,i) => (
                        <div key={i} className="bg-[#161b22] p-5 rounded-xl ">
                            <p><b>🧠 Prompt:</b> {item.prompt}</p>
                            <p><b>🤖 Response:</b> {item.answer}</p>
                            <p style={{ fontSize: "12px", color: "gray" }}>
                            🕓 {item.timestamp}
                            </p>
                        </div>
                    ))}
                </div>

            )}

        </div>


    )




}