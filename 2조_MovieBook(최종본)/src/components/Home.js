// 손성한
import React, { useState, useContext, useEffect } from 'react';
import Recommendation from './Recommendations';
// 24.10.08
import RentedMovies from './RentedMovies';
import PurchasedMovies from './PurchasedMovies';
import { PostContext } from '../App';
import MovieDetail from './MovieDetail';
// 이진수 10.8 api끌고와서 검색 기능 추가 네비게이트 추가
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import searchIcon from './look-up-svgrepo-com.svg';
// 검색기능을위한 api추가 10/9이진수
const API_KEY = '';
//svg아이콘 추가 이진수 1010

const Home = () => {
  // 24.10.08
  const [purchasedMovies, setPurchasedMovies] = useState([]);
  const [rentedMovies, setRentedMovies] = useState([]);
  const { state, dispatch } = useContext(PostContext); // PostContext에서 상태와 dispatch를 가져오기
  const { activeTab } = state; // 기본값을 background로 설정
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가

  //이진수 10.8 네비게이트 서치기능 검색 설정
  const navigate = useNavigate();
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  //검색 관련 핸들러 추가 api사용을 위한 url 추가 10/8이진수
  const fetchMovies = async (query) => {
    if (!query) {
      return;
    }
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(query)}`);
      setSearchResults(response.data.results.slice(0, 10));
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };
  //    검색기능/엔터눌러도 이벤트/
  const handleSearch = () => {
    setHasSearched(true);
    fetchMovies(searchTerm);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 'recommendations' });
  }, [dispatch]);

  //   const handleInputChange = (event) => {
  //     setSearchTerm(event.target.value);
  //   };

  // 구매한 영화, 대여한 영화 목록 localStorage에서 불러오기
  useEffect(() => {
    const loadMovies = () => {
      const storedPurchasedMovies = JSON.parse(localStorage.getItem('purchasedMovies')) || [];
      const storedRentedMovies = JSON.parse(localStorage.getItem('rentedMovies')) || [];
      setPurchasedMovies(storedPurchasedMovies);
      setRentedMovies(storedRentedMovies);
    };
    loadMovies();
  }, []);

  // 영화 구매
  const addPurchasedMovie = (movie) => {
    // App.js에 있는 액션 타입
    dispatch({ type: 'ADD_PURCHASED_MOVIE', payload: movie });
    // 로컬 스토리지에도 추가하는 부분이 필요
    const storedMovies = JSON.parse(localStorage.getItem('purchasedMovies')) || [];
    // 원래 저장되어있는 storedMovies에 구매한 movie값을 넣어서 다시 localStorage에 넣어놈
    localStorage.setItem('purchasedMovies', JSON.stringify([...storedMovies, movie]));
  };

  // 영화 대여
  const addRentedMovie = (movie) => {
    // 원래 저장되어있는 rentedMovies에 대여한 movie값을 업데이트해서 새로운 updatedMovies를 만듦
    const updatedMovies = [...rentedMovies, movie];
    // 생성한 새로운 배열을 사용한 상태 업데이트
    setRentedMovies(updatedMovies);
    // 새로운 대여 목록을 localStorage에 저장 -> 새로고침 후에도 데이터 유지를 위해
    localStorage.setItem('rentedMovies', JSON.stringify(updatedMovies)); // 로컬 저장소 업데이트
    dispatch({ type: 'ADD_RENTED_MOVIE', payload: movie });
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', padding: '10px', boxSizing: 'border-box' }}>
      {/* 버튼 컨테이너 */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
        <button
          onClick={() => {
            dispatch({ type: 'SET_ACTIVE_TAB', payload: 'recommendations' });
          }}
          style={{
            flex: 'none',
            padding: '10px',
            backgroundColor: activeTab === 'recommendations' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'recommendations' ? '#fff' : '#000',
            borderRadius: '10px', //이진수 10/11버튼이 전체적으로 둥글해보이게 추가
            border: '1px solid #ccc',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          추천 영화
        </button>
        <button
          onClick={() => {
            dispatch({ type: 'SET_ACTIVE_TAB', payload: 'rented' });
          }}
          style={{
            flex: 'none',
            padding: '10px',
            backgroundColor: activeTab === 'rented' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'rented' ? '#fff' : '#000',
            borderRadius: '10px', //이진수 10/11버튼이 전체적으로 둥글해보이게 추가
            border: '1px solid #ccc',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          대여중인 영화
        </button>
        <button
          onClick={() => {
            // dispatch 호출 이진수
            dispatch({ type: 'SET_ACTIVE_TAB', payload: 'purchased' });
          }}
          style={{
            flex: 'none',
            padding: '10px',
            backgroundColor: activeTab === 'purchased' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'purchased' ? '#fff' : '#000',
            borderRadius: '10px', //이진수 10/11버튼이 전체적으로 둥글해보이게 추가
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
        >
          구매한 영화
        </button>
      </div>

      {/* 검색 입력란이 메인 화면과 추천 영화 탭에서만 보이도록 설정  10/9이진수*/}
      {(activeTab === 'background' || activeTab === 'recommendations') && (
        //   {/* 검색창을 우측 상단에 위치 */}
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <input
              type="text"
              placeholder="검색" // 검색 입력 필드
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)} // 이벤트 객체를 'event'로 명시적으로 사용
              onKeyPress={handleKeyPress}
              style={{
                // 오른쪽 패딩을 추가하여 아이콘 공간 확보 1010 이진수
                padding: '10px 40px 10px 10px', // 왼쪽 패딩을 추가하여 아이콘 공간 확보
                borderRadius: '10px',
                border: '1px solid #ccc',
                width: '150px', // 너비를 설정
                marginRight: '10px', // 버튼과의 간격
              }}
            />
            {/* 검색버튼추가 10/9이진수 */}
            <button
              onClick={handleSearch}
              style={{
                padding: '10px',
                backgroundColor: 'transparent', // 배경을 투명하게 설정
                border: 'none', // 기본 버튼 스타일 제거
                cursor: 'pointer',
              }}
            >
              {/* 검색 택스트 대신 svg아이콘 추가 이진수 1010 */}
              <img
                src={searchIcon} // SVG 이미지 경로
                alt="검색 아이콘"
                style={{
                  position: 'absolute',
                  right: '40px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px', // 아이콘 크기 조정
                  height: '20px',
                }}
              />
            </button>
          </div>
        </div>
      )}
      {/* 검색결과창 추가10/9이진수 */}
      {/* 검색 결과가 있고, activeTab이 background나 recommendations일 때만 검색 결과 출력 */}
      {hasSearched && (activeTab === 'background' || activeTab === 'recommendations') && (
        <div style={{ padding: '20px', position: 'relative', zIndex: 1, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
          <h2>검색 결과:</h2>
          {searchResults.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {searchResults.map((movie) => (
                <div key={movie.id} style={{ margin: '10px', textAlign: 'center' }}>
                  <h3
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
                  </h3>
                  <button
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    style={{
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                    }}
                  >
                    {movie.poster_path ? (
                      <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={`${movie.title} 포스터`} style={{ width: '150px', height: '200px' }} />
                    ) : (
                      <div
                        style={{
                          width: '150px',
                          height: '200px',
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
              ))}
            </div>
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </div>
      )}
      {/* Active Tab Content */}
      {/* !hasSearched &&검색하지않앗을때만 액티브탭출력 */}
      {!hasSearched && activeTab === 'recommendations' && <Recommendation addPurchasedMovie={addPurchasedMovie} addRentedMovie={addRentedMovie} />}
      {activeTab === 'rented' && <RentedMovies movies={rentedMovies} />}
      {activeTab === 'purchased' && <PurchasedMovies movies={purchasedMovies} />}
      {activeTab === 'movieDetail' && <MovieDetail addPurchasedMovie={addPurchasedMovie} addRentedMovie={addRentedMovie} />}
    </div>
  );
};

export default Home;
