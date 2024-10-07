import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // manage view: true for Login, false for Signup

  const switchToSignup = () => {
    setIsLogin(false); // show Signup
  };

  const switchToLogin = () => {
    setIsLogin(true); // show Login
  };

  return (
    <div className="auth-page">
      {isLogin ? (
        <Login onSwitchToSignup={switchToSignup} />
      ) : (
        <Signup onSwitchToLogin={switchToLogin} />
      )}
    </div>
  );
};

export default AuthPage;