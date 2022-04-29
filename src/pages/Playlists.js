/* ------------------------- PLAYLISTS.JS -------------------------------

- Option to toggle between playlists
- Button for creating new playlist that links to /create

- Utlilizes SongTable component (BrowseSongs.js) to display all available
    songs and allow user to play audio directly from page

- User can search for songs based on title, artist or album
    via search bar

--------------------------------------------------------------------
*/

import React from 'react';
import Cookie from 'universal-cookie';
import { SongTable } from './Songs';
import { Link, Navigate } from 'react-router-dom';

import '../stylesheets/Playlists.css';

//sconst apiURL = 'http://mytunes-api.herokuapp.com';
const apiURL = 'http://localhost:3000';

class Playlists extends React.Component {
    
    cookie = new Cookie();
    
    constructor(props) {
        super(props);
        this.state = {
            currentPlaylist: {name: 'Playlist'},
            userPlaylists: [],
            songs: null,
            displayedSongs: null
        }
        
        this.changePlaylist = this.changePlaylist.bind(this);
        this.generatePlaylistButtons = this.generatePlaylistButtons.bind(this);
        this.fetchSongs = this.fetchSongs.bind(this);
        this.setState = this.setState.bind(this);
        this.search = this.search.bind(this);
    }

    // dynamically adjust search results as user types in search bar
    search(e) {

        this.setState({
            displayedSongs: this.state.songs
        });

        const query = e.target.value.toLowerCase();
        const songs = this.state.songs;

        for (let i = 0; i < songs.length; i++) {

            const re = new RegExp(`.*?${query}.*?`);

            if (!(re.test(songs[i].title.toLowerCase()) || re.test(songs[i].artist.toLowerCase()) || re.test(songs[i].album.toLowerCase())))
            {
                this.setState({
                    displayedSongs: this.state.songs.filter((val, index) => { return index !== i })
                });
            }
        }
    }


    changePlaylist(evt) {

        const newCurrentPlaylist = this.state.userPlaylists[evt.target.value]
        this.setState({currentPlaylist: newCurrentPlaylist});

        console.log('Switching playlist...');
        this.fetchSongs(newCurrentPlaylist);
    }

    
    generatePlaylistButtons(playlists) {

        const dropdown = document.querySelector(".dropdown-content");

        for (let i = 0; i < playlists.length; i++) {

            const playlistBtn = document.createElement("button");

            playlistBtn.textContent = playlists[i].name;
            playlistBtn.value = i;
            playlistBtn.addEventListener('click', this.changePlaylist);

            dropdown.appendChild(playlistBtn);
        }
    }
    
    fetchSongs(playlist) {

        fetch('/api/playlists/' + playlist._id)

        .then(res => res.json())
        .then(songData => this.setState({

            songs: songData.songs,
            displayedSongs: songData.songs
        }))

        .catch(err => console.log(err));
    }
    
    // on page load, fetch playlist data for user and associated song data for the first fetched playlist
    componentDidMount() {

        // immediately return if user is not logged in

        //if (!(this.cookie.get('user'))) { return; }

        console.log('playlist user cookie: ', this.cookie.get('user'));

        // ---- FETCH PLAYLIST DATA ---- \\
        
        fetch('/api/playlists', { credentials: 'include' })
        .then(res => res.json())
        .then(playlists => {

            // if there was an error fetching, log the err msg then refresh page to prompt a login
            if (playlists.message) {
                console.log(playlists.message);
                //window.location.reload();
            }

            // else, set state of initial playlist to first playlist
            console.log("Loading intial playlist...");

            this.setState({
                userPlaylists: playlists,
                currentPlaylist: playlists[0],
            });

            // ---- POPULATE HTML WITH PLAYLIST OPTIONS FOR USER --- \\

            this.generatePlaylistButtons(playlists);
            return playlists[0];

        })  // ---- FETCH SONG DATA FOR CURRENT PLAYLIST --- \\

        .then((playlist) => { 
            if (playlist) { this.fetchSongs(playlist) }
        })

        .catch(err => console.log(err));
    }
    
    render() {

        if (!(this.cookie.get('user'))) {
            return <Navigate to='/login' />
        }

        return (
            <div className='container'>
                <div id="display-playlists">
                    <div className="dropdown">
                        <span className="all-songs">
                            <h1>{this.state.currentPlaylist ? this.state.currentPlaylist.name : 'Choose Playlist'}</h1>
                            <button className="dropbtn">
                                <h1 className="caret">&#9660;</h1>
                            </button>
                            <div className='dropdown-content'>
                            </div>
                            <button className="plus-btn"><Link to='/create'>+</Link></button>
                            <div className="create-playlist">Create Playlist</div>
                        </span>
                    </div>
                    
                    <input id="search-bar" onChange={this.search} placeholder="Search for a song, artist or album..." type="text" name="searched-song"/>
                    <div className='song-table'>
                        <SongTable songs={this.state.displayedSongs} key={'Playlists'}/>
                    </div>
                </div> 
            </div>
        );
    }
}

export default Playlists;