import React, { createContext, useReducer, useState, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ReactComponent as LogoMoviebook } from './logo_Moviebook-01.svg';
import { ReactComponent as SubLogoMoviebook } from './sub_logo_Moviebook-02.svg';

import axios from 'axios';

import PostList from './components/PostList';
import PostForm from './components/PostForm';
import PostDetail from './components/PostDetail';
import PostNewDetail from './components/PostNewDetail';
import PostNewItem from './components/PostNewItem';

import AddSeries from './components/AddSeries';

import Home from './components/Home';
import MovieDetail from './components/MovieDetail';
import PurchasedMovies from './components/PurchasedMovies';
import RentedMovies from './components/RentedMovies';
import MovieList from './components/MovieList';
// 컴포넌트추가
import Postreview from './components/Postreview';
import styled from 'styled-components';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;

  &:hover .subLogoMoviebook {
    opacity: 1; // Change opacity to 1 to make it visible
    transform: translateY(-10px); // Move it to the right
  }

  &:active .subLogoMoviebook {
    opacity: 1; // Keep the sub-logo visible on active state
  }
`;

const SubLogoStyled = styled(SubLogoMoviebook)`
  width: 165px;
  height: 63px;
  position: absolute;

  left: 63px;
  opacity: 0; // Initially hidden
  transform: translateY(33px); // Start from the initial position
  transition: opacity 2s ease, transform 2s ease; // Apply transition for smooth animation
