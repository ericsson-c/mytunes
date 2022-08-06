/* ------------------------- ADDTOPLAYLIST.JS -------------------------------

- Page for add playlists
- At the top of the page, user sets playlist name
- In song table, user select which songs they want to add to the playlist

--------------------------------------------------------------------
*/

import React from 'react';
import Cookie from 'universal-cookie';
import { Navigate, Link } from 'react-router-dom';

import '../stylesheets/CreatePlaylist.css';
import '../stylesheets/Songs.css';

// 
const apiURL = process.env.REACT_APP_CLIENT_URL;

class AddToPlaylist extends React.Component {

    cookie = new Cookie();

    constructor(props) {
        super(props);
        this.state = {
            songs: null,
            goToPlaylists: false,
            
        }

        this.createSongList = this.createSongList.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // fetch all songs when component mounts
    componentDidMount() {
        fetch(apiURL + '/api/songs')
        .then(res => res.json())
        .then(songs => {
            console.log('fetching all songs...', songs);
            this.setState({songs: songs.songs});
        })
        .catch(err => console.log(err));
    }

    // when form submits, post new playlist to database
    handleSubmit(e) {

        e.preventDefault();

        // add the songs that are checked off to request body
        const songs = []

        if (typeof(e.target.songs[0]) === "undefined") {
            
            if (e.target.songs.checked) { 
                songs.push(e.target.songs.value); 
            } 
        
        } else {

            for (let i = 0; i < e.target.songs.length; i++) {
                if (e.target.songs[i].checked) { 
                    songs.push(e.target.songs[i].value); 
                } 
            }
        }



        fetch(apiURL + '/api/playlists/create', {
            credentials: 'include',
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                songs: songs,
                name: e.target.name.value
            })
        }).then(res => {
            console.log(res.status);
            return res.json();
        })

        // after fetch...

        .then(playlistData => {

            // if there's an error...
            if (playlistData.message) {
                
                // log error message 
                console.log(playlistData.message);

                // & refresh to prompt login
                // window.location.reload();

            } else {

                console.log('redirecting to playlist...');
                window.location = '/playlists';
            }
        })
        .catch(err => console.log(err)); 
    }

    // function for creating rows in the song table
    createSongRow(song, table) {

        const tr = document.createElement('tr');

        const title = document.createElement('td');
        const artist = document.createElement('td');
        const album = document.createElement('td');

        title.textContent = song.title;
        title.className = 'song-name';
        artist.textContent = song.artist;
        album.textContent = song.album;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'songs';
        checkbox.value = song._id;

        tr.appendChild(title);
        tr.appendChild(artist);
        tr.appendChild(album);

        tr.appendChild(checkbox);
        table.appendChild(tr);
    }

    // function for creating song table
    createSongList(songs) {

        const table = document.querySelector(".song-table tbody");

        for (let i = 0; i < songs.length; i++) {
            this.createSongRow(songs[i], table);
        }
    }

    // when song data is fetched -> create song table
    componentDidUpdate(prevProps, prevState) {
        if (prevState.songs !== this.state.songs) {
            this.createSongList(this.state.songs);
        }
    }
    

    render () {

        if (!(this.cookie.get('user'))) {
            return <Navigate to='/login' />
        }

        return (
            <div className='container'>
                <form encType="multipart/form-data" onSubmit={this.handleSubmit}>
                    <div className="create-playlists">
                        <span>
                            <h1><input id="playlist-name" name="name" type="text" placeholder="Enter Playlist Name"/></h1>
                            <button id="back-btn"><Link to='/playlists'>Back to Playlists</Link></button>
                            <button id="create-btn" type="submit">Create</button>
                        </span>
                        <div className='song-table'>
                            <table>
                                <thead>
                                    <tr id='song-table-header'>
                                        <td>TITLE</td>
                                        <td>ARTIST</td>
                                        <td>ALBUM</td>
                                        <td>ADD?</td>
                                    </tr>
                                </thead>

                                <tbody>
                                </tbody>
                                
                            </table>
                        </div>
                        
                    </div>
                </form>
            </div>
        );
    }
} 

export default AddToPlaylist;