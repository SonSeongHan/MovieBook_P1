// components/AddSeries.js
import React, { useState, useRef, useEffect, useMemo } from "react";
import { addSeries } from "../api";
import { useNavigate } from "react-router-dom";

const AddSeries = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const titleRef = useRef(null);

  useEffect(() => {
    // 페이지 로드 시 제목 입력란에 자동 포커스
    titleRef.current.focus();
  }, []);

  // 입력 값이 있는지 여부를 useMemo로 최적화
  const isDisabled = useMemo(() => !title || !description, [title, description]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSeries = { id: Date.now(), title, description };
    addSeries(newSeries).then(() => {
      navigate("/");
    });
  };

  return (
    <div>
      <h1>Add Series</h1>
      <form onSubmit={handleSubmit}>
        <input
          ref={titleRef}
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" disabled={isDisabled}>
          Add Series
        </button>
      </form>
    </div>
  );
};

export default AddSeries;
