//24.10.10 정율아
import React, { useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import styled from "styled-components";
import { ReactComponent as HeartIcon } from "./heart.svg"; // Import Heart SVG
import "./PostList.css"; // Ensure you're using the same CSS as PostList.js

// Styled components similar to PostDetail.js
const PostContainer = styled.div`
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: palevioletred transparent;
  font-size: 11px;
  white-space: pre;
  color: #c5749d;
  padding: 0.3rem;
  border-right: ${({ isFirst, isLast }) =>
    isFirst ? "none" : "1px solid #ccc"};
  border-top: ${({ isFirst }) => (isFirst ? "none" : "1px solid #ccc")};

  /* Custom scrollbar styles */
  &::-webkit-scrollbar {
    width: 12px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: palevioletred;
    border-radius: 10px;
    border: 3px solid transparent;
    background-clip: padding-box;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  // h4 {
  //   font-size: 14px;
  //   color: palevioletred;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   white-space: nowrap;
  // }
  h4 {
    text-decoration: none;
    font-size: 14px;
    cursor: pointer;
    color: rgb(235, 191, 207);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  h4:hover {
    color: palevioletred;
  }
`;

// const PostTitle = styled.h4`
//   color: palevioletred;
// `;
const PostTitle = styled.h4`
  color: palevioletred;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; // Prevent text wrapping
`;
// const PostContainer = styled.div`
//   padding: 20px;
//   background-color: #f8f9fa;
//   border-radius: 10px;
//   overflow-y: auto;
//   box-sizing: border-box;
// `;

// const PostTitle = styled.h4`
//   color: palevioletred;
// `;

const LikeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    transition: fill 0.2s ease;
  }

  &.liked svg {
    fill: palevioletred;
  }
`;

const initialLocalState = {
  newPosts: [],
};

function newPostReducer(localState, action) {
  switch (action.type) {
    case "CREATE_POST":
      return {
        ...localState,
        newPosts: [action.payload, ...localState.newPosts],
      };
    case "TOGGLE_LIKE":
      return {
        ...localState,
        newPosts: localState.newPosts.map((post) =>
          post.localId === action.payload
            ? {
                ...post,
                likes: post.liked ? post.likes - 1 : post.likes + 1,
                liked: !post.liked,
              }
            : post
        ),
      };
    default:
      return localState;
  }
}
export const PostNewContext = React.createContext();
export function postReducer(state, action) {
  switch (action.type) {
    case "ADD_COMMENT":
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id === action.payload.postId) {
            return {
              ...post,
              comments: post.comments.concat(action.payload.comment), // Add the new comment and return a new array
              // comments: [...post.comments, action.payload.comment], // Add the new comment to the array
            };
          }
          return post;
        }),
      };

    case "DELETE_COMMENT":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment.id !== action.payload.commentId
                ),
              }
            : post
        ),
      };
    case "EDIT_COMMENT":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment.id === action.payload.commentId
                    ? { ...comment, text: action.payload.text }
                    : comment
                ),
              }
            : post
        ),
      };

    case "TOGGLE_LIKE":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload
            ? {
                ...post,
                likes: post.liked ? post.likes - 1 : post.likes + 1,
                liked: !post.liked, // Toggle the liked status
              }
            : post
        ),
      };

    default:
      return state;
  }
}
export const PostContext = React.createContext();
const PostNewItem = ({ post }) => {
  const [loading, setLoading] = useState(true); // Add loading state
  const TMDB_API_KEY = "";
  const movieId = 550;

  const [localState, localDispatch] = useReducer(
    newPostReducer,
    initialLocalState
  );

  useEffect(() => {
    let localIdCounter = 0; // Initialize a counter for localId
    const fetchMovieReviews = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${TMDB_API_KEY}`
        );

        // const posts = response.data.results.map((post) => ({
        //   localId: Date.now(), // Unique identifier for local state
        //   id: post.id, // ID from the API response
        const posts = response.data.results.map((post) => ({
          localId: localIdCounter++, // Assign the incremented localId starting from 0
          id: post.id, // ID from the API response
          content: post.content,
          likes: 0,
          liked: false,
          comments: [],
        }));

        posts.forEach((post) => {
          localDispatch({ type: "CREATE_POST", payload: post });
        });
        setLoading(false); // Set loading to false after posts are fetched
      } catch (error) {
        console.error("Error fetching movie reviews:", error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchMovieReviews();
  }, [localDispatch, movieId]);

  // const handlePostClick = (localId) => {
  //   navigate(`/post/${localId}`);
  // };

  const handleToggleLike = (localId) => {
    localDispatch({ type: "TOGGLE_LIKE", payload: localId });
  };
  // const toggleLike = (postId) => {
  //   dispatch({ type: "TOGGLE_LIKE", payload: postId });
  // };

  //   const handlePostClick = (i) => {
  //     navigate(`/post/${i}`);
  //   };

  //   const handleToggleLike = (i) => {
  //     localDispatch({ type: "TOGGLE_LIKE", payload: i });
  //   };

  if (loading) {
    return <div>Loading ...</div>; // Show loading message while posts are being fetched
  }
      
  return (
    // <PostNewContext.Provider value={{ localState, localDispatch }}>
      
      <PostContainer>
        {localState.newPosts.length > 0 ? (
          localState.newPosts.map((post) => (
            <div
              key={post.localId}
              className="postItem"
              // onClick={() => handlePostClick(post.localId)}
              style={{
                cursor: "pointer",
                borderBottom: "1px solid #ccc",
                padding: "10px",
              }}
            >
              {" "}
              {/* <Link to={`/post/${post.localId}`} key={post.localId}> */}
              <Link to={`/post/new/${post.localId}`} state={{ post }}>
                <PostTitle>{post.content}</PostTitle>
              </Link>
              <p>
                <button
                  className={`likeButton ${post.liked ? "liked" : ""}`}
                  onClick={() => handleToggleLike(post.localId)}
                >
                  <HeartIcon
                    width="24"
                    height="24"
                    fill={post.liked ? "palevioletred" : " rgb(235, 191, 207)"}
                  />
                </button>
                {/* <LikeButton
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the link from being triggered
                    localDispatch({
                      type: "TOGGLE_LIKE",
                      payload: post.localId,
                    });
                  }}
                >
                  <HeartIcon
                    width="24"
                    height="24"
                    fill={post.liked ? "palevioletred" : "rgb(235, 191, 207)"}
                  />
                </LikeButton> */}
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "18px",
                    color: post.liked ? "palevioletred" : "rgb(235, 191, 207)",
                  }}
                >
                  {post.likes}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </PostContainer>
    // </PostNewContext.Provider>
  );
};

export default PostNewItem;


