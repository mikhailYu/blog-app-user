import { useState } from "react";
import "../styles/login_signUp.css";
import { baseUrl } from "../config";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const navigate = useNavigate();

  async function login() {
    const result = await fetch(`${baseUrl}/login`, {
      method: "POST",
      withCredentials: true,
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "https://mikhailyu.github.io",
        Accept: "application/json",
        "Content-Type": "application/json",
        timeout: 100000,
      },
      body: JSON.stringify({
        usernameInput: usernameInput,
        passwordInput: passwordInput,
      }),
    }).then((resp) => {
      return resp;
    });
    if (result.status === 200) {
      navigate("/");
    } else {
      setUsernameInput("");
      setPasswordInput("");
      document.getElementById("loginForm").reset();
    }
  }

  return (
    <div className="loginPageCont">
      <div className="loginBox">
        <form name="loginForm" id="loginForm">
          <label>Username:</label>
          <input
            type="text"
            name="usernameLogin"
            placeholder="Enter Username"
            onChange={(e) => {
              setUsernameInput(e.target.value);
            }}
          ></input>
          <label>Password:</label>
          <input
            type="password"
            name="passwordLogin"
            placeholder="Enter Password"
            onChange={(e) => {
              setPasswordInput(e.target.value);
            }}
          ></input>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              login();
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
