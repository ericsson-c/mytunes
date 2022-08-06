/* ------------------------- HOMEPAGE.JS -------------------------------

- First page that appears when user logs onto site
- Prompts for login or register

--------------------------------------------------------------------
*/

import { useCookies } from 'react-cookie';
import '../stylesheets/Homepage.css';

const apiURL = process.env.REACT_APP_CLIENT_URL;


export default function Homepage() {

  const [cookies, setCookies] = useCookies();

  if (cookies.user) {

    return (
      <div className="homepage">

      <div className='welcome-prompt'>
        <p className='welcome-prompt-id'>
          Welcome to MyTunes, {cookies.user.username}.
        </p>
        <p className='main-slogan'>
          All the music you need, at your fingertips.
        </p>
        <p className='login-prompt'>
          Click <a href="/songs"> Browse </a> to start listening.
        </p>
      </div>
      </div>
    );
  
  } else {
    return (
      <div className="homepage">
      <div className='welcome-prompt'>
        <p className='welcome-prompt-id'>
          Welcome to MyTunes.
        </p>
        <p className='main-slogan'>
          All the music you need, at your fingertips.
        </p>
        <p className='login-prompt'>
          <a href="/login"> Login </a>or <a href="/register"> register </a> to start listening.
        </p>
      </div>
      </div>
    );
  }
}