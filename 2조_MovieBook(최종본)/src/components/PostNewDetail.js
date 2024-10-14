//24.10.10 정율아
import React, { useContext, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
// import { PostNewContext } from "../components/PostNewItem";
import styled from "styled-components";
import { ReactComponent as HeartSVG } from "./heart.svg"; // Make sure you have the heart.svg in your project
import { PostContext } from "../App";

// Styled components...
const PostContainer = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  height: calc(100vh - 100px); /* Adjust height as needed */
  overflow-y: auto; /* Enable internal scrolling */
  box-sizing: border-box;

  p {
    color: palevioletred;
  }
`;

const PostTitle = styled.h1`
  color: palevioletred;
  font-size: 16px;
  font-weight: light;
`;

// ... Other styled components ...

const EditInput = styled.input`
  padding: 10px;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid palevioletred;
`;

const SaveButton = styled.button`
  background-color: palevioletred;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #d45072;
  }
`;

const CommentList = styled.div`
  margin-top: 20px;
`;

const CommentItem = styled.div`
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
`;

const EditCommentButton = styled.button`
  background-color: palevioletred;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #d45072;
  }
`;

const DeleteCommentButton = styled.button`
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #ff4c4c;
  }
`;

const StyledHeartIcon = styled(HeartSVG)`
  width: 24px;
  height: 24px;
  cursor: pointer;
  fill: ${(props) => (props.liked ? "palevioletred" : "rgb(235, 191, 207)")};

  &:hover {
    fill: ${(props) => (props.liked ? "#d45072" : "rgb(255, 210, 220)")};
  }
`;

const StyledLink = styled(Link)`
  display: block;
  margin-top: 15px;
  color: #c5749d;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;



const PostNewDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const context = React.useContext(PostContext);
  // For editing post content
  const [newCommentText, setNewCommentText] = useState(""); // For editing comment text
  const [editingCommentId, setEditingCommentId] = useState(null); // To track which comment is being edited

  // Handle undefined context
  if (!context) {
    return <div>Error: PostNewContext is not available.</div>;
  }

  const { state, dispatch } = context;
  // const { state, dispatch } = useContext(PostContext);

  // Find the post by localId
  // const context = localState.newPosts.find(
  //   (post) => post.localId === Number(localId)
  // );
  const post = location.state?.post; // Access the post data from state
  // const localPost = location.state?.post;
  // If the post is not found, handle it gracefully
  if (!post) {
    return <div>Loading...</div>;
  }

  const handleLike = () => {
    console.log("Toggling like for post:", post.id);
    dispatch({ type: "TOGGLE_LIKE", payload: post.id });
  };

  const handleEditComment = (commentId) => {
    dispatch({
      type: "EDIT_COMMENT",
      payload: { postId: post.id, commentId, text: newCommentText },
    });
    setEditingCommentId(null); // Exit edit mode
  };

  const handleAddComment = () => {
    if (newCommentText.trim() === "") return; // Prevent adding empty comments
    const newComment = { id: Date.now(), text: newCommentText };

    dispatch({
      type: "ADD_COMMENT",
      payload: { postId: post.id, comment: newComment },
    });

    setNewCommentText(""); // Clear the input field
  };
  return (
    <PostContainer>
      <PostTitle>{post.content}</PostTitle>

      <p style={{ color: "#c5749d" }}>Likes: {post.likes}</p>
      <StyledHeartIcon liked={post.liked} onClick={handleLike} />

      <CommentList>
        {post.comments && post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <CommentItem key={comment.id}>
              {editingCommentId === comment.id ? (
                <div>
                  <EditInput
                    type="text"
                    placeholder="Add a comment..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                  />
                  <SaveButton onClick={handleAddComment}>
                    Add Comment
                  </SaveButton>
                </div>
              ) : (
                <p>{comment.text}</p>
              )}
              <EditCommentButton
                onClick={() => setEditingCommentId(comment.id)}
              >
                Edit Comment
              </EditCommentButton>
              <DeleteCommentButton
                onClick={() =>
                  dispatch({
                    type: "DELETE_COMMENT",
                    payload: { postId: post.id, commentId: comment.id },
                  })
                }
              >
                Delete Comment
              </DeleteCommentButton>
            </CommentItem>
          ))
        ) : (
          <p>No comments available</p>
        )}
      </CommentList>

      <StyledLink to="/">Back to Posts</StyledLink>
    </PostContainer>
  );
};

export default PostNewDetail;

