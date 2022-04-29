/* ------------------------- REGISTER.JS -------------------------------

- Form to register new user
- After successful registration, redirect to /songs

--------------------------------------------------------------------
*/

import logo from '../logo.png';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import '../stylesheets/Register.css';

const apiURL = 'https://mytunes-api.herokuapp.com';

export default function Register() {

    const navigate = useNavigate();
    const [cookies, setCookies] = useCookies(['user']);
    const [errorMsg, setErrMsg] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function register() {

        fetch(apiURL + '/register', {

            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password
            })

        }).then(res => res.json()).then(userData => {

            if (userData.accountCreated) {

                setCookies('user', userData.user);
                navigate('/songs');

            } else {    

                setErrMsg(userData.message);
                console.log(userData.error);

            } console.log(userData.message);
        });
    }

    return (
        <div className="register">
            <div className = "register-form">
                <span className="span">
                    <img src={logo} alt="logo"/>
                    <p> MyTunes</p>
                </span>
                <div className="register-form-div">
                    <input placeholder="Username" type='text' name='username' onChange={(e) => {setUsername(e.target.value);
                    }}/>
                </div>
                <div className="register-form-div">
                    <input placeholder="Password" type='text' name='password' onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="register-form-div">
                    <button onClick={e => {
                        e.preventDefault();
                        register()
                    }}>Start listening</button>
                </div>
                <div className="error-msg">{errorMsg}</div>
                <div className="register-form-div">
                    <div className="other-page">
                        <div>Already have an account?</div>
                        <Link to="/login">Login</Link>
                    </div>
                </div>

            </div>
        </div>
    );
}