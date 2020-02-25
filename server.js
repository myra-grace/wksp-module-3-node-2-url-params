'use strict';

const express = require('express');

const morgan = require('morgan');

const { top50 } = require('./data/top50');

const { books } = require('./data/books');

const PORT = process.env.PORT || 8000;

const app = express();

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');

// endpoints here
app.get('/top50', (req, res) => {
    res.render('pages/top50', {
        title: 'Top 50 Songs Streamed on Spotify',
        songs: top50
    });
});

//exercise 1.5
app.get('/top50/popular', (req, res) => {
        let artists =[];
        top50.forEach(song => {
            artists.push(song.artist)
        });
        artists.sort((a,b) => a > b ? 1 : -1);

        // figure out how to get artist that occurs most often
        let occurrence = {};
        artists.forEach(function (person) {
            if (occurrence[person]) {
                occurrence[person]++;
            } else {
                occurrence[person] = 1;
            }
        });
        
        let sortedArtists = Object.keys(occurrence).sort(function(a, b) {
            return occurrence[b] - occurrence[a];
        });
        
        const mostPopularArtist = sortedArtists[0];

        // use filter to get his/her songs
        const artistSongs = top50.filter(song => {
            return song.artist === mostPopularArtist;
        })

        console.log(artistSongs);
    
    res.render('pages/top50', {
        title: `Top Artist: ${mostPopularArtist}`,
        songs: artistSongs
    });
});

//exercise 1.6 `` NOT WORKING ``
app.get('/top50/song/:rank', (req, res) => {
    const rank = req.params.rank - 1;
    const spot = top50.filter(place => place.rank == rank);
    if (spot) {    
        res.render('pages/topArtists', {
            title: `${top50[rank].rank}`,
            song: spot
        });
    } else {
        res.status(404);
        res.render('pages/fourOhFour', {
            title: 'I got nothing',
            path: req.originalUrl
        });
    }
});

//exercise 2
app.get('/books', (req, res) => {
    res.render('pages/booksPage', {
        title: 'Library',
        books: books
    });
});

app.get('/books/:id', (req, res) => {
    const id = req.params.id;
    const book = books.find(book => book.id == id);
    if (book) {    
        res.render('partials/book', {
            title: `${book.title}`,
            book: book
        });
    } else {
        res.status(404);
        res.render('pages/fourOhFour', {
            title: 'I got nothing',
            path: req.originalUrl
        });
    }
});
// `` NOT WORKING ``
app.get('/booksType/:type', (req, res) => {
    const type = req.params.type;
    const booksByType = books.filter(book => book.type == type);
    if (booksByType) {    
        res.render('pages/booksPage', {
            title: `${type}`,
            books: booksByType
        });
    } else {
        res.status(404);
        res.render('pages/fourOhFour', {
            title: 'I got nothing',
            path: req.originalUrl
        });
    }
});

// handle 404s
app.get('*', (req, res) => {
    res.status(404);
    res.render('pages/fourOhFour', {
        title: 'I got nothing',
        path: req.originalUrl
    });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
