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
// import '../stylesheets/Register.css'
import { Link, Navigate } from 'react-router-dom';
import Cookie from 'universal-cookie';

const apiURL = process.env.REACT_APP_CLIENT_URL;

class BrowseSongs extends React.Component {

    cookie = new Cookie();

    constructor(props) {
        super(props);
        this.state = {
            songs: null,
            displayedSongs: null,
            playlists: null,
        }
        
        this.search = this.search.bind(this);
    }

    // same as playlists
    search(e) {
        
        const query = e.target.value.toLowerCase();
        const re = new RegExp(`.*?${query}.*?`);
        const songs = this.state.songs;
        let newDisplayedSongs;
        newDisplayedSongs = songs;

        for (let i = 0; i < songs.length; i++) {
            
            if (!(re.test(songs[i].title.toLowerCase()) || re.test(songs[i].artist.toLowerCase()) || re.test(songs[i].album.toLowerCase())))
            {
                newDisplayedSongs = newDisplayedSongs.filter(song => {
                    return song._id !== songs[i]._id;
                });
            }
        }

        this.setState({
                // set State to exclude songs with NO match
                displayedSongs: newDisplayedSongs
            });
    }

    componentDidMount() {

        // fetch all songs
        fetch(apiURL + '/api/songs', { credentials: 'include'} )
        .then(res => res.json())
        .then(data => {
            this.setState({
            songs: data.songs,
            displayedSongs: data.songs,
            playlists: data.playlists
        });
        }).catch(err => console.log(err));
    }

    render () {

        if (!(this.cookie.get('user'))) {
            return (
                window.location = '/login'
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
                        <SongTable songs={this.state.displayedSongs} playlists={this.state.playlists} key={'BrowseSongs'}/>
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
            status: null,
            clickedSongID: null
            
        }
        this.playSong = this.playSong.bind(this);
        this.createSongTable = this.createSongTable.bind(this);
        // this.createOptionsPopUp = this.createOptionsPopUp.bind(this);
        this.createOptionsButton = this.createOptionsButton.bind(this);
        this.createPlaylistTable = this.createPlaylistTable.bind(this);
        this.handleOptionsBtn = this.handleOptionsBtn.bind(this);
        this.handleAddBtn = this.handleAddBtn.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleX = this.handleX.bind(this);
        this.displayErrMsg = this.displayErrMsg.bind(this);
    }


    async playSong(e, btn) {
        // if there's no current song, or a new song is clicked, make clicked song the current song
        if (!(this.state.song) || e.target.value !== this.state.song.id) {
            const audio = new Audio(apiURL + '/api/songs/' + e.target.value);
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


    createOptionsButton(tr, song) {

        const td = document.createElement('td');
        const container = document.createElement("div");
        container.classList.add('popup-container');

        const popup = document.createElement("button");
        popup.classList.add('options-popup');
        popup.classList.add('hidden');
        popup.classList.add("A" + song._id);
        popup.textContent = 'Add To Playlist';
        
        const btn = document.createElement('button');
        btn.classList.add('options-btn');
        btn.innerHTML = '&hellip;'

        container.appendChild(popup);
        container.appendChild(btn);
        
        td.appendChild(container);
        tr.appendChild(td);
        return btn;
    }


    handleOptionsBtn(song) {
        
        const optionsPopUp = document.querySelector(".A" + song._id);
        optionsPopUp.classList.toggle('hidden');
        optionsPopUp.addEventListener('click', this.handleAddBtn);
        // console.log(optionsPopUp.classList[2]);
    }


    handleAddBtn(evt) {

        document.querySelector(".playlists-popup tbody").classList.toggle('hidden');
        document.querySelector(".playlists-popup thead").classList.toggle('hidden');
        document.querySelector(".playlists-popup-div").classList.toggle('hidden');
        // document.querySelector("#playlists-submit").classList.toggle('hidden');
        document.querySelector(".songs").style.opacity = "40%";

        // strip the leading 'A' from the songID
        const id = evt.target.classList[1].slice(1);

        this.setState({
            clickedSongID: id
        }, () => console.log(this.state.clickedSongID));
    }


    handleX() {

        // change opacity back to 100%
        document.querySelector(".songs").style.opacity = "100%";
        // hide popup
        document.querySelector(".playlists-popup tbody").classList.toggle('hidden');
        document.querySelector(".playlists-popup thead").classList.toggle('hidden');
        document.querySelector(".playlists-popup-div").classList.toggle('hidden');
        // hide 'Add to Playlist' popup
        const allOptionsBtns = document.querySelectorAll(".options-popup");
        allOptionsBtns.forEach(b => {
            if (!b.classList.contains("hidden")) {
                b.classList.toggle("hidden");
            }
        });
    }


    displayErrMsg(message) {

        const errMsg = document.querySelector(".error-msg");
        errMsg.textContent = message;
        console.log(errMsg.textContent);
        errMsg.classList.toggle("hidden");
    }


    handleSubmit(e) {

        e.preventDefault();
        if (!document.querySelector(".error-msg").classList.contains("hidden")) {
            document.querySelector(".error-msg").classList.toggle("hidden");
        }
        const playlists = document.querySelectorAll('.playlists-popup input');

        playlists.forEach((playlist, i) => {

            /*
            const inPlaylist = async () => {

                const selectedPlaylist = await fetch(apiURL + '/api/playlists/' + playlist.value)
                .then(res => res.json());

                if (selectedPlaylist.songs.includes(this.state.clickedSongID)) {
                    return true;
                } else return false;
            }
            */

        
            if (playlist.checked) {

                fetch(apiURL + '/api/playlists/add/' + playlist.value, {
                    credentials: 'include',
                    method: "post",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        songID: this.state.clickedSongID
                    })
                }).then(async (res) => {
    
                    if (res.status !== 200) {
                        
                        const body = await res.json();
                        throw Error(body.message);;

                    } else return res.json();
                })
        
                // after fetch...
                .then(playlistData => {
                    alert(`Added song to ${playlistData.updatedPlaylist.name}`);
                    // window.location = "/songs";
                })
                .catch(err => {
                    alert(err.message);
                    // this.displayErrMsg(err.message);
                });   
            // if we're on the last iteration and no playlists are checked...
            } else if (i === playlists.length - 1) {
                // this.handleX();
            }
        });          
    }

    createSongTableData(tr, song, songElement) {

        const td = document.createElement('td');
        td.textContent = song[songElement];
        if (songElement === 'title') {
            td.className = 'song-name';
        }
        tr.appendChild(td);
    }

    createPlaylistTableData(tr, playlist) {

        const td = document.createElement('td');
        td.textContent = playlist.name;
        td.className = 'playlist-name';

        const selectTD = document.createElement('td');
        const checkbox = document.createElement("input");
        checkbox.type = "radio";
        checkbox.name = "playlists";
        checkbox.value = playlist._id;
        selectTD.appendChild(checkbox);

        tr.appendChild(td);
        tr.appendChild(selectTD);
    }

    
    createPlaylistTable(playlists) {
        
        const tbody = document.querySelector(".playlists-popup tbody");
        tbody.innerHTML = '';
        
        for (let i = 0; i < playlists.length; i++) {

            const tr = document.createElement('tr');
            this.createPlaylistTableData(tr, playlists[i]);

            tbody.appendChild(tr);
        }
    }
 
    
    // function for creating a song table
    createSongTable(songs) {
        const tbody = document.querySelector(".songs tbody");
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
            const optionsBtn = this.createOptionsButton(tr, songs[i]);
            optionsBtn.addEventListener('click', e => this.handleOptionsBtn(songs[i]));

            tbody.appendChild(tr);
        }
    }

    componentDidUpdate(prevProps) {
        // render song table when song data is fetch in parent
        //console.log('prevProps: ', prevProps, 'currentProps: ', this.props);
        if (prevProps.songs !== this.props.songs) {
            this.createSongTable(this.props.songs);
        }

        if(prevProps.playlists !== this.props.playlists) {
            this.createPlaylistTable(this.props.playlists);
        }
    }
    
    render () {
        return (
            <div>
                <form id="addToPlaylistForm" encType="multipart/form-data" onSubmit={this.handleSubmit}>
                <div className="playlists-popup-div hidden">
                    <div className="x-and-submit-wrapper">
                    <div id="x-out">
                        <button onClick={e => {
                            e.preventDefault();
                            this.handleX();
                        }}><img alt="X" src={require("../cross.png")} /></button>
                    </div>
                    <div id="td-submit">
                        <button type="submit" form="addToPlaylistForm" id="playlists-submit">Add</button>
                    </div>
                    </div>
                    <table className="playlists-popup">
                        <thead id="playlists-table-header" className="hidden">
                            <tr>
                                <td colSpan="2">SELECT A PLAYLIST</td>
                            </tr>
                        </thead>
                        <tbody className="hidden">
                        </tbody>
                    </table>
                    <div className="error-msg hidden">
                    </div>
                </div>
                </form>

                <table className="songs">
                    <thead id="song-table-header">
                        <tr>
                            <td>TITLE</td>
                            <td>ARTIST</td>
                            <td>ALBUM</td>
                            <td>PLAY</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
            
    );

    }
}

export { BrowseSongs, SongTable };