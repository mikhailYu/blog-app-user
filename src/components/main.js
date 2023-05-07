import React from "react";
import { Routes, Route } from "react-router-dom";

import PostPage from "./postPage";
import HomePage from "./homePage";
import LoginPage from "./login";
import SignUpPage from "./signUp";
import { ErrorPage } from "./errorPage";
import PostEditor from "./postEditor";

export default function Main(props) {
  return (
    <Routes>
      <Route
        exact
        path="/"
        element={<HomePage getUser={props.getUser} />}
        getUser={props.getUser}
      ></Route>
      <Route
        exact
        path="/post/:id"
        element={<PostPage getUser={props.getUser} />}
      ></Route>
      <Route
        exact
        path="/newPost"
        element={<PostEditor newPost={true} />}
      ></Route>
      <Route
        exact
        path="/post/:id/editPost"
        element={<PostEditor newPost={false} />}
      ></Route>
      <Route exact path="/login" Component={LoginPage}></Route>
      <Route exact path="/signUp" Component={SignUpPage}></Route>
      <Route exact path="/error" Component={ErrorPage}></Route>
    </Routes>
  );
}
