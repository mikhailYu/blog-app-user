import logo from "./logo.svg";
import "./styles/App.css";
import { baseUrl } from "./config";
import { useEffect, useState } from "react";
import uniqid from "uniqid";
import Nav from "./components/nav";
import Main from "./components/main";

function App() {
  async function getUser() {
    const result = await fetch(`${baseUrl}/authCheck`, {
      withCredentials: true,
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return result;
  }

  useEffect(() => {}, []);
  return (
    <div className="App">
      <Nav getUser={getUser} />
      <Main getUser={getUser} />
    </div>
  );
}

export default App;

// function App() {
//   const [comments, setComments] = useState([]);
//   const [commentText, setCommentText] = useState("");
//   useEffect(() => {
//     fetchData();
//     console.log("rerendered");
//   }, []);

//   async function fetchData() {
//     let results = await fetch(`${baseUrl}/post/11111/commentList`).then(
//       (resp) => {
//         return resp.json();
//       }
//     );

//     mapToList(results);
//   }

//   function mapToList(commentsArr) {
//     let newArr = commentsArr.map((comment) => {
//       return (
//         <div key={uniqid()}>
//           <p> {comment._id}</p>
//           <p> {comment.text}</p>
//         </div>
//       );
//     });

//     setComments(newArr);
//   }

//   async function handleSubmit(req) {
//     await fetch(`${baseUrl}/post/11111/newMessage`, {
//       method: "POST",
//       headers: {
//         "content-type": "application/json",
//       },
//       body: JSON.stringify({
//         text: commentText,
//         userId: commentText,
//         postId: commentText,
//       }),
//     }).then((resp) => {
//       resp.json();
//     });
//     fetchData();
//     setCommentText("");
//   }
//   return (
//     <div className="App">
//       <form>
//         <input
//           type="text"
//           onChange={(e) => {
//             setCommentText(e.target.value);
//           }}
//           value={commentText}
//         ></input>
//         <button
//           type="submit"
//           onClick={(e) => {
//             e.preventDefault();
//             handleSubmit(e);
//           }}
//         >
//           Submit
//         </button>
//       </form>
//       {comments}
//     </div>
//   );
// }

// export default App;
