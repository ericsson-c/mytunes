/* ------------------------- LOGOUT.JS -------------------------------

- Nothing visual on this page
- Essentially justs removes 'user' cookie
- Immediately redirects to homepage

--------------------------------------------------------------------
*/

import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'

//const apiURL = 'http://mytunes-api.herokuapp.com';
const apiURL = 'http://localhost:3000';

export default function Logout() {

    const [cookies, setCookies, removeCookies] = useCookies('user');
    const navigate = useNavigate();

    fetch('/api/logout', { credentials: 'include' })

    .then(res => res.json())
    .then(data => {

        removeCookies('user', { path: '/' });
        navigate('/');

    });
}