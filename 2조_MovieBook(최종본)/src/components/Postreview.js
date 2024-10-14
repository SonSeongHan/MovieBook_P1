import React, { useEffect, useState, useContext } from 'react';
import { PostContext } from '../App';
import './PostList.css';
import { useNavigate } from 'react-router-dom'; // useNavigate 가져오기

function Postreview() {
  const { state, dispatch } = useContext(PostContext);
  const [reviews, setReviews] = useState([]); // 리뷰 목록 초기화
  const navigate = useNavigate(); // navigate 함수 초기화

  // 로컬스토리지에서 리뷰 가져오기
  const fetchReviews = () => {
    const allReviews = [];
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('reviews_')) {
        const reviewsForMovie = JSON.parse(localStorage.getItem(key)) || [];
        allReviews.push(...reviewsForMovie);
      }
    });

    // 작성 시간순으로 정렬 (오래된 리뷰가 아래로 가도록)
    const sortedReviews = allReviews.sort((a, b) => new Date(a.time) - new Date(b.time));
    setReviews(sortedReviews);
  };

  useEffect(() => {
    fetchReviews(); // 컴포넌트가 마운트될 때 리뷰를 가져옴
  }, []);

  // 리뷰 상자 클릭 시 해당 리뷰 페이지로 이동하는 함수
  const handleReviewClick = (review) => {
    navigate(`/movie/${review.movieId}`); // 해당 영화의 ID로 페이지 이동
  };

  return (
    <div>
      <div className="reviews-section" style={{ height: '400px', overflowY: 'scroll', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2>실시간 리뷰</h2>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div
              key={index}
              style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9', cursor: 'pointer' }}
              onClick={() => handleReviewClick(review)} // 클릭 이벤트 핸들러 추가
            >
              <p>
                <strong>{review.title}</strong> - {review.text}
              </p>
              <p>작성 시간: {review.time}</p> {/* 리뷰 작성 시간 표시 */}
              <div>
                {Array.from({ length: review.rating }, (_, i) => (
                  <span key={i} style={{ color: 'gold', fontSize: '20px' }}>
                    ★
                  </span>
                ))}
                {Array.from({ length: 5 - review.rating }, (_, i) => (
                  <span key={i} style={{ color: 'gray', fontSize: '20px' }}>
                    ★
                  </span>
                ))}/
              </div>
            </div>
          ))
        ) : (
          <p>작성된 리뷰가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default Postreview;
