// 손성한
// 추천 영화 클릭 시 뜨는 화면

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MovieList from './MovieList';
import MovieRank from './MovieRank';
import './Recommendation.css';

const Recommendation = ({ addPurchasedMovie, addRentedMovie }) => {
  const handlePurchase = (movie) => {
    addPurchasedMovie(movie); // 구매 함수 호출
  };

  const handleRent = (movie) => {
    addRentedMovie(movie); // 대여 함수 호출
  };

  const [selectedGenre, setSelectedGenre] = useState(''); // 선택된 장르 상태 초기화
  const [movies, setMovies] = useState([]); // 영화 목록 초기화
  const navigate = useNavigate(); // 제목, 포스터 누르면 moviedetail 이동
  const [error, setError] = useState(null); // 에러 출력

  const genres = [
    { id: 28, name: '액션' },
    { id: 12, name: '모험' },
    { id: 16, name: '애니메이션' },
    { id: 35, name: '코미디' },
    { id: 80, name: '범죄' },
    { id: 99, name: '다큐멘터리' },
    { id: 18, name: '드라마' },
    { id: 10751, name: '가족' },
    { id: 14, name: '판타지' },
    { id: 36, name: '역사' },
    { id: 27, name: '공포' },
    { id: 10402, name: '음악' },
    { id: 9648, name: '미스터리' },
    { id: 10749, name: '로맨스' },
    { id: 878, name: 'SF' },
    { id: 10770, name: 'TV 영화' },
    { id: 53, name: '스릴러' },
    { id: 10752, name: '전쟁' },
    { id: 37, name: '서부' },
  ];

  const fetchMoviesByGenre = async (genreId) => {
    const tmdbApiKey = '';
    if (!genreId) return;

    try {
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&language=ko-KR&with_genres=${genreId}`);
      const sortedMovies = response.data.results.slice(0, 10);
      setMovies(sortedMovies);
      const fetchedPosters = {};
      for (const movie of sortedMovies) {
        if (movie.poster_path) {
          fetchedPosters[movie.id] = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
        }
      }
      const moviesWithDetails = sortedMovies.map((movie) => ({
        ...movie,
        poster: fetchedPosters[movie.id],
      }));

      const sortedByRating = moviesWithDetails.sort((a, b) => b.vote_average - a.vote_average);
      setMovies(sortedByRating);
      setError(null);
    } catch (error) {
      console.error('Error fetching movies: ', error);
    }
  };

  useEffect(() => {
    fetchMoviesByGenre(selectedGenre);
  }, [selectedGenre]);

  return (
    <div className="style" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <h2>최신 영화</h2>
      <div className="box-style">
        <MovieList />
      </div>
      <h2>추천 영화</h2>
      <div className="box-style">
        <MovieRank />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
        <h2 style={{ marginRight: '10px', fontSize: '1.5rem' }}>장르 선택</h2>
        <select id="genre-select" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} style={{ width: '120px', marginLeft: '10px' }}>
          <option value="">-- 장르 선택 --</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>
      <div className="box-style">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div key={movie.id} style={{ margin: '10px', textAlign: 'center' }}>
                <h2
                  style={{
                    fontSize: '16px',
                    overflow: 'hidden',
                    lineHeight: '1.2em',
                    height: '2.4em',
                    whiteSpace: 'normal',
                  }}
                >
                  <button
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                    }}
                  >
                    {movie.title}
                  </button>
                </h2>
                <button
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  style={{
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                  }}
                >
                  {movie.poster ? (
                    <img src={movie.poster} alt={`${movie.title} 포스터`} style={{ width: '150px', height: '200px' }} />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '150px',
                        border: '1px solid #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#888',
                        marginBottom: '10px',
                      }}
                    >
                      포스터 없음
                    </div>
                  )}
                </button>
              </div>
            ))
          ) : (
            <p>영화 목록이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendation;
