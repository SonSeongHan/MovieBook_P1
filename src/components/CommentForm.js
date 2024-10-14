//24.10.10 정율아
import React, { useState, useContext,  useRef } from "react";
import { PostContext } from "../App";

import styled from "styled-components";

const CommentFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  overflowy: auto;
`;

const CommentInput = styled.input`
  padding: 8px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid palevioletred;
  margin-bottom: 10px;
`;

const CommentButton = styled.button`
  background-color: palevioletred;
  color: white;
  font-size: 16px;
  padding: 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #d4588b;
  }
`;

function CommentForm({ postId }) {
  const [comment, setComment] = useState("");
  const { dispatch } = useContext(PostContext);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (comment.trim()) {
  //     dispatch({
  //       type: 'ADD_COMMENT',
  //       payload: { postId, comment: { id: Date.now(), text: comment } },
  //     });
  //     setComment('');
  //   }
  // };
  const nextCommentId = useRef(4); // Start at 4 assuming 3 comments already exist

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: nextCommentId.current, // Use the current ID from useRef
        text: comment,
      };

      // Dispatch the action to add the comment
      dispatch({
        type: "ADD_COMMENT",
        payload: { postId, comment: newComment },
      });

      setComment(""); // Clear the input after adding the comment
      nextCommentId.current++; // Increment for the next comment ID
    }
  };

  return (
    <CommentFormContainer onSubmit={handleSubmit}>
      <CommentInput
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
      />
      <CommentButton type="submit">Add Comment</CommentButton>
    </CommentFormContainer>
  );
}

export default CommentForm;
