const apiKey = '339ad4b94f1b718f9e60be568ac446c7'; // Reemplaza con tu clave API
const apiUrl = 'https://api.themoviedb.org/3/movie/popular?api_key=339ad4b94f1b718f9e60be568ac446c7&language=en-US&page=1';
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('movie-details');
const detailsContainer = document.getElementById('details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');
let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];



// Fetch and display popular movies
async function fetchPopularMovies() {
    try {
        const response = await fetch(apiUrl);
        const { results } = await response.json();

       displayMovies(results);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

// Display movies
function displayMovies(movies) {
    movieList.innerHTML = ''; // Limpia la lista de películas
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
        `;
        li.onclick = () => showMovieDetails(movie.id); // Muestra detalles al hacer clic en la película
        movieList.appendChild(li);
    });
}

// Show movie details
async function showMovieDetails(movieId) {
    try {
        const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
        const response = await fetch(detailsUrl);
        const movieDetailsData = await response.json();
        const { title, poster_path, overview, release_date} = movieDetailsData;

        selectedMovieId = movieId;

        movieDetails.innerHTML = '';

        const titleMovie = document.createElement('P');
        titleMovie.textContent = title;

        const imageMovie = document.createElement('IMG');
        imageMovie.src = `https://image.tmdb.org/t/p/w500${poster_path}`;
        imageMovie.style.width = '200px';
        imageMovie.style.height = 'auto'; 

        const descriptionMovie = document.createElement('P');
        descriptionMovie.textContent = overview;

        const yearMovie = document.createElement('P');
        yearMovie.textContent = release_date;

        movieDetails.classList.remove('hidden');
        movieDetails.appendChild(titleMovie)
        movieDetails.appendChild(imageMovie)
        movieDetails.appendChild(descriptionMovie)
        movieDetails.appendChild(yearMovie);
        movieDetails.appendChild(addToFavoritesButton)
        
        

    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}




// Search movies
searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (query) {
        try {
            const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${apiKey}`
            const response = await fetch(searchUrl);
            const {results} = await response.json();

            displayMovies(results); 

        } catch (error) {
            console.error('Error searching movies:', error);
        }
    }
});

// Add movie to favorites
addToFavoritesButton.addEventListener('click', () => {
    if (selectedMovieId) {
        const favoriteMovie = {
            id: selectedMovieId,
            title: document.querySelector('#movie-details p').textContent
        };
        if (!favoriteMovies.some(movie => movie.id === selectedMovieId)) {
            favoriteMovies.push(favoriteMovie);
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); // Guarda en localStorage
            displayFavorites(); // Muestra la lista actualizada de favoritos
        }
    }
});

// Display favorite movies
function displayFavorites() {
    favoritesList.innerHTML = ''; // Limpia la lista de favoritos
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        favoritesList.appendChild(li);
    });
}

// Initial fetch of popular movies and display favorites
fetchPopularMovies(); // Obtiene y muestra las películas populares
displayFavorites(); // Muestra las películas favoritas guardadas
 