import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import ListErrors from '../../components/ListErrors';
import {
  logout,
  selectErrors,
  selectIsAuthenticated,
  selectIsLoading,
  selectUser,
  updateUser,
} from './authSlice';


function SettingsForm({ currentUser, onSaveSettings }) {
  const [image, setImage] = useState(
    currentUser?.image ??
      'https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png'
  );
  const [username, setUsername] = useState(currentUser?.username ?? '');
  const [bio, setBio] = useState(currentUser?.bio ?? '');
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [password, setPassword] = useState('');
  const isLoading = useSelector(selectIsLoading);


  const changeImage = (event) => {
    setImage(event.target.value);
  };

  const changeUsername = (event) => {
    setUsername(event.target.value);
  };

  const changeBio = (event) => {
    setBio(event.target.value);
  };

  const changeEmail = (event) => {
    setEmail(event.target.value);
  };


  const changePassword = (event) => {
    setPassword(event.target.value);
  };

 
  const saveSettings = (event) => {
    event.preventDefault();

    const user = {
      image,
      username,
      bio,
      email,
    };

    if (password) {
      user.password = password;
    }

    onSaveSettings(user);
  };

  return (
    <form onSubmit={saveSettings}>
      <fieldset disabled={isLoading}>
        <fieldset className="form-group">
          <input
            className="form-control"
            type="text"
            placeholder="URL of profile picture"
            name="image"
            value={image}
            onChange={changeImage}
          />
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={changeUsername}
          />
        </fieldset>

        <fieldset className="form-group">
          <textarea
            className="form-control form-control-lg"
            rows={8}
            placeholder="Short bio about you"
            name="bio"
            value={bio}
            onChange={changeBio}
          />
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            autoComplete="current-email"
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={changeEmail}
          />
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="password"
            autoComplete="current-password"
            placeholder="New Password"
            name="password"
            value={password}
            onChange={changePassword}
          />
        </fieldset>

        <button className="btn btn-lg btn-primary pull-xs-right" type="submit">
          Update Settings
        </button>
      </fieldset>
    </form>
  );
}

function SettingsScreen() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  const errors = useSelector(selectErrors);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const saveSettings = (user) => {
    void dispatch(updateUser(user));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            <ListErrors errors={errors} />

            <SettingsForm
              currentUser={currentUser}
              onSaveSettings={saveSettings}
            />

            <hr />

            <button className="btn btn-outline-danger" onClick={logoutUser}>
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(SettingsScreen);
