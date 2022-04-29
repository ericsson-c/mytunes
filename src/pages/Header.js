/* ------------------------- HEADER.JS -------------------------------

- Component that displays logo, "company" name and navigation bar above all pages

--------------------------------------------------------------------
*/

import React, { useEffect } from 'react';
import logo from '../logo.png';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import '../stylesheets/Header.css';

//const apiURL = 'http://mytunes-api.herokuapp.com';
const apiURL = 'http://localhost:3000';

export default function Header() { 

    const [cookies, setCookies, removeCookies] = useCookies('user');
    const handleClick = (e) => {
    }

    function LogoutButton() {
      if (cookies.user) {
        return (
            <div className="logout">
              <div><Link to="/logout">Logout</Link></div>
            </div>
        );
      } return null;
    }

    /*
    checks to make sure user is logged into the server (req.user is present)
    - this is NOT the ideal solution
    - ideally, use websocket to have server send client a message when user session expires
    - then, remove user cookie on browser/client
    - ** will add if I have time **
    */

    useEffect(() => {
      fetch('/getUser', { credentials: 'include' })
      .then(res => res.json())
      .then(userData => {
        // reset user cookie if passport session expired
        if (!(userData.user)) {
          console.log('removing user cookie...');
          removeCookies('user', { path: '/' });
        }
      }).catch(err => console.log(err));
    });
    

    return (
      <header className='header'>
        <nav>
        <Link style={{textDecoration: 'none'}} to='/'>
          <span>
          <img className='logo' src={logo} alt="logo"/>
          <h2> MyTunes</h2>
          </span>
        </Link>
        <ul className='nav-links'>
          <li className="login"> <Link onClick={handleClick}
          to={cookies.user ? '#' : '/login'}>
          {cookies.user ? `Hi, ${cookies.user}` : 'Login'}
          </Link> </li>
          <LogoutButton />
          <li> <Link to='/playlists'>Playlists</Link> </li>
          <li> <Link to='/songs'>Browse</Link> </li>
          <li> <Link to='/upload'>Upload</Link> </li>
        </ul>
        </nav>
      </header>
    );
  }