/* ------------------------- SONG.JS -------------------------------

- In this file, the 'SongTable' component is defined, which is
    shared by the BrowseSong (this file) and Playlist (Playlist.js)
    components to display all songs in the database and
    play audio directly from the page

- User can search for songs based on title, artist or album
    via search bar
    
--------------------------------------------------------------------
*/

import React from 'react';
import '../stylesheets/Songs.css';
import { Link, Navigate } from 'react-router-dom';
import Cookie from 'universal-cookie';

//const apiURL = 'http://mytunes-api.herokuapp.com';
const apiURL = 'http://localhost:3000';

class BrowseSongs extends React.Component {

    cookie = new Cookie();

    constructor(props) {
        super(props);
        this.state = {
            songs: null,
            displayedSongs: null
        }
        
        this.search = this.search.bind(this);
    }

    // same as playlists
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

    componentDidMount() {
        console.log('user cookie: ', this.cookie.get('user'));
        // fetch all songs
        fetch('/api/songs', { credentials: 'include'} )
        .then(res => res.json())
        .then(data => {
            this.setState({
            songs: data.songs,
            displayedSongs: data.songs
        });
        console.log('req user: ', data.user);
        }).catch(err => console.log(err));
    }

    render () {

        if (!(this.cookie.get('user'))) {
            return (
                <Navigate to="/login" />
            )
        }

        return (
            <div className="container">
                <div id="browse-songs">
                    <span>
                        <h1 className="all-songs">Browse all songs</h1>
                        <button><Link to='/upload' >+</Link></button>
                        <div className="upload-song">Upload Song</div>
                    </span>
                    <input id="search-bar" onChange={this.search} placeholder="Search for a song, artist or album..." type="text" name="searched-song"/>
                    <div className='song-table'>
                        <SongTable songs={this.state.displayedSongs} key={'BrowseSongs'}/>
                    </div>
                </div> 
            </div>
        );
    }
}

class SongTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            song: null,
            button: null,
            status: null
        }
        this.playSong = this.playSong.bind(this);
        this.createSongTable = this.createSongTable.bind(this);
    }

    async playSong(e, btn) {
        // if there's no current song, or a new song is clicked, make clicked song the current song
        if (!(this.state.song) || e.target.value !== this.state.song.id) {
            const audio = new Audio('/api/songs/' + e.target.value);
            audio.id = e.target.value;

            // if there was another song playing, pause it
            if (this.state.song && e.target.value !== this.state.song.id) { 
                this.state.song.load(); 
                // update text content of currently playing button
                this.state.button.textContent = '\u25B6';
            }

            await this.setState({song: audio, button: btn, status: 'playing'});
            audio.play();

        // else if the clicked song is the currently playing song
        } else {
            if (this.state.status === 'playing') { 
                this.state.song.pause();
                await this.setState({status: 'paused'})
            } else {
                this.state.song.play();
                await this.setState({status: 'playing'})
            }
        } 
        this.updateTextContent(btn);
    }

    updateTextContent(btn) {
        // if btn is displaying 'pause' or another song started playing, reset to 'play'
        if (btn.textContent === '\u23F8') { btn.textContent = '\u25B6'}
        else { btn.textContent = '\u23F8'}
    }

    createSongTableData(tr, song, songElement) {
        const td = document.createElement('td');
        td.textContent = song[songElement];
        if (songElement === 'title') {
            td.className = 'song-name';
        }
        tr.appendChild(td);
    }
    
    // audio.src = apiURL + 'songs/' + songs[i].file_id;
    
    // function for creating a song table
    createSongTable(songs) {
        const tbody = document.querySelector(".song-table tbody");
        // reset tbody, then repopulate
        tbody.innerHTML = '';
        for (let i = 0; i < songs.length; i++) {
            const tr = document.createElement('tr');
            this.createSongTableData(tr, songs[i], 'title');
            this.createSongTableData(tr, songs[i], 'artist');
            this.createSongTableData(tr, songs[i], 'album');
            // add play btn
            const playBtn = document.createElement('button');
            playBtn.className = 'playBtn';
            playBtn.textContent = '\u25B6';
            playBtn.value = songs[i].file_id;
            playBtn.addEventListener('click', (e) => {
                this.playSong(e, playBtn);
            });
            const td = document.createElement('td');
            td.appendChild(playBtn);
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
    }

    componentDidUpdate(prevProps) {
        // render song table when song data is fetch in parent
        //console.log('prevProps: ', prevProps, 'currentProps: ', this.props);
        if (prevProps.songs !== this.props.songs) {
            this.createSongTable(this.props.songs);
        }
    }
    
    render () {
        return (
                <table>
                    <thead id="song-table-header">
                        <tr>
                            <td>TITLE</td>
                            <td>ARTIST</td>
                            <td>ALBUM</td>
                            <td>PLAY</td>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
        );
    }
}

export { BrowseSongs, SongTable };