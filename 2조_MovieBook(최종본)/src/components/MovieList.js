// 이진수
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// 손성한 : 경로 지정을 위해 생성
import { useNavigate } from 'react-router-dom';

function MovieList() {
    // navigate가 받음
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [posters, setPosters] = useState({});
    const [selectedMovie, setSelectedMovie] = useState(null);

    const fetchMovies = async () => {
        /* console.log("Fetching movies..."); // 추가된 로그 */
        const tmdbApiKey = 'd961a3c924d140f63d761b0648d7e1fe';

        try {
            const nowPlayingMoviesUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${tmdbApiKey}&language=ko-KR&page=1`;
            const nowPlayingMoviesResponse = await axios.get(nowPlayingMoviesUrl);
            const nowPlayingMovies = nowPlayingMoviesResponse.data.results;

            const sortedMovies = nowPlayingMovies
                .filter((movie) => movie.release_date)
                .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
                .slice(0, 10);

            setMovies(sortedMovies);

            const fetchedPosters = {};

            for (const movie of sortedMovies) {
                if (movie.poster_path) {
                    fetchedPosters[
                        movie.id
                    ] = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
                }
            }

            setPosters(fetchedPosters);
            setError(null);
        } catch (error) {
            setMovies([]);
            setError('영화 정보를 가져오는 도중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    // 손성한 : movie가 클릭 시 navigate로 인해 movie/해당 movie id가 있는 영화가 새로운 창으로 뜸
    const toggleDetails = (movie) => {
        navigate(`/movie/${movie.id}`);
    }

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
                                    fontSize: '16px',
                                    overflow: 'hidden',
                                    lineHeight: '1.2em',
                                    height: '2.4em', // 두 줄까지 보이도록 설정
                                    whiteSpace: 'normal', // 줄바꿈 허용
                                }}
                            >
                                {movie.title}
                            </h2>
                            <button
                                // 변수 movie를 클릭 시 이동하는 함수를 실행
                                onClick={() => toggleDetails(movie)}
                                style={{
                                    cursor: 'pointer',
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                }}
                            >
                                {posters[movie.id] ? (
                                    <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={`${movie.title} 포스터`} style={{ width: '150px', height: '200px' }} />
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

export default MovieList;
