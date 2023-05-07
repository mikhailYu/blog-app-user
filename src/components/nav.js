import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { baseUrl } from "../config";
import { useNavigate } from "react-router-dom";

export default function Nav(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [navUser, setNavUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, [location]);

  async function checkAuth() {
    const auth = await props.getUser();

    if ((await auth.status) == 200) {
      const user = await auth.json();
      const result = "Logged in as " + user.username;
      setNavUser(result);
    } else {
      setNavUser("You are not logged in");
    }
  }

  async function logout() {
    const result = await fetch(`${baseUrl}/logout`, {
      method: "POST",
      withCredentials: true,
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
        "Content-Type": "application/json",
        timeout: 100000,
      },
      body: JSON.stringify({}),
    }).then((resp) => {
      return resp;
    });
    if (result.status === 200) {
      if (location.pathname == "/") {
        window.location.reload();
      } else {
        navigate("/");
      }
    } else {
      console.log("Failed to log out");
    }
  }

  return (
    <nav>
      <div className="navCont">
        <h1>Node Blog</h1>
        <p className="navUser">{navUser}</p>

        <ul className="navList">
          <li>
            <Link className="linkNav" to="/">
              Home
            </Link>
          </li>

          <li>
            <Link className="linkNav" to="/login">
              Login
            </Link>
          </li>
          <li>
            <Link className="linkNav" to="/signUp">
              Signup
            </Link>
          </li>

          <li>
            <button type="button" className="logoutBtn" onClick={logout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
