/* ------------------------- HOMEPAGE.JS -------------------------------

- First page that appears when user logs onto site
- Prompts for login or register

--------------------------------------------------------------------
*/

import { useCookies } from 'react-cookie';
import '../stylesheets/Homepage.css';

export default function Homepage() {

  return (
    <div className="homepage">
      <p id='welcome-prompt'>
        Welcome to MyTunes
      </p>

      <div className="homepage-text">
        <p id='main-slogan'>
          All the music you need, at your fingertips.
        </p>
        <p id='login-prompt'>
          <a href="/login"> Login </a>or <a href="/register"> register </a> to begin.
        </p>
      </div>
    </div>
  );
}