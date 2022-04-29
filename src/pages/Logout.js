/* ------------------------- LOGOUT.JS -------------------------------

- Nothing visual on this page
- Essentially justs removes 'user' cookie
- Immediately redirects to homepage

--------------------------------------------------------------------
*/

import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'

//const apiURL = 'https://mytunes-api.herokuapp.com';
//const apiURL = 'http://localhost:3000';
const apiURL = 'https://mytunes-frontend.herokuapp.com';

export default function Logout() {

    const [cookies, setCookies, removeCookies] = useCookies('user');
    const navigate = useNavigate();

    fetch(apiURL + '/api/logout', { credentials: 'include' })

    .then(res => res.json())
    .then(data => {

        removeCookies('user', { path: '/' });
        navigate('/');

    });
}