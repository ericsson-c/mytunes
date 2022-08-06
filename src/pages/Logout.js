/* ------------------------- LOGOUT.JS -------------------------------

- Nothing visual on this page
- Essentially justs removes 'user' cookie
- Immediately redirects to homepage

--------------------------------------------------------------------
*/

import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'

const apiURL = process.env.REACT_APP_CLIENT_URL;

export default function Logout() {

    const [cookies, setCookies, removeCookies] = useCookies('user');
    const navigate = useNavigate();

    fetch(apiURL + '/api/logout', { credentials: 'include' })

    .then(res => res.json())
    .then(data => {

        removeCookies('user', { path: '/' });
        // navigate('/');
        window.location = '/';

    });
}