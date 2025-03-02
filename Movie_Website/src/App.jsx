import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MovieCard from './components/MovieCard'



function App() {

  return (
    <>
      <MovieCard movie={{
        title: "The Shawshank Redemption",
        plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        poster: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg"
      }} />
      <MovieCard movie={{
        title: "The Godfather",
        plot: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        poster: "https://m.media-amazon.com/images/I/51v5ZpFyaFL._AC_.jpg"
      }} />
      <MovieCard movie={{
        title: "The Dark Knight",
        plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept",
        poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg"
      }} />
    </>
  );
}

export default App
