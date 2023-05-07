import { useEffect, useState } from "react";
import { baseUrl } from "../config";
import { redirect, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/postPage.css";
import uniqid from "uniqid";

export default function PostPage(props) {
  let params = useParams();
  let navigate = useNavigate();

  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [postDate, setPostDate] = useState("");
  const [postUpdated, setPostUpdated] = useState("");

  const [commentList, setCommentList] = useState("");
  const [commentInput, setCommentInput] = useState("");

  const [user, setUser] = useState("");

  useEffect(() => {
    loadPost();
  }, []);

  async function loadPost() {
    let result = await fetch(`${baseUrl}/post/${params.id}`)
      .then((resp) => {
        if (resp.status !== 200) {
          errorRedirect();
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
    enableComments();
    renderPage(result);
  }
  async function enableComments() {
    const auth = await props.getUser();
    setUser(await auth.json());

    if ((await auth.status) == 200) {
      document.getElementById("postPageLoginMessage").style.display = "none";
    } else {
      document.getElementById("newCommentForm").style.display = "none";
    }
  }

  function errorRedirect() {
    navigate("/error");
  }
  function renderPage(postInfo) {
    setPostTitle(postInfo.title);
    setPostDate(postInfo.datePostedFormatted);
    setPostText(postInfo.mainText);

    if (postInfo.dateUpdated) {
      setPostUpdated("Last updated: " + postInfo.dateUpdatedFormatted);
    }

    if (postInfo.comments.length == 0 || !postInfo.comments) {
      setCommentList("No Comments");
    } else {
      const comments = postInfo.comments.map((comment) => {
        return (
          <div key={uniqid()} className="commentCont">
            <p className="commentUser">{comment.userId.username}</p>
            <p className="commentDate">{comment.datePostedFormatted}</p>
            <p>{comment.text}</p>
          </div>
        );
      });
      setCommentList(comments);
    }
  }

  function handleEditClick() {
    navigate("/post/" + params.id + "/editPost");
  }

  function handleSubmit() {
    if (commentInput == "") {
      alert("Please enter comment");
    } else {
      postComment();
    }
  }

  async function postComment() {
    const result = await fetch(`${baseUrl}/post/` + params.id + "/newMessage", {
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
        text: commentInput,
        userId: user._id,
        postId: params.id,
      }),
    }).then((resp) => {
      return resp.json();
    });

    const pushResult = await fetch(
      `${baseUrl}/post/` + params.id + "/newComment",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          newCommentId: result,
          id: params.id,
        }),
      }
    );

    setCommentInput("");
    document.getElementById("newCommentForm").reset();
    loadPost();
  }
  return (
    <div className="postPageCont">
      <div className="postCont">
        <div className="postContUpper">
          <div className="postTitle">
            <p>{postTitle}</p>{" "}
          </div>
          <div className="postDate">{postDate}</div>
          <div className="postUpdated">{postUpdated}</div>
        </div>
        <div className="postText">{postText}</div>
      </div>
      <div className="commentsCont">
        <div className="commentsList">{commentList}</div>

        <p id="postPageLoginMessage">Please log in to post a comment</p>
        <form name="newCommentForm" id="newCommentForm">
          <textarea
            name="newCommentInput"
            id="newCommentInput"
            placeholder="New Comment"
            onChange={(e) => {
              setCommentInput(e.target.value);
            }}
            maxLength="10000"
          ></textarea>
          <button
            className="newCommentButton"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
