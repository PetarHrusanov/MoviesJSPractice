function host(endpoint){
    return `https://api.backendless.com/82D7D8CC-DAF0-609A-FF8C-E0B2EA590400/3FE063C5-9E35-43BE-B010-C17750D62AD2/${endpoint}`;
}

const endpoints = {
    REGISTER: 'users/register',
    LOGIN: 'users/login',
    LOGOUT: 'users/logout',
    MOVIES: 'data/movies',
    MOVIE_BY_ID: 'data/movies/'
}

async function register(username, password){
    return (await fetch(host(endpoints.REGISTER),{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    })).json();
}

async function login(username, password){
    const result = await (await fetch(host(endpoints.LOGIN),{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login: username,
            password
        })
    })).json();
    localStorage.setItem('userToken', result['user-token']);
    localStorage.setItem('username', result.username);
    localStorage.setItem('userId', result.objectId);
    return result;
}


async function logout(){
    const token = localStorage.getItem('userToken');
    if(!token){
        throw new Error('User is not logged in');
    }

    return (await fetch(host(endpoints.LOGOUT),{
        method: 'GET',
        headers: {
            'user-token': token

        }
    }));
}

async function getMovies(){
    const token = localStorage.getItem('userToken');
    if(!token){
        throw new Error('User is not logged in');
    }
    return (await fetch(host(endpoints.MOVIES),{
        headers: {
            'user-token': token
        }
    })).json();
}

async function getMovieById(id){
    const token = localStorage.getItem('userToken');
    if(!token){
        throw new Error('User is not logged in');
    }
    return (await fetch(host(endpoints.MOVIE_BY_ID+id),{
        headers: {
            'user-token': token
        }
    })).json();
}

async function createMovie(movie){
    const token = localStorage.getItem('userToken');
    if(!token){
        throw new Error('User is not logged in');
    }
    return (await fetch(host(endpoints.MOVIES),{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'user-token': token,
        },
        body: JSON.stringify(movie)
    })).json();
}

async function updateMovie(id, updatedProps){
    const token = localStorage.getItem('userToken');
    if(!token){
        throw new Error('User is not logged in');
    }
    return (await fetch(host(endpoints.MOVIE_BY_ID+id),{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'user-token': token,
        },
        body: JSON.stringify(updatedProps)
    })).json();
}

async function deleteMovie(id, updatedProps){
    const token = localStorage.getItem('userToken');
    if(!token){
        throw new Error('User is not logged in');
    }
    return (await fetch(host(endpoints.MOVIE_BY_ID+id),{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'user-token': token,
        },
        body: JSON.stringify(updatedProps)
    })).json();
}

async function getMovieByOwnerId(ownerId){
    const token = localStorage.getItem('userToken');
    if(!token){
        throw new Error('User is not logged in');
    }
    return (await fetch(host(endpoints.MOVIES+`?where=ownerId%3D%27${ownerId}%27`),{
        headers: {
            'user-token': token
        }
    })).json();
}

async function buyTicket(movie){
    const newTickets = movie.tickets-1;
    const movieId = movie.objectId;
    return updateMovie(movieId, {tickets: newTickets});
}
