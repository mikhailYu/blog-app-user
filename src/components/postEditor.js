import { useEffect, useState } from "react";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../config";
import "../styles/postEditor.css";

export default function PostEditor(props) {
  const navigate = useNavigate();
  let params = useParams();

  const [titleInput, setTitleInput] = useState("");
  const [mainTextInput, setMainTextInput] = useState("");

  const [existingTitle, setExistingTitle] = useState("");
  const [existingText, setExistingText] = useState("");

  const [publishCheck, setPublishCheck] = useState(false);

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    if (props.newPost) {
      document.getElementById("updateButton").style.display = "none";
      document.getElementById("deleteButton").style.display = "none";
    } else {
      document.getElementById("saveButton").style.display = "none";
      loadExistingData();
    }
  }

  async function loadExistingData() {
    let result = await fetch(`${baseUrl}/post/${params.id}`)
      .then((resp) => {
        if (resp.status !== 200) {
          return;
        } else {
          return resp.json();
        }
      })
      .catch((err) => {
        if (err) {
          console.log("invalid page");
        }
      });

    setTitleInput(result.title);
    setExistingTitle(result.title);
    setMainTextInput(result.mainText);
    setExistingText(result.mainText);

    const publishCheckBox = document.getElementById("publishInput");

    if (result.published === "true") {
      publishCheckBox.checked = true;
      setPublishCheck("true");
    } else {
      publishCheckBox.checked = false;
    }
  }

  function savePostCheck() {
    if (titleInput == "" || mainTextInput == "") {
      alert("Please fill in all fields");
      return;
    }
    savePost();
  }

  function updatePostCheck() {
    if (titleInput == "" || mainTextInput == "") {
      alert("Please fill in all fields");
      return;
    }
    updatePost();
  }

  async function savePost() {
    const result = await fetch(`${baseUrl}/post/create`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        title: titleInput,
        mainText: mainTextInput,
        published: publishCheck,
      }),
    }).then((resp) => {
      return resp.json();
    });

    navigate("/post/" + result);
  }

  async function updatePost() {
    const result = await fetch(`${baseUrl}/post/` + params.id + "/edit", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        title: titleInput,
        mainText: mainTextInput,
        published: publishCheck,
        id: params.id,
      }),
    }).then((resp) => {
      return resp.json();
    });
    navigate(-1);
  }

  async function deletePost() {
    const result = await fetch(`${baseUrl}/post/` + params.id + "/delete", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: params.id,
      }),
    });
    navigate("/");
  }
  return (
    <div className="postEditorCont">
      <form id="postEditorForm" name="postEditorForm">
        <div className="postEditorLine">
          <label>Title:</label>
          <input
            type={"text"}
            id="postTitleInput"
            placeholder="Enter Title"
            defaultValue={existingTitle}
            onChange={(e) => {
              setTitleInput(e.target.value);
            }}
          ></input>
        </div>
        <div className="postEditorLine">
          <label>Text:</label>
          <textarea
            id="mainTextInput"
            placeholder="Enter Text"
            defaultValue={existingText}
            onChange={(e) => {
              setMainTextInput(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="postEditorLine checkBox">
          <label>Publish?</label>
          <input
            type={"checkbox"}
            id="publishInput"
            onChange={(e) => {
              setPublishCheck(e.target.checked);
            }}
          ></input>
        </div>
        <div className="postEditorFormButtonsCont">
          <button
            type="button"
            id="saveButton"
            onClick={(e) => {
              e.preventDefault();
              savePostCheck();
            }}
          >
            Save
          </button>

          <button
            type="button"
            id="updateButton"
            onClick={(e) => {
              e.preventDefault();
              updatePostCheck();
            }}
          >
            Update
          </button>
          <button
            type="button"
            id="discardButton"
            onClick={() => {
              navigate(-1);
            }}
          >
            Discard
          </button>
          <button type="button" id="deleteButton" onClick={deletePost}>
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
