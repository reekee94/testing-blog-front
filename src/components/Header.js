import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectIsAuthenticated, selectUser } from '../features/auth/authSlice';


function LoggedOutNavbar() {
  return (
    <ul className="nav navbar-nav pull-xs-right">
      <li className="nav-item">
        <Link to="/" className="nav-link">
          Home
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/login" className="nav-link">
          Sign in
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/register" className="nav-link">
          Sign up
        </Link>
      </li>
    </ul>
  );
}

function LoggedInNavbar() {
  const currentUser = useSelector(selectUser);

  return (
    <ul className="nav navbar-nav pull-xs-right">
      <li className="nav-item">
        <Link to="/" className="nav-link">
          Home
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/editor" className="nav-link">
          <i className="ion-compose" />
          &nbsp;New Post
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/settings" className="nav-link">
          <i className="ion-gear-a" />
          &nbsp;Settings
        </Link>
      </li>

      <li className="nav-item">
        <Link to={`/@${currentUser?.username}`} className="nav-link">
          <img
            src={
              currentUser?.image ||
              'https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png'
            }
            className="user-pic"
            alt={currentUser?.username}
          />
          {currentUser?.username}
        </Link>
      </li>
    </ul>
  );
}

function Header() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const appName = useSelector((state) => state.common.appName);

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link to="/" className="navbar-brand">
          {appName.toLowerCase()}
        </Link>

        {isAuthenticated ? <LoggedInNavbar /> : <LoggedOutNavbar />}
      </div>
    </nav>
  );
}

export default memo(Header);
