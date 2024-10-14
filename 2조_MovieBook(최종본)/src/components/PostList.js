//24.10.10 정율아
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { PostContext } from "../App";

import "./PostList.css";
import { ReactComponent as HeartIcon } from "./heart.svg"; // Make sure you have the heart.svg in your project


function PostList() {
  const { state, dispatch } = useContext(PostContext);

  const toggleLike = (postId) => {
    dispatch({ type: "TOGGLE_LIKE", payload: postId });
  };

  return (
    <div>
    <div className="postList">
      {/* <h2>Posts</h2> */}
      {state.posts.map((post) => (
        <div className="postItem" key={post.id}>
          <Link to={`/post/${post.id}`}>
            <h4>{post.content}</h4>
          </Link>
          {post.image && (
            <img
              src={post.image}
              alt="Post"
              style={{ width: "100px", height: "auto" }}
            />
          )}

          <p>
            <button 
              className={`likeButton ${post.liked ? "liked" : ""}`}
              onClick={() => toggleLike(post.id)}
            >
              <HeartIcon
                width="24"
                height="24"
                fill={post.liked ? "palevioletred" : " rgb(235, 191, 207)"}
              />
            </button>
            <span style={{ marginLeft: "8px", fontSize: "18px", color: post.liked ? "palevioletred" : " rgb(235, 191, 207)" }}>
              {post.likes}
            </span>
          </p>
        </div>
      ))}
    </div>
  </div>
  );
}

export default PostList;
