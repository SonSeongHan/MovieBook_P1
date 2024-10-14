import React from "react";
import { ColorConsumer } from "../contexts/color";

const movies = ["LatestMovies", "MoviesOn", "yellow", "green", "blue", "indigo", "violet"];

const SelectMovies = () => {
  return (
    <div>
      <h2>Movies</h2>
      <ColorConsumer>
        {({ actions }) => (
          <div style={{ display: "flex" }}>
            {colors.map((movies) => (
              <div
                key={movies}
                style={{
                  background: color,
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                }}
                onClick={() => actions.setColor(color)}
                // 오른쪽 마우스 클릭했을때.
                onContextMenu={(e) => {
                  e.preventDefault(); // 메뉴가 뜨는것을 방지.
                  actions.setSubcolor(movies);
                }}
              />
            ))}
          </div>
        )}
      </ColorConsumer>
      <hr />
    </div>
  );
};

export default SelectMovies;
