// reducers/seriesReducer.js
export const seriesReducer = (state, action) => {
    switch (action.type) {
      case "LOAD_SERIES":
        return { ...state, series: action.payload };
      case "ADD_SERIES":
        return { ...state, series: [...state.series, action.payload] };
      case "UPDATE_SERIES":
        return {
          ...state,
          series: state.series.map((series) =>
            series.id === action.payload.id ? action.payload : series
          ),
        };
      case "DELETE_SERIES":
        return {
          ...state,
          series: state.series.filter((series) => series.id !== action.payload),
        };
      default:
        return state;
    }
  };
  