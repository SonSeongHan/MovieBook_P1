//24.10.10 정율아
import React, { useContext, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as HeartSVG } from "./heart.svg"; // Make sure you have the heart.svg in your project

import CommentForm from "./CommentForm";
import { PostContext } from "../App";
import { useNavigate } from "react-router-dom";

// Styled components
const PostContainer = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  height: calc(100vh - 100px); /* Adjust height as needed */
  overflow-y: auto; /* Enable internal scrolling */
  box-sizing: border-box;
`;

const PostTitle = styled.h1`
  color: palevioletred;
`;

const PostImage = styled.img`
  width: 200px;
  height: auto;
  border-radius: 5px;
`;



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
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: palevioletred;
  color: white;
  border: none;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
`;

const PasswordInput = styled.input`
  padding: 10px;
  border: 1px solid palevioletred;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 100%;
`;

const ConfirmButton = styled.button`
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

const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
`;
const DeleteButton = styled.button`
  background-color: palevioletred;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: inline-block;
  margin-top: 10px;

  &:hover {
    background-color: #d45072;
  }
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
const StyledLink = styled(Link)`
  display: block; /* 또는 block */
  margin-top: 15px;
  color: #c5749d;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
// Heart SVG components

// ... Other styled components ...

const StyledHeartIcon = styled(HeartSVG)`
  width: 24px;
  height: 24px;
  cursor: pointer;
  fill: ${(props) => (props.liked ? "palevioletred" : "rgb(235, 191, 207)")};

  &:hover {
    fill: ${(props) => (props.liked ? "#d45072" : "rgb(255, 210, 220)")};
  }
`;



function PostDetail() {
  const { id } = useParams();
  const { state, dispatch } = useContext(PostContext);
  const [editingContent, setEditingContent] = useState("");
  const post = state.posts.find((post) => post.id === parseInt(id));

  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const totalComments = useMemo(() => (post ? post.comments.length : 0), [post]);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");

  if (!post) {
    return <div>Loading Post...</div>;
  }

  const handleDeletePost = (postId) => {
    if (password === "0000") {
      dispatch({ type: "DELETE_POST", payload: postId });
      setShowModal(false);
      navigate("/"); // Redirect to home page after deletion
    } else {
      setError(true);
    }
  };

  const handleEditPost = () => {
    dispatch({
      type: "UPDATE_POST",
      payload: { id: post.id, content: editingContent, image: post.image },
    });
    setEditingContent("");
  };

  const handleLike = () => {
    dispatch({ type: "TOGGLE_LIKE", payload: post.id });
  };

  const handleEditComment = (commentId, postId) => {
    dispatch({
      type: "EDIT_COMMENT",
      payload: { postId, commentId, text: newCommentText },
    });
    setEditingCommentId(null); // Exit edit mode
  };

  return (
    <PostContainer>
      <PostTitle>{post.content}</PostTitle>

      {post.image && <PostImage src={post.image} alt="Post" />}
      <p style={{ color: "#c5749d" }}>Likes: {post.likes}</p>
      <StyledHeartIcon liked={post.liked} onClick={handleLike} />
      
      
      <button
        onClick={handleDeletePost}
        style={{ border: "none", backgroundColor: "#f8f9fa" }}
      >
        {showModal && (
          <ModalOverlay>
            <ModalContent>
              <CloseButton onClick={() => setShowModal(false)}>x</CloseButton>
              <h3>Enter Password to Delete</h3>
              <PasswordInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
              <ConfirmButton onClick={() => handleDeletePost(post.id)}>
                Confirm
              </ConfirmButton>
              {error && <ErrorMessage>Password error</ErrorMessage>}
            </ModalContent>
          </ModalOverlay>
        )}
      </button>

      <h3 style={{ color: "#c5749d" }}>Edit Text</h3>
      <EditInput
        type="text"
        value={editingContent}
        onChange={(e) => setEditingContent(e.target.value)}
        placeholder="Edit post content"
      />
      <SaveButton onClick={handleEditPost}>Save</SaveButton>

      <h3 style={{ color: "#c5749d" }}>Comments ({totalComments})</h3>
      <CommentList>
        {post.comments.map((comment) => (
          <CommentItem key={comment.id}>
            {editingCommentId === comment.id ? (
              <div>
                <EditInput
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                />
                <SaveButton
                  onClick={() => handleEditComment(comment.id, post.id)}
                >
                  Save
                </SaveButton>
              </div>
            ) : (
              <p>{comment.text}</p>
            )}
            <EditCommentButton onClick={() => setEditingCommentId(comment.id)}>
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
        ))}
      </CommentList>

      <CommentForm postId={post.id} />

      <DeleteButton onClick={() => setShowModal(true)}>Delete Post</DeleteButton>
      <StyledLink to="/">Back to Posts</StyledLink>
    </PostContainer>
  );
}

export default PostDetail;
