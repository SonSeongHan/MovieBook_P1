// 이진수
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MovieRank() {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [selectedMovie, setSelectedMovie] = useState(null);

    const fetchMovies = async () => {
        const tmdbApiKey = 'd961a3c924d140f63d761b0648d7e1fe'; // TMDb API 키

        try {
            // 1. TMDb API에서 현재 상영 중인 영화 목록 가져오기
            const nowPlayingMoviesUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${tmdbApiKey}&language=ko-KR&page=1`;
            const nowPlayingMoviesResponse = await axios.get(nowPlayingMoviesUrl);
            const nowPlayingMovies = nowPlayingMoviesResponse.data.results;

            // 개봉일 기준으로 정렬하여 상위 10편만 추출
            const sortedMovies = nowPlayingMovies
                .filter((movie) => movie.release_date)
                .slice(0, 10); // 최신 영화 10편만

            // 2. TMDb API에서 영화 포스터 및 장르 정보 가져오기
            const fetchedPosters = {};

            for (const movie of sortedMovies) {
                if (movie.poster_path) {
                    fetchedPosters[
                        movie.id
                    ] = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
                }
            }

            // 영화 별점으로 정렬
            const moviesWithDetails = sortedMovies.map((movie) => ({
                ...movie,
                poster: fetchedPosters[movie.id],
            }));

            const sortedByRating = moviesWithDetails.sort(
                (a, b) => b.vote_average - a.vote_average
            );

            setMovies(sortedByRating); // 별점으로 정렬된 영화 목록 설정

            setError(null);
        } catch (error) {
            setMovies([]);
            setError('영화 정보를 가져오는 도중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const toggleDetails = (movie) => {
        setSelectedMovie(selectedMovie === movie ? null : movie);
    };

    return (
        <div style={{ padding: '20px' }}>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {movies.length > 0 ? (
                <ul
                    style={{
                        display: 'flex',
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                    }}
                >
                    {movies.map((movie) => (
                        <li
                            key={movie.id}
                            style={{
                                marginRight: '10px',
                                width: '150px',
                                textAlign: 'center',
                            }}
                        >
                            <h2
                                style={{
                                    //                포스터크기인 150x이하의 줄길이
                                    // wordWrap: 'break-word': 긴 단어가 너비를 초과할 경우 강제로 줄바꿈.
                                    // whiteSpace: 'normal': 텍스트가 넘칠 경우 줄바꿈이 허용
                                    fontSize: '16px',
                                    overflow: 'hidden',
                                    lineHeight: '1.2em',
                                    height: '2.4em', // 두 줄까지 보이도록 설정

                                    whiteSpace: 'normal', // 줄바꿈 허용
                                }}
                            >
                                {/* 영화 제목 클릭 시 상세 페이지로 이동 */}
                                <button
                                    onClick={() => navigate(`/movie/${movie.id}`)} // 상세 페이지로 이동
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
                            {/* 포스터 클릭 시에도 상세 페이지로 이동 */}
                            <button
                                onClick={() => navigate(`/movie/${movie.id}`)} // 포스터 클릭 시 상세 페이지로 이동
                                style={{
                                    cursor: 'pointer',
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                }}
                            >
                                {movie.poster ? (
                                    <img
                                        src={movie.poster}
                                        alt={`${movie.title} 포스터`}
                                        style={{ width: '150px', height: '200px' }}
                                    />
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
                        </li>
                    ))}
                </ul>
            ) : (
                <p>영화 정보를 불러오는 중입니다...</p>
            )}
        </div>
    );
}

export default MovieRank;