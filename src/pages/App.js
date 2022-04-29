/* ------------------------- APP.JS -------------------------------

- Parent component rendered from the root in index.js
- Nested routes to all other pages 

--------------------------------------------------------------------
*/

import React from 'react';
import Homepage from './Homepage';
import Register from './Register';
import { BrowseSongs } from './Songs';
import Playlists from './Playlists';
import CreatePlaylist from './CreatePlaylist';
import Upload from './Upload';
import Login from './Login';
import Logout from './Logout';
import Header from './Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function App() {

    return (
      <div className="app">
      <Router>
      <Header />
        <Routes>
            <Route path="/" element={<Homepage />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/logout" element={<Logout />}/>
            <Route path="/playlists" element={<Playlists />}/>
            <Route path="/create" element={<CreatePlaylist />}/>
            <Route path="/songs" element={<BrowseSongs />}/>
            <Route path="/upload" element={<Upload />}/>
        </Routes>
      </Router>
      </div> 
    );
}