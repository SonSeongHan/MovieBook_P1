// components/EditSeries.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSeries, updateSeries } from "../api";

const EditSeries = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 해당 ID의 시리즈 데이터를 가져옴
    getSeries().then((data) => {
      const series = data.find((s) => s.id === Number(id));
      if (series) {
        setTitle(series.title);
        setDescription(series.description);
      }
    });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSeries(Number(id), { id: Number(id), title, description }).then(() => {
      navigate("/");
    });
  };

  return (
    <div>
      <h1>Edit Series</h1>
      <form onSubmit={handleSubmit}>
        <input
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
        <button type="submit">Update Series</button>
      </form>
    </div>
  );
};

export default EditSeries;
