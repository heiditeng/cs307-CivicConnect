import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // navigation between pages
import NavBar from './components/NavBar';
import AuthPage from './components/AuthPage';
import ResetPassword from './components/ResetPassword';
import UserInformationForm from './components/UserInformationForm';
import UserProfile from './components/UserProfile';
import Login from './components/Login';

function App() {

  const title = "Welcome to CivicConnect!";
  // const users = 0;
  return (
    <Router>
    <div className='App'>
      <NavBar />
      <div className='content'>
        <h1 style={{ textAlign: 'center', marginBottom: '20px'}}>{title}</h1>
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ResetPassword />} />
            <Route path="/info-form" element={<UserInformationForm />} />
            <Route path="/profile" element={<UserProfile/>} />
            <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
    </Router>
  );
}

export default App