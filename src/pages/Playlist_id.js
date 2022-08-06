import React from 'react';
import Cookie from 'universal-cookie';
import { SongTable } from './Songs';
import '../stylesheets/Playlists.css';
import { Link, Navigate } from 'react-router-dom';

import {
    useLocation,
    useNavigate,
    useParams,
  } from "react-router-dom";

  
// wrapper function provided by reactrouter.com to allow access to url parameters in class components.
function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return (
        <Component
            {...props}
            router={{ location, navigate, params }}
        />
        );
    }

    return ComponentWithRouterProp;
}



const apiURL = process.env.REACT_APP_CLIENT_URL;

class PlaylistID extends React.Component {
    
    cookie = new Cookie();
    
    constructor(props) {
        super(props);
        this.state = {
            name: "No Playlist selected",
            id: null,
            userPlaylists: [],
            songs: null,
            displayedSongs: null,
            differentPlaylist: null,
            errorMessage: null
        }
        
        this.generatePlaylistButtons = this.generatePlaylistButtons.bind(this);
        this.fetchSongs = this.fetchSongs.bind(this);
        this.setState = this.setState.bind(this);
        this.search = this.search.bind(this);
        this.changePlaylist = this.changePlaylist.bind(this);
        this.handleDropBtn = this.handleDropBtn.bind(this);
        this.handleDeleteBtn = this.handleDeleteBtn.bind(this);
        this.handleEditBtn = this.handleEditBtn.bind(this);
    }

    // dynamically adjust search results as user types in search bar
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


    
    changePlaylist(evt) {
        
        const newPlaylist = this.state.userPlaylists[evt.target.value];
        this.setState({ differentPlaylist: newPlaylist._id });
    }


    handleDeleteBtn(evt) {

        evt.preventDefault();
        
        if (!window.confirm("Are you sure you want to delete this playlist?")) {
            return;
        }

        fetch(apiURL + "/api/playlists/delete/" + this.state.id, { credentials: 'include' })
        .then(res => {
            if (res.status !== 200) {
                this.setState({ 
                    errorMessage: `An error occurred trying to delete ${this.state.name}.
                    Please make sure you are logged in and try again.`
                });
                console.log(res.json().message);
            } else {
                return res.json();
            }
        }).then(data => {
            console.log("Successfully deleted " + data.playlist.name);
            window.location = '/playlists';
        })
        .catch(err => console.log(err.message));
    }


    handleEditBtn(evt) {
        evt.preventDefault();
        window.location = '/edit/' + this.state.id;
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

    handleDropBtn(evt) {

        const dropdown = document.querySelector('.dropdown-content');
        dropdown.classList.toggle("hidden");
    }
    
    fetchSongs() {

        const { id } = this.props.router.params;

        fetch(apiURL + '/api/playlists/' + id)

        .then(res => res.json())
        .then(songData => {
            
            this.setState({

                name: songData.name,
                id: id,
                songs: songData.songs,
                displayedSongs: songData.songs
            });

            console.log(songData);
        })

        .catch(err => console.log(err));
    }
    
    // on page load, fetch playlist data for user and associated song data for the first fetched playlist
    componentDidMount() {

        console.log('playlistID user cookie: ', this.cookie.get('user'));

        // ---- FETCH PLAYLIST DATA ---- \\
        
        fetch(apiURL + '/api/playlists', { credentials: 'include' })
        .then(res => res.json())
        .then(playlists => {

            // if there was an error fetching, log the err msg then refresh page to prompt a login
            if (playlists.message) {
                console.log(playlists.message);
            }

            this.setState({
                userPlaylists: playlists.playlists,
            }, );

            // ---- POPULATE HTML WITH PLAYLIST OPTIONS FOR USER (NOT INCLUDING CURRENT PLAYLIST) --- \\
            const otherPlaylists = playlists.playlists.filter(pl => {
                console.log(pl._id, this.props.router.params.id)
                return pl._id.toString() !== this.props.router.params.id;
            });
            
            this.generatePlaylistButtons(otherPlaylists);
            //return playlists[0];

        })  // ---- FETCH SONG DATA FOR CURRENT PLAYLIST --- \\

        .then(() => this.fetchSongs())
        .catch(err => console.log(err));
    }
    
    render() {

        if (!(this.cookie.get('user'))) {
            window.location = '/login';
            // return <Navigate to='/login' />
        }

        else if (this.state.differentPlaylist !== null) {
            const url = '/playlists/' + this.state.differentPlaylist;
            // use window.location to lose app state
            // (keeping this.state.differentPlaylist !== null forces an infinite loop)
            window.location = url;
        }

        return (
            <div className='container'>
                <div id="display-playlists">
                    <div className="dropdown">
                        <span className="all-songs">
                            <h1>{this.state.name}</h1>
                            <button className="drop-btn" onClick={this.handleDropBtn}>
                                <h1 className="caret">&#9660;</h1>
                            </button>
                            <div className='dropdown-content hidden'>
                            </div>
                            <button className="plus-btn"><Link to='/create'>+</Link></button>
                            <span className="create-playlist-wrapper">
                                <div className="create-playlist">Create Playlist</div>
                            </span>
                            <button className="delete-btn" onClick={this.handleDeleteBtn}><p>-</p></button>
                            <span className="delete-playlist-wrapper">
                                <div className="create-playlist">Delete Playlist</div>
                            </span>
                            <button className="edit-btn" onClick={this.handleEditBtn}><p>&#9881;</p></button>
                            <span className="edit-playlist-wrapper">
                                <div className="create-playlist">Edit Playlist</div>
                            </span>
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


export default withRouter(PlaylistID);
export { withRouter };