import { useState } from "react";
import "../styles/login_signUp.css";
import { useParams } from "react-router-dom";
import { baseUrl } from "../config";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  let params = useParams();
  let navigate = useNavigate();
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  async function signUp(req) {
    const result = await fetch(`${baseUrl}/signUp`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username: usernameInput,
        password: passwordInput,
      }),
    });

    if (result.status != 200) {
      setUsernameInput("");
      setPasswordInput("");
      document.getElementById("signUpForm").reset();
    } else {
      autoLogin();
    }
  }

  async function autoLogin() {
    const result = await fetch(`${baseUrl}/login`, {
      method: "POST",
      withCredentials: true,
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "*",
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
    }
  }

  return (
    <div className="signUpCont">
      <div className="signUpBox">
        <form name="signUpForm" id="signUpForm">
          <label>Username:</label>
          <input
            type="text"
            name="usernameSignUp"
            placeholder="New Username"
            onChange={(e) => {
              setUsernameInput(e.target.value);
            }}
          ></input>
          <label>Password:</label>
          <input
            type="password"
            name="passwordSignUp"
            placeholder="New Password"
            onChange={(e) => {
              setPasswordInput(e.target.value);
            }}
          ></input>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              signUp(e);
            }}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
