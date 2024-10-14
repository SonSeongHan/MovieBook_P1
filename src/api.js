// api.js
let seriesData = [
    { id: 1, title: "Series 1", description: "This is the first series." },
    { id: 2, title: "Series 2", description: "This is the second series." },
  ];
  
  // 시리즈 목록을 가져오는 함수 (Read)
  export const getSeries = () => Promise.resolve(seriesData);
  
  // 시리즈를 추가하는 함수 (Create)
  export const addSeries = (series) => {
    seriesData.push(series);
    return Promise.resolve(series);
  };
  
  // 시리즈를 업데이트하는 함수 (Update)
  export const updateSeries = (id, updatedSeries) => {
    seriesData = seriesData.map((series) =>
      series.id === id ? updatedSeries : series
    );
    return Promise.resolve(updatedSeries);
  };
  
  // 시리즈를 삭제하는 함수 (Delete)
  export const deleteSeries = (id) => {
    seriesData = seriesData.filter((series) => series.id !== id);
    return Promise.resolve(id);
  };
  