// 손성한 : 영화 세부정보 페이지
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { PostContext } from '../App';
import styled from 'styled-components';

// Styled components 뒤로가기기능 이진수

const StyledLink = styled(Link)`
  width: auto;
  height: 23.6px;
  font-size: 13.33px;
  color: black;
`;

const MovieDetail = ({ addPurchasedMovie, addRentedMovie }) => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const tmdbApiKey = 'd961a3c924d140f63d761b0648d7e1fe';

  const [isRented, setIsRented] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  // 영화 예고편 키 상태
  const [videoKey, setVideoKey] = useState(null);

  const { dispatch } = useContext(PostContext);

  // 리뷰 수정
  const [editIndex, setEditIndex] = useState(null);
  const [editReview, setEditReview] = useState('');
  const [editRating, setEditRating] = useState(0);
  const { movieId } = useParams();

  // movieId를 사용하여 영화 정보를 가져오는 로직 구현

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApiKey}&language=ko-KR`);
        console.log(response.data);
        setMovie(response.data);
        setError(null);

        // 예고편 정보 가져오기
        const videoResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${tmdbApiKey}&language=ko-KR`);
        const trailers = videoResponse.data.results;
        // 우선순위 타입 설정
        const preferredTypes = ['Trailer', 'Teaser'];

        // 우선순위에 따라 비디오 찾기
        let selectedVideo = trailers.find((v) => preferredTypes.includes(v.type)) || trailers[0];

        if (selectedVideo) {
          setVideoKey(selectedVideo.key);
        } else {
          console.log('비디오가 없습니다.');
        }
      } catch (error) {
        setMovie(null);
        setError('영화 정보를 가져오는 도중 오류가 발생했습니다.');
      }
    };

    fetchMovieDetails();

    const storedReviews = JSON.parse(localStorage.getItem(`reviews_${id}`)) || [];
    setReviews(storedReviews);

    // 구매 및 대여 상태 유지
    const rentedMovies = JSON.parse(localStorage.getItem('rentedMovies')) || [];
    const purchasedMovies = JSON.parse(localStorage.getItem('purchasedMovies')) || [];

    setIsRented(rentedMovies.some((m) => m.id === Number(id)));
    setIsPurchased(purchasedMovies.some((m) => m.id === Number(id)));
  }, [id]);

  // 리뷰 추가
  const handleAddReview = (e) => {
    e.preventDefault();
    // 글자 수 제한 추가
    if (newReview.trim().length === 0) {
      alert('한 글자 이상 작성해야 합니다.');
      return;
    }
    // 작성시간,무비아이디따올수잇도록 추가 이진수 10/11
    const currentTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }); // 현재 시간을 ISO 형식으로 저장
    const updatedReviews = [{ text: newReview, rating, title: movie.title, poster: movie.poster_path, time: currentTime, movieId: movie.id }, ...reviews];
    const sortedReviews = updatedReviews.sort((a, b) => new Date(a.time) - new Date(b.time));
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
    setNewReview('');
    setRating(0);
  };

  // 리뷰 수정
  const handleEditReview = (index) => {
    setEditIndex(index);
    setEditReview(reviews[index].text);
    setEditRating(reviews[index].rating);
  };

  const handleSaveEdit = () => {
    const updatedReviews = reviews.map((review, index) => {
      if (index === editIndex) {
        return { text: editReview, rating: editRating };
      }
      return review; // 나버지 리뷰는 그대로
    });
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
    setEditIndex(null);
    setEditReview('');
    setEditRating(0);
  };

  // 리뷰 삭제
  const handleDeleteReview = (index) => {
    const updatedReviews = reviews.filter((_, i) => i !== index);
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
  };
  //뒤로가기 명령어 Styled로 대체  10/9 이진수
  // const handleBackClick = () => {
  //     dispatch({ type: 'SET_ACTIVE_TAB', payload: 'recommendations' });
  //     navigate('/');
  // };

  const handlePurchase = () => {
    const storedMovies = JSON.parse(localStorage.getItem('purchasedMovies')) || [];
    const storedRentedMovies = JSON.parse(localStorage.getItem('rentedMovies')) || [];

    // 중복 체크
    if (!storedMovies.some((m) => m.id === movie.id)) {
      // 대여 목록에서 삭제
      const updatedRentedMovies = storedRentedMovies.filter((m) => m.id !== movie.id);
      localStorage.setItem('rentedMovies', JSON.stringify(updatedRentedMovies));

      // 구매 목록에 추가
      storedMovies.push({ id: movie.id, title: movie.title });
      localStorage.setItem('purchasedMovies', JSON.stringify(storedMovies));

      addPurchasedMovie(movie);
      // Home 컴포넌트에서 대여 목록 업데이트
      dispatch({ type: 'REMOVE_RENTED_MOVIE', payload: movie.id });

      alert(`${movie.title} 영화가 구매 목록에 추가되었습니다.`);

      // 구매 후 버튼 숨기기
      setIsPurchased(true);
    } else {
      alert(`${movie.title} 영화는 이미 구매 목록에 있습니다.`);
    }
  };

  const handleRent = () => {
    const storedMovies = JSON.parse(localStorage.getItem('rentedMovies')) || [];

    if (!storedMovies.some((m) => m.id === movie.id)) {
      storedMovies.push({ id: movie.id, title: movie.title });
      localStorage.setItem('rentedMovies', JSON.stringify(storedMovies));
      addRentedMovie(movie);
      setIsRented(true);
      alert(`${movie.title} 영화가 대여 목록에 추가되었습니다.`);
    } else {
      alert(`${movie.title} 영화는 이미 대여 목록에 있습니다.`);
    }
  };
  if (error) {
    return <p>{error}</p>; // 에러가 있을 경우 에러 메시지를 표시
  }

  if (!movie) {
    return <p>영화 정보를 불러오는 중...</p>;
  }

  // 엔터키 기능
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddReview(e);
    }
  };

  return (
    <div style={{ padding: '20px', height: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', marginBottom: '20px', flex: 1 }}>
        {/* 영화 포스터 및 정보 표시 부분 */}
        <div style={{ position: 'relative', flex: 1, marginRight: '20px', display: 'flex', alignItems: 'flex-start', maxHeight: 'calc(100% - 30px)', padding: '10px' }}>
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`${movie.title} 포스터`} style={{ width: '300px', height: '450px', marginRight: '10px' }} />
          {isRented && (
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                backgroundColor: 'yellow',
                padding: '5px',
                borderRadius: '5px',
              }}
            >
              대여 중
            </div>
          )}
          {isPurchased && (
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                backgroundColor: 'lightgreen',
                padding: '5px',
                borderRadius: '5px',
              }}
            >
              구매 완료
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {' '}
            {/* 제목, 개요, 개봉일, 평점 부분 */}
            <h2 style={{ margin: '0 0 30px 0' }}>{movie.title}</h2> {/* 제목 아래 여유 추가 */}
            <p style={{ maxHeight: '150px', overflowY: 'auto', margin: '0 0 50px 0' }}>
              {' '}
              {/* 개요 아래 여유 추가 */}
              <strong>개요: </strong> {movie.overview}
            </p>
            <p style={{ margin: '0 0 50px 0' }}>
              {' '}
              {/* 개봉일 아래 여유 추가 */}
              <strong>개봉일: </strong> {movie.release_date}
            </p>
            <p style={{ margin: '0 0 75px 0' }}>
              {' '}
              {/* 평점 아래 여유 추가 */}
              <strong>평점: </strong> {movie.vote_average}
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              {' '}
              {/* 버튼 위쪽 여유 추가 */}
              {!isRented && !isPurchased && (
                <button style={{ cursor: 'pointer', backgroundColor: 'yellow', borderRadius: '5px', border: 'none' }} onClick={handleRent}>
                  대여하기
                </button>
              )}
              {!isPurchased && (
                <button style={{ cursor: 'pointer', backgroundColor: 'lightgreen', borderRadius: '5px', border: 'none' }} onClick={handlePurchase}>
                  구매하기
                </button>
              )}
              <button style={{ backgroundColor: '#007bff', borderRadius: '5px', border: 'none' }}>
                <StyledLink to="/">뒤로 가기</StyledLink>
              </button>
            </div>
          </div>
        </div>

        {/* 영상 표시 부분 */}
        <div style={{ flex: 1, maxHeight: 'calc(100% - 30px)', padding: '10px' }}>
          {videoKey && (
            <iframe
              width="100%"
              height="500" // 높이를 더 크게 설정
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&loop=1&playlist=${videoKey}`} // 자동 재생 및 반복 재생 추가
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>

      {/* 리뷰 작성 섹션 */}
      <div style={{ marginTop: '0px', overflow: 'visible' }}>
        <h3>리뷰 작성</h3>
        <textarea value={newReview} onChange={(e) => setNewReview(e.target.value)} onKeyDown={handleKeyDown} rows="4" style={{ width: '100%', marginBottom: '10px' }} />
        <div style={{ marginBottom: '10px' }}>
          <strong>별점 : </strong>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                cursor: 'pointer',
                color: star <= rating ? 'gold' : 'gray',
                fontSize: '20px',
              }}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        <button onClick={handleAddReview}>리뷰 추가</button>

        {/* 리뷰 목록 */}
        <h3>리뷰 목록</h3>
        <ul style={{ listStyleType: 'none', padding: 0, maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '5px', padding: '10px' }}>
          {reviews.length === 0 ? (
            <li style={{ textAlign: 'left', padding: '10px' }}>리뷰가 없습니다.</li>
          ) : (
            reviews.map((review, index) => (
              <li
                key={index}
                style={{
                  display: 'flex',
                  padding: '10px',
                  marginBottom: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <span style={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {editIndex === index ? (
                    <>
                      <textarea value={editReview} onChange={(e) => setEditReview(e.target.value)} rows="2" style={{ width: '100%', marginBottom: '5px' }} />
                      <div>
                        <strong>별점 : </strong>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            style={{
                              cursor: 'pointer',
                              color: star <= editRating ? 'gold' : 'gray',
                              fontSize: '20px',
                            }}
                            onClick={() => setEditRating(star)}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <button onClick={handleSaveEdit}>저장</button>
                      <button onClick={() => setEditIndex(null)}>취소</button>
                    </>
                  ) : (
                    <>
                      <span style={{ flexGrow: 1 }}>
                        {/* 현재 시간 표시  이진수 10/11*/}
                        {review.text} -<div style={{ fontSize: '12px', color: 'gray' }}>작성 시간: {review.time}</div>
                        <strong>
                          {Array.from({ length: review.rating }, (_, i) => (
                            <span key={i} style={{ color: 'gold', fontSize: '20px' }}>
                              ★
                            </span>
                          ))}
                          {Array.from({ length: 5 - review.rating }, (_, i) => (
                            <span key={i} style={{ color: 'gray', fontSize: '20px' }}>
                              ★
                            </span>
                          ))}
                        </strong>
                      </span>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleEditReview(index)}>수정</button>
                        <button onClick={() => handleDeleteReview(index)}>삭제</button>
                      </div>
                    </>
                  )}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default MovieDetail;
