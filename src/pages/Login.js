/* ------------------------- LOGIN.JS -------------------------------

- Login form
- After successful login, redirects to /songs

--------------------------------------------------------------------
*/

import logo from '../logo.png';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import '../stylesheets/Register.css';

const apiURL = 'http://mytunes-api.herokuapp.com';
//const apiURL = 'http://localhost:3000';

export default function Login(props) {

    const [cookies, setCookies] = useCookies(['user']);
    const [errorMsg, setErrMsg] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    function loginUser(e) {

        e.preventDefault();

        fetch(apiURL + '/login', {

            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password
            }),

        }).then(res => res.json()).then(userData => {

            if (userData.loggedIn) {

                setCookies('user', userData.user);
                navigate('/songs');

            } else {

                setErrMsg(userData.message);
                console.log(userData.error);

            } console.log(userData);
        })
        .catch(err => console.log(err));
    }

    return (
        <div className="register">
            <div className = "register-form">
                <span className="span">
                    <img src={logo} alt="logo"/>
                    <p> MyTunes </p>
                </span>
            
                <form method="POST">
                    <div className="register-form-div">
                        <input placeholder="Username" type='text' name='username' onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className="register-form-div">
                        <input placeholder="Password" type='text' name='password' onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className="register-form-div">
                        <button onClick={loginUser}>Login</button>
                    </div>
                    <div className="error-msg">{errorMsg}</div>
                    <div className="register-form-div">
                        <div className="other-page"> 
                            <div>Don't have an account?</div>
                            <Link to="/register">Register</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}