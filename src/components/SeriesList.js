// components/SeriesList.js
import React, { useEffect, useReducer, useCallback } from "react";
import { getSeries, deleteSeries } from "../api";
import { seriesReducer } from "../reducers/seriesReducer";
import { Link } from "react-router-dom";

const SeriesList = () => {
  const [state, dispatch] = useReducer(seriesReducer, { series: [] });

  // 시리즈 목록을 가져오는 함수 (useEffect 활용)
  useEffect(() => {
    getSeries().then((data) => {
      dispatch({ type: "LOAD_SERIES", payload: data });
    });
  }, []);

  // 시리즈를 삭제하는 함수 (useCallback으로 메모이제이션)
  const handleDelete = useCallback((id) => {
    deleteSeries(id).then(() => {
      dispatch({ type: "DELETE_SERIES", payload: id });
    });
  }, []);

  return (
    <div>
      <h1>Series List</h1>
      <ul>
        {state.series.map((series) => (
          <li key={series.id}>
            <Link to={`/series/${series.id}`}>{series.title}</Link>
            <button onClick={() => handleDelete(series.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <Link to="/add-series">Add New Series</Link>
    </div>
  );
};

export default SeriesList;
