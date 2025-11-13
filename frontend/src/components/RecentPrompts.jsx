// import React, { useEffect, useState } from "react";

// export default function RecentPrompts() {
//     const [prompts, setPrompts] = useState([]);
//     useEffect(() => {
//         const saved = JSON.parse(localStorage.getItem("prompts")) || [];
//         setPrompts(saved);
//     },[]);


// return (    
//     <div>
//         <h1>Recent Prompts</h1>

//         {prompts.length === 0 ? (
//             <p>No prompts yet!</p>
//         ):(
//             <ul>
//                 {prompts.map((p,i) => (
//                     <li key={p}>{i}</li>
//                 ))}
//             </ul>
//         ) }
//     </div>
// )

// }