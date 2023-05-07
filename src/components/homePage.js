import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseUrl } from "../config";
import { useNavigate } from "react-router-dom";
import uniqid from "uniqid";
import "../styles/homePage.css";
import { DateTime } from "luxon";
export default function HomePage(props) {
  const [userAuthSection, setUserAuthSection] = useState(null);
  const [postsList, setPostsList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkPosts();
    checkAuth();
  }, []);

  async function checkPosts() {
    // get posts and if the exist then
    // for each post make a h2 of the title
    // and then the date and snippet of text from the post
    // also number of comments, leave space for del in the posting site

    const result = await fetch(`${baseUrl}/posts`).then((resp) => {
      return resp.json();
    });

    if (result.length != 0) {
      const postsList = result.map((post) => {
        if (post.published == "true") {
          let title = generatePostTitle(post.title);
          let text = generatePostText(post.mainText);
          // let dateCut = post.datePosted.slice(0, 10);

          const postId = post._id;

          return (
            <div
              className="postPreviewCont"
              onClick={() => {
                navigate("/post/" + postId);
              }}
              key={uniqid()}
            >
              <div className="postPreviewUpper">
                <h2 className="postPreviewTitle">{title}</h2>
                <p className="postPreviewDate">{post.datePostedFormatted}</p>
              </div>
              <p>{text}</p>
              <p> {post.comments.length} 💬</p>
            </div>
          );
        } else {
          return;
        }
      });

      if (postsList.length == 0 || !postsList) {
        setPostsList("No posts");
      } else {
        setPostsList(postsList);
      }
    } else {
      setPostsList("No posts");
    }
  }

  function generatePostTitle(title) {
    if (title.length > 15) {
      let cutTitle = title.slice(0, 15).concat("...");
      return cutTitle;
    }
    return title;
  }

  function generatePostText(text) {
    if (text.length > 300) {
      let cutText = text.slice(0, 300).concat("...");
      return cutText;
    }
    return text;
  }

  async function checkAuth() {
    const auth = await props.getUser();

    if ((await auth.status) == 200) {
      const user = await auth.json();
      const authSection = (
        <div className="authSectionHome">
          <p>Welcome {user.username}!</p>
        </div>
      );
      setUserAuthSection(authSection);
    } else {
      const authSection = (
        <div className="authSectionHome">
          <span>You are not logged in. Please </span>
          <Link to="/signUp">
            <span className="authLinkSpan">Sign Up</span>
          </Link>
          <span> or </span>
          <Link to="/login">
            <span className="authLinkSpan">Log in</span>
          </Link>
        </div>
      );
      setUserAuthSection(authSection);
    }
  }

  return (
    <div className="homeCont">
      {userAuthSection}
      <div className="postsListCont">
        <h2 className="postsListHeader"> Posts:</h2>
        {postsList}
      </div>
    </div>
  );
}
