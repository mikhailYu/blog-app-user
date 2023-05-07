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
      // withCredentials: true,
      // credentials: "include",
      headers: {
        "Access-Control-Allow-Origin":
          "https://mikhailyu.github.io/blog-app-user",
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
