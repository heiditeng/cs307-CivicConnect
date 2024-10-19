import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import './AuthPage.css';

const AuthPage = ({ isOrganization }) => {
  const [isLogin, setIsLogin] = useState(true); // manage view: true for Login, false for Signup

  const switchToSignup = () => {
    console.log('Switching to Signup');
    setIsLogin(false); // show Signup
  };

  const switchToLogin = () => {
    setIsLogin(true); // show Login
  };

  return (
    <div className="auth-page">
      {isLogin ? (
        <Login onSwitchToSignup={switchToSignup} isOrganization={isOrganization} />
      ) : (
        <Signup onSwitchToLogin={switchToLogin} isOrganization={isOrganization} />
      )}
    </div>
  );
};

export default AuthPage;