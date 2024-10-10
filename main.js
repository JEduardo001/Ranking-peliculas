const LoginComponent = {
    template: `
        <div id="divLogin">
            <h2>Ranking Películas</h2>
            <h2>Login</h2>
            <input v-model="username" placeholder="Username">
            <input v-model="password" type="password" placeholder="Password">
            <button @click="login">Login</button>
        </div>
    `,
    data() {
        return {
            username: '',
            password: ''
        };
    },
    methods: {
        login() {


            if (this.username && this.password) {
                const user = {
                    username: this.username,
                };

                localStorage.setItem('usuario', JSON.stringify(user));

                this.$router.push('/movies');
            } else {
                alert('Por favor, introduce un nombre de usuario y una contraseña.');
            }


        }
    }
};

const MoviesComponent = {
    template: `
        <div>
            



            
            <h2>Rankings Películas</h2>

             <nav>
                <ul class="menu">
                    <li @click="fetchPopularMovies">Películas Populares</li>
                    <li @click="fetchTopRatedMovies">Películas Mejor Valoradas</li>
                    <li @click="fetchUpcomingMovies">Próximas Estrenos</li>
                    <li @click="fetchNowPlayingMovies">Películas en Estreno</li>
                </ul>
            </nav>
            <div class="movies-container">
                <div class="movie-card" v-for="movie in movies" :key="movie.id">
                    <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" alt="Movie Poster">
                    <h3>{{ movie.title }}</h3>
                    <p class="rating">
                        <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= Math.round(movie.vote_average) }">&#9733;</span>
                        <span class="rating-value">{{ movie.vote_average }}</span>
                    </p>

                    <button @click="goToMovieDetails(movie.id)">Ver Detalles</button>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            movies: []
        };
    },
    created() {
        this.fetchMovies();
    },
    methods: {
        async fetchMovies() {
            const response = await axios.get('https://api.themoviedb.org/3/movie/popular?api_key=8a758308cbfef2cba726df108d9563fa');
            this.movies = response.data.results;
        },
        async fetchPopularMovies() {
            const response = await axios.get('https://api.themoviedb.org/3/movie/popular?api_key=8a758308cbfef2cba726df108d9563fa');
            this.movies = response.data.results;
        },
        async fetchTopRatedMovies() {
            const response = await axios.get('https://api.themoviedb.org/3/movie/top_rated?api_key=8a758308cbfef2cba726df108d9563fa');
            this.movies = response.data.results;
        },
        async fetchUpcomingMovies() {
            const response = await axios.get('https://api.themoviedb.org/3/movie/upcoming?api_key=8a758308cbfef2cba726df108d9563fa');
            this.movies = response.data.results;
        },
        async fetchNowPlayingMovies() {
            const response = await axios.get('https://api.themoviedb.org/3/movie/now_playing?api_key=8a758308cbfef2cba726df108d9563fa');
            this.movies = response.data.results;
        },
        goToMovieDetails(movieId) {
            this.$router.push({ name: 'movieDetails', params: { id: movieId } });
        }
    },
  
};

const MovieDetailsComponent = {
    template: `
        <div id="divDetailMovie">
            <h2>{{ movie.title }}</h2>
            <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" alt="Movie Poster">
             <p class="rating">
                        <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= Math.round(movie.vote_average) }">&#9733;</span>
                        <span class="rating-value">{{ movie.vote_average }}</span>
            </p>
            <p>{{ movie.overview }}</p>
            <input v-model="userRating" type="number" min="0" max="10" placeholder="Calificación (0-10)">
            <button @click="rateMovie">Añadir Rate</button>
            <button @click="deleteRate">Eliminar Rate</button>
        </div>
    `,
    data() {
        return {
            movie: {},
            userRating: '' 
        };
    },
    created() {
        this.fetchMovieDetails();
    },
    methods: {
        async fetchMovieDetails() {
            const movieId = this.$route.params.id;
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=8a758308cbfef2cba726df108d9563fa`);
            this.movie = response.data;
        },
        async rateMovie() {
            const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YTc1ODMwOGNiZmVmMmNiYTcyNmRmMTA4ZDk1NjNmYSIsIm5iZiI6MTcyODU5MDU0Ny40NDczMjgsInN1YiI6IjY3MDViZDcxMDAwMDAwMDAwMDU4NjY0NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sY1RDD50NO9SUI_24pBLaILEnEPyYnnyaQLcLhjuWD4'; 
            const movieId = this.movie.id;

            if (!this.userRating || this.userRating < 0 || this.userRating > 10) {
                alert('Por favor, ingresa una calificación válida entre 0 y 10.');
                return;
            }

            try {
                const response = await axios.post(
                    `https://api.themoviedb.org/3/movie/${movieId}/rating`,
                    { value: this.userRating },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }
                );

                alert('Calificación añadida exitosamente');
                this.movie.vote_average = (this.movie.vote_average + parseFloat(this.userRating)) / 2;
            } catch (error) {
                console.error('Error al añadir la calificación:', error);
                alert('Error al añadir la calificación. Inténtalo de nuevo.');
            }
        },
        async deleteRate() {
            alert('Rate eliminado');
            this.movie.vote_average = 0.0;
        }
    }
};


const routes = [
    { path: '/', component: LoginComponent },
    { path: '/movies', component: MoviesComponent },
    { path: '/movie/:id', component: MovieDetailsComponent, name: 'movieDetails' }
];

const router = new VueRouter({
    routes
});

new Vue({
    el: '#app',
    router
});
