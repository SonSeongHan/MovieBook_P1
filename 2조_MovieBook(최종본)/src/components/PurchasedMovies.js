// 손성한 : 구매페이지
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// React의 Context API를 사용하여 애플리케이션에서 전역 상태를 관리
import { PostContext } from '../App';

const PurchasedMovies = () => {
  //이진수 10.8 내용 추가 구매영화추가내용은 대여영화에도 똑같이적용<<이진수
  const { state } = useContext(PostContext);
  const [purchasedMovies, setPurchasedMovies] = useState(state.PurchasedMovies || []);
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가
  const [filteredMovies, setFilteredMovies] = useState([]); // 필터링된 영화 목록 상태 (빈 배열로 초기화)
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const movies = JSON.parse(localStorage.getItem('purchasedMovies')) || [];
    const uniqueMovies = Array.from(new Map(movies.map((movie) => [movie.id, movie])).values());
    setPurchasedMovies(uniqueMovies);
  }, []);
  useEffect(() => {
    // 검색어에 따라 영화 목록 필터링 이진수 10/9
    setFilteredMovies(purchasedMovies.filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm, purchasedMovies]); // searchTerm 또는 purchasedMovies가 변경될 때마다 실행

  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };

  const handleDelete = (id) => {
    const updatedMovies = purchasedMovies.filter((movie) => movie.id !== id);
    setPurchasedMovies(updatedMovies);
    localStorage.setItem('purchasedMovies', JSON.stringify(updatedMovies));
  };

  return (
    <div style={{ padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}>
      <h2>구매한 영화 목록</h2>
      {/* 검색어 입력란 추가 10/9이진수   */}
      <input type="text" placeholder="영화 제목 검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '20px', width: '100px', textAlign: 'center' }} />
      {/* purchasedMovies대신 검색필터를위해filteredMovies사용 */}
      {filteredMovies.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                overflow: 'hidden',
                width: '150px',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} style={{ width: '100%', height: 'auto' }} onClick={() => handleMovieClick(movie.id)} />
              <h3 style={{ fontSize: '16px', margin: '10px 0' }}>{movie.title}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 클릭 이벤트 전파 방지
                  handleDelete(movie.id);
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
        <p>구매한 영화가 없습니다.</p>
      )}
    </div>
  );
};

export default PurchasedMovies;
