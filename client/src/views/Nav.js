
import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * @function Nav
 * @memberof Nav.js
 * @returns {void}
 * Nav holds routes to login and register components
 */
function Nav() {
  return (
    <ul className = 'nav'>
     <li>
       <NavLink exact activeClassName='active' to='/login'>
         Login
       </NavLink>
     </li>

      <li>
        <NavLink activeClassName='active' to='/register'>
          Register
        </NavLink>
      </li>
    </ul>);
}
module.exports = Nav;
