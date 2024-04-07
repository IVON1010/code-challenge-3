// Your code here
document.addEventListener('DOMContentLoaded', function initialize() {
    findFilms();
});

const baseUrl = 'http://localhost:3000/films'
const ticketsUrl = 'http://localhost:3000/tickets'



// provide film list
function movieName(movies) {
    const filmList = document.querySelector('#films');
    
    // Clear previous content
    filmList.innerHTML = '';

    // Function to handle delete action
    const deleteFilm = (id) => {
        // Your delete logic here
        console.log("Deleting film with id:", id);
    };

    // Iterate through movies array
    movies.forEach(movie => {
        // Create list item for movie title
        const movieTitle = document.createElement('li');
        movieTitle.className = 'film item';
        movieTitle.textContent = movie.title;

        // Add class 'sold-out' if tickets_sold >= capacity
        if (movie.tickets_sold >= movie.capacity) {
            movieTitle.classList.add('sold-out');
        }

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = movie.tickets_sold >= movie.capacity ? 'Sold Out' : 'Delete';
        deleteButton.addEventListener('click', () => {
            deleteFilm(movie.id);
        });

        // Append movie title and delete button to film list
        movieTitle.appendChild(deleteButton);
        filmList.appendChild(movieTitle);
    });
}

//provide details for the first film
function firstFilm(movie) {
    document.getElementById('title').textContent = movie.title
    document.getElementById('runtime').textContent = movie.runtime + ' minutes'
    document.getElementById('film-info').textContent = movie.description
    document.getElementById('title').textContent = movie.title
    document.getElementById('runtime').textContent = movie.runtime + ' minutes'
    const posterImage = document.getElementById('poster')
    posterImage.src = movie.poster
    posterImage.alt = movie.title
    document.getElementById("buy-ticket").addEventListener('click', ()=>{
        ++ movie.tickets_sold 
        ticketsCounted(movie)
        postPurchase(movie.id, 1)
    })
    if (movie.tickets_sold >= movie.capacity) {
        document.getElementById("buy-ticket").disabled = true
        document.getElementById("buy-ticket").textContent = 'Sold Out';
        
    }
}

//Show first movie details
function findFilms() {
    fetch(baseUrl)
    .then(res => res.json())
    .then(movies => {
        if (movies.length > 0) {
            firstFilm(movies[0]);
            movieName(movies)
        }
    })
}

//Uodate the movies that have remained
async function ticketsCounted(films) {
    try {
        const response = await fetch(`${baseUrl}/${films.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tickets_sold: films.tickets_sold + 1 })
        });
        const updateMovie = await response.json();

        const remainingTickets = updateMovie.capacity - updateMovie.tickets_sold;
        document.getElementById('ticket-num').textContent = remainingTickets;

        // Disable ticket button if sold out
        if (remainingTickets === 0) {
            const buyTicketButton = document.getElementById("buy-ticket");
            buyTicketButton.disabled = true;
            buyTicketButton.textContent = 'Sold Out';
        }
    } catch (error) {
        console.error('Error updating ticket count:', error);
    }
}

//post the bought ticket to the tickets endpoint
function postPurchase(filmId, numberOfTickets) {
    //create a ticketData object
    const ticketData = {
        film_id: filmId,
        number_of_tickets: numberOfTickets
    };
    fetch(ticketsUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticketData)
    })
    .then(response => response.json())
    
}


//delete movie
function deleteFilm(film) {
    fetch(`${baseUrl}/${film}`, {
        method: 'DELETE',
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(res=>res.json())
    window.location.reload()
}