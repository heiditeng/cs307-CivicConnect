import './App.css';
import NavBar from './components/NavBar';
import AuthPage from './components/AuthPage';

function App() {

  const title = "Welcome to CivicConnect!";
  // const users = 0;
  return (
    <div className='App'>
      <NavBar />
      <div className='content'>
        <h1 style={{ textAlign: 'center', marginBottom: '20px'}}>{title}</h1>
        <AuthPage />
      </div>
    </div>
  );
}

export default App