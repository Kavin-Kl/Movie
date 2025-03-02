function MovieCard({ movie }) {

    function hello() {
        alert("Hello")
    }
    return <div className="movie-card">
        <div className="movie-card__poster">
            <img src={movie.poster} alt={movie.title} />
            <div className="movie-card__overlay">
                <button onClick={hello}>View Details</button>
            </div>

        </div>
        <div className="movie-card__info">
            <h2>{movie.title}</h2>
            <p>{movie.plot}</p>
        </div>


    </div>
}

export default MovieCard