`;

const initialState = {
  posts: [
    {
      id: 1,
      content: 'This is the second post',
      likes: 5,
      liked: false,
      comments: [],
      image: null,
    },
    {
      id: 2,
      content: 'This is the first post',
      likes: 10,
      liked: false,
      comments: [],
      image: null,
    },
  ],
  activeTab: 'recommendations', // 기본 activeTab 설정
  purchasedMovies: [],
  rentedMovies: JSON.parse(localStorage.getItem('rentedMovies')) || [],
};

export function postReducer(state, action) {
  switch (action.type) {
    case 'CREATE_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id
            ? {
                ...post,
                content: action.payload.content,
                image: action.payload.image,
              }
            : post
        ),
      };
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== action.payload),
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id === action.payload.postId) {
            return {
              ...post,
              comments: post.comments.concat(action.payload.comment), // Add the new comment and return a new array
              // comments: [...post.comments, action.payload.comment], // Add the new comment to the array
            };
          }
          return post;
        }),
      };

    case 'DELETE_COMMENT':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.postId
            ? {
                ...post,
                comments: post.comments.filter((comment) => comment.id !== action.payload.commentId),
              }
            : post
        ),
      };
    case 'EDIT_COMMENT':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.postId
            ? {
                ...post,
                comments: post.comments.map((comment) => (comment.id === action.payload.commentId ? { ...comment, text: action.payload.text } : comment)),
              }
            : post
        ),
      };

    case 'TOGGLE_LIKE':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload
            ? {
                ...post,
                likes: post.liked ? post.likes - 1 : post.likes + 1,
                liked: !post.liked, // Toggle the liked status
              }
            : post
        ),
      };
    case 'SET_ACTIVE_TAB': // activeTab 업데이트를 위한 액션 추가
      return {
        ...state,
        activeTab: action.payload, // activeTab 업데이트
      };
    case 'SET_ACTIVE_TAB': // activeTab 업데이트를 위한 액션 추가
      return {
        ...state,
        activeTab: action.payload, // activeTab 업데이트
      };
    case 'ADD_PURCHASED_MOVIE':
      return {
        ...state,
        purchasedMovies: [...state.purchasedMovies, action.payload], // 구매한 영화 추가
      };
    case 'ADD_RENTED_MOVIE':
      return {
        ...state,
        rentedMovies: [...state.rentedMovies, action.payload], // 대여 중인 영화 추가
      };
    case 'REMOVE_RENTED_MOVIE':
      return {
        ...state,
        rentedMovies: state.rentedMovies.filter((movie) => movie.id !== action.payload),
      };

    default:
      return state;
  }
}

//PostContext로 post와 context의 상태 관리 정율아
//activeTab 상태를 PostContext에 저장하고, Home 컴포넌트상태 관리이진수
export const PostContext = createContext();
export const PostNewContext = React.createContext();
// export const PostNewContext = React.createContext();

// const App = () => {
//   const [state, dispatch] = useReducer(postReducer, initialState);
//   const addPurchasedMovie = (movie) => {
//     dispatch({ type: 'ADD_PURCHASED_MOVIE', payload: movie });
//     const storedMovies = JSON.parse(localStorage.getItem('purchasedMovies')) || [];
//     localStorage.setItem('purchasedMovies', JSON.stringify([...storedMovies, movie]));
//   };

//   const addRentedMovie = (movie) => {
//     const updatedMovies = [...state.rentedMovies, movie];
//     localStorage.setItem('rentedMovies', JSON.stringify(updatedMovies));
//     dispatch({ type: 'ADD_RENTED_MOVIE', payload: movie });
//   };

//   const [data, setData] = useState(null);

//   const onClick = () => {
//     axios.get('https://jsonplaceholder.typicode.com/todos/1').then((response) => {
//       setData(response.data);
//     });
//   };
const App = () => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  const addPurchasedMovie = (movie) => {
    dispatch({ type: 'ADD_PURCHASED_MOVIE', payload: movie });
    const storedMovies = JSON.parse(localStorage.getItem('purchasedMovies')) || [];
    localStorage.setItem('purchasedMovies', JSON.stringify([...storedMovies, movie]));
  };

  const addRentedMovie = (movie) => {
    const updatedMovies = [...state.rentedMovies, movie];
    localStorage.setItem('rentedMovies', JSON.stringify(updatedMovies));
    dispatch({ type: 'ADD_RENTED_MOVIE', payload: movie });
  };

  const [data, setData] = useState(null);
  const onClick = () => {
    axios.get('https://jsonplaceholder.typicode.com/todos/1').then((response) => {
      setData(response.data);
    });
  };

  return (
    <PostContext.Provider value={{ state, dispatch }}>
      <Router>
        <div className="App" style={{ height: '100vh', overflow: 'hidden' }}>
          <header
            style={{
              width: '100%',
              height: '63px',
              position: 'relative',
              top: '0',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8f9fa',
            }}
          >
            {/* Logo */}
            <a
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <LogoContainer>
                <LogoMoviebook
                  style={{
                    width: '60px',
                    height: '63px',
                  }}
                />
                <SubLogoStyled className="subLogoMoviebook" style={{ bottom: '-10px' }} />
              </LogoContainer>
            </a>

            <a
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <span
                className="logIN"
                style={{
                  position: 'absolute',
                  right: '15px',
                  backgroundColor: 'palevioletred',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '1px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                logiN
              </span>
            </a>
          </header>
          <nav
            style={{
              width: '100%',
              height: '30px',
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              padding: '10px',
              backgroundColor: '#f8f9fa',
              position: 'relative',
              msOverflowX: 'hidden',
              msOverflowY: 'auto',
              margin: '0 auto',
            }}
          >
            {/* <Link
              to="/"
              style={{
                textDecoration: 'none',
                color: 'rgb(56, 183, 241)',
                fontSize: '18px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                position: 'absolute',
                bottom: '7px',
                left: '28%',
              }}
            >
              Movie
            </Link> */}
            <Link
              to="/new"
              style={{
                textDecoration: 'none',
                color: 'rgb(228, 67, 120)',
                fontSize: '18px',
                fontWeight: 'bold',
                width: '120px',
                position: 'absolute',
                bottom: '7px',

                right: '100px',
              }}
            >
              New Post
            </Link>
          </nav>

          <Routes>
            <Route
              path="/"
              element={
                <div
                  style={{
                    width: '100%',
                    display: 'flex', // Use flexbox to align items
                    flexDirection: 'row', // Align items horizontally
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: '60%', // Set 60% width for MoviesPage
                      height: 'calc(100vh - 101px)',
                      border: '1px solid #ccc',
                      padding: '10px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <Home addPurchasedMovie={addPurchasedMovie} addRentedMovie={addRentedMovie} />

                    {/* <MoviesPage className="moviesContent">
                      <MoviesList />
                    </MoviesPage> */}

                    {/* <MoviesPage onClick={data && <MoviesList />} /> */}

                    {/* <SeriesList /> */}
                  </div>
                  <div
                    className="postList"
                    style={{
                      width: '40%',
                      height: 'calc(100vh - 101px)', // Adjust the height to 100vh minus the height of the navbar
                      overflowY: 'auto',
                      border: '1px solid #ccc',
                      boxSizing: 'border-box',
                    }}
                  >
                    <PostList />
                    <Postreview />
                    <PostNewItem />
                  </div>
                </div>
              }
            />
            <Route path="/movies" element={<MovieList />} />
            <Route path="movie/:id" element={<MovieDetail addPurchasedMovie={addPurchasedMovie} addRentedMovie={addRentedMovie} />} />
            <Route path="/reviews" element={<Postreview />} />
            <Route path="purchased-movies" element={<PurchasedMovies />} />
            <Route path="rented-movies" element={<RentedMovies />} />
            {/* <Route path="/add-series" element={<AddSeries />} />/// */}

            <Route
              path="/new"
              element={
                <PostForm
                  style={{
                    overflowY: 'auto',
                  }}
                />
              }
            />

            {/* Define distinct routes for PostNewDetail and PostDetail */}
            {/* <Route path="/post/new/:localId" component={PostNewDetail} /> */}
            {/* <Route path="/post/:id" component={PostDetail} /> */}

            <Route
              path="/post/:id"
              element={
                <PostDetail
                  style={{
                    overflowY: 'auto',
                  }}
                />
              }
            />
            <Route path="/post/new/:localId" element={<PostNewDetail />} />

            {/* <Route
              path="/post/:id"
              element={<PostDetail style={{ overflowY: "auto" }} />}
            /> */}
          </Routes>
        </div>
      </Router>
    </PostContext.Provider>
  );
};

export default memo(App);
