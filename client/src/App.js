import './App.css';
import NavBar from './components/NavBar';

function App() {

  const title = "Welcome to CivicConnect";
  const users = 0;
  return (
    <div className='App'>
      <NavBar />
      <div className='content'>
        <h1>{title}</h1>      
      </div>
    </div>
  );
}

export default App