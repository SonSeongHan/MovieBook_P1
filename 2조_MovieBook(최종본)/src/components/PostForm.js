//24.10.10 정율아
import React, {memo, useState, useContext, useRef, useEffect } from "react";
import { PostContext } from "../App";
import styled from "styled-components";
import { Navigate, useNavigate } from "react-router-dom";

const PostFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  overflowy: auto;
`;

const PostInput = styled.input`
  padding: 8px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid palevioletred;
  margin-bottom: 10px;
`;

const PostButton = styled.button`
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
// Styled for the file input label
const FileInputLabel = styled.label`
  width: 300px;
  background-color: palevioletred;
  color: white;
  padding: 8px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  text-align: center;
  margin-bottom: 10px;
  display: block;

  &:hover {
    background-color: #d4588b;
  }
`;

// Hide the actual input[type="file"]
const HiddenFileInput = styled.input`
  display: none;
`;
function PostForm() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const { dispatch } = useContext(PostContext);
  const Navigate = useNavigate(); // Initialize the useNavigate hook

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim() || image) {
      dispatch({
        type: "CREATE_POST",
        payload: {
          id: Date.now(),
          content,
          likes: 0,
          comments: [],
          image,
        },
      });

      Navigate("/"); // Redirect to home page after deletion

      setContent("");
      setImage(null);
    }
  };

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <PostFormContainer onSubmit={handleSubmit}>
      <PostInput
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a new text on this post..."
      />

      {image && (
        <img
          src={image}
          alt="Preview"
          style={{ width: "100px", height: "auto", marginBottom: "10px" }}
        />
      )}
      <FileInputLabel htmlFor="fileInput">Choose Image</FileInputLabel>
      <HiddenFileInput
        type="file"
        id="fileInput"
        accept="image/*"
        onChange={handleImageChange}
      />
      <PostButton type="submit">Submit</PostButton>
    </PostFormContainer>
  );
}

export default React.memo((PostForm));
