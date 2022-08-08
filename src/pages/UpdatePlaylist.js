/* ------------------------- UPDATEPLAYLIST.JS -------------------------------

- Page for updating playlists
- User can select songs to add and/or delete from the playlist

--------------------------------------------------------------------
*/

import React from 'react';
import Cookie from 'universal-cookie';
import { Navigate, Link } from 'react-router-dom';
import { withRouter } from './Playlist_id';

import '../stylesheets/CreatePlaylist.css';
import '../stylesheets/Songs.css';
import '../stylesheets/UpdatePlaylist.css';

// 
const apiURL = process.env.REACT_APP_CLIENT_URL;

class UpdatePlaylist extends React.Component {

    cookie = new Cookie();

    constructor(props) {
        super(props);
        this.state = {
            name: "No Playlist Selected",
            id: "62ea79808c526ea2cf9b74bc",
            // songs: null,
            songsInPlaylist: null,
            goToPlaylists: false
        }

        this.createSongList = this.createSongList.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddBtn = this.handleAddBtn.bind(this);
        this.handleBackBtn = this.handleBackBtn.bind(this);
    }

    // fetch songs in playlist when component mounts
    async componentDidMount() {

        const { id } = this.props.router.params;

        try {

            // const songsRes = await fetch(apiURL + '/api/songs' + id);
            const playlistsRes  = await fetch(apiURL + '/api/playlists/' + id);
    
            if (/*songsRes.status !== 200 ||*/ playlistsRes.status !== 200) {
                throw new Error('Error fetching playlist data.');
            }

            // const allSongs = (await songsRes.json()).songs;
            const playlistData = (await playlistsRes.json());
            

            this.setState({
                //songs: allSongs,
                songsInPlaylist: playlistData.songs,
                name: playlistData.name,
                id: id
            }, () => {
                // console.log(this.state);
            })

        } catch (err) {

            console.log(err.message);
            return;
        }

        /*
        fetch(apiURL + '/api/songs')
        .then(res => res.json())
        .then(songs => {
            this.setState({songs: songs.songs});

            fetch()
        })
        .catch(err => console.log(err));
        */
    }

    // when form submits, post new playlist to database
    handleSubmit(e) {

        e.preventDefault();

        // add the songs that are checked off to request body
        const songs = []

        if (typeof(e.target.songs[0]) === "undefined") {
            
            if (!e.target.songs.checked) { 
                songs.push(e.target.songs.value); 
            } 
        
        } else {

            for (let i = 0; i < e.target.songs.length; i++) {
                if (!e.target.songs[i].checked) { 
                    songs.push(e.target.songs[i].value); 
                } 
            }
        }


        fetch(apiURL + '/api/playlists/edit/' + this.state.id, {
            credentials: 'include',
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                songsToKeep: songs,
            })
        }).then(res => {
            // console.log(res.status);
            return res.json();
        })

        // after fetch...

        .then(playlistData => {

            // if there's an error...
            if (playlistData.message) {
                
                // log error message 
                console.log(playlistData.message);

            } else {

                console.log(playlistData);
                // redirect to page for the playlist that was updated
                window.location = '/playlists/' + this.state.id;
            }
        })
        .catch(err => console.log(err)); 
    }


    handleAddBtn(evt) {

        window.location = '/songs'
    }


    handleBackBtn(evt) {
        
        window.location = '/playlists/' + this.state.id;
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


    createAllSongRow(song, table) {

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


    createAllSongList(songs) {

        const table = document.querySelector(".song-table tbody");

        for (let i = 0; i < songs.length; i++) {
            this.createSongRow(songs[i], table);
        }
    }


    componentDidUpdate(prevProps, prevState) {

        // when song data is fetched -> create song table
        if (prevState.songs !== this.state.songsInPlaylist) {
            this.createSongList(this.state.songsInPlaylist);
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
                            <h1>{this.state.name}</h1>
                            <button id="add-btn" onClick={this.handleAddBtn}>+ Add Songs</button>
                            <button id="update-btn" type="submit">&#10003; Update</button>
                            <button id="back-btn" onClick={this.handleBackBtn}>Back</button>
                        </span>
                        <div className='song-table'>
                            <table>
                                <thead>
                                    <tr id='song-table-header'>
                                        <td>TITLE</td>
                                        <td>ARTIST</td>
                                        <td>ALBUM</td>
                                        <td>DELETE?</td>
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

export default withRouter(UpdatePlaylist);