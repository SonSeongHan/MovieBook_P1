// 손성한 : 대여 페이지
import React, { useEffect, useState, useContext } from 'react';
import { PostContext } from '../App';
import { useNavigate } from 'react-router-dom';

const RentedMovies = () => {
  const { state, dispatch } = useContext(PostContext);
  const [rentedMovies, setRentedMovies] = useState(state.rentedMovies || []);
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가
  const [filteredMovies, setFilteredMovies] = useState(rentedMovies); // 필터링된 영화 목록 상태
  const navigate = useNavigate();

  useEffect(() => {
    const movies = JSON.parse(localStorage.getItem('rentedMovies')) || [];
    setRentedMovies(movies);
  }, [state.rentedMovies]); // 상태가 변경될 때마다 업데이트

  useEffect(() => {
    // 검색어에 따라 영화 목록 필터링
    setFilteredMovies(rentedMovies.filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm, rentedMovies]); // searchTerm 또는 rentedMovies가 변경될 때마다 실행

  const handleDelete = (index) => {
    const updatedMovies = rentedMovies.filter((_, i) => i !== index);
    setRentedMovies(updatedMovies);
    localStorage.setItem('rentedMovies', JSON.stringify(updatedMovies));
    dispatch({ type: 'REMOVE_RENTED_MOVIE', payload: rentedMovies[index].id });
  };

  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };
  return (
    <div style={{ padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}>
      <h2>대여 중인 영화 목록</h2>
      {/* 검색 입력란 추가 */}
      <input type="text" placeholder="영화 제목 검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '20px', width: '100px', textAlign: 'center' }} />
      {filteredMovies.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {filteredMovies.map((movie, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                overflow: 'hidden',
                width: '150px',
                textAlign: 'center',
                cursor: 'pointer',
              }}
              onClick={() => handleMovieClick(movie.id)}
            >
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} style={{ width: '100%', height: 'auto' }} />
              <h3 style={{ fontSize: '16px', margin: '10px 0' }}>{movie.title}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(index);
                }}
                style={{
                  background: '#d3d3d3', // 회색 배경
                  color: 'black', // 검은색 텍스트
                  border: 'none',
                  borderRadius: '4px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                }}
              >
                환불
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>대여 중인 영화가 없습니다.</p>
      )}
    </div>
  );
};

export default RentedMovies;
