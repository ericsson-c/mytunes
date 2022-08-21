/* ------------------------- UPLOAD.JS -------------------------------

- Page where user can upload songs to the shared database
- Form that takes song title, artist, album and .mp3 file

--------------------------------------------------------------------
*/

import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import Cookie from 'universal-cookie';

import '../stylesheets/Upload.css';

const apiURL = process.env.REACT_APP_CLIENT_URL;

class Upload extends React.Component {

    cookie = new Cookie();

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            redirect: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }

    handleUpload(e) {
        
        try {
            if (e.target.files[0].type !== 'audio/mpeg') {
                alert("File must have an .mp3 extension (must be an mp3 file).");
                e.target.type = '';
                e.target.type = 'file'
                return;
            } 
        } catch (e) {

        }
        
        this.setState({
            file: e.target.files[0]
        }, () => {
            // console.log(this.state.file.type === 'audio/mpeg');
        });
    }

    handleSubmit(e) {

        e.preventDefault();

        
        const formData = new FormData();

        formData.append('title', e.target.title.value);
        formData.append('artist', e.target.artist.value);
        formData.append('album', e.target.album.value);
        formData.append('audioFile', this.state.file);

        //setTimeout(() => console.log(formData), 1000);
        
        fetch(apiURL + '/api/upload', {
            method: 'post',
            body: formData

        }).then(res => res.json())

        .then(data => {

            console.log(data.message);

            if (data.song) { console.log(data.song); }

            this.setState({redirect: true});

        }).catch(err => console.log(err));

    }

    render() {

        if (this.state.redirect) {
            window.location = '/songs';
        } else if (!(this.cookie.get('user'))) {
            window.location = '/login';
        }

        return (
            <div className="container">
                <div className="upload">
                    <span>
                        <h2>Upload a Song</h2>
                        <button><Link to='/songs'>Back to Songs</Link></button>
                    </span>
                    <div className="upload-form">
                        <form action="/upload" method="POST" encType="multipart/form-data" onSubmit={this.handleSubmit}>
                        <p>Fill in song details below</p>
                            <input placeholder="Title..." type="text" name="title"/>
                            <input placeholder="Artist" type="text" name="artist"/>
                            <input placeholder ="Album..." type="text" name="album"/>
                            <input type="file" onChange={this.handleUpload} name="audioFile" />
                            <button type="submit">UPLOAD</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Upload;