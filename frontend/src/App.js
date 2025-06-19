import { useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

function App() {
  const [page, setPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    !!localStorage.getItem('access')
  );

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsLoggedIn(false);
    setPage('home');
  };

  return (
    <div>
      <nav>
        <button onClick={() => setPage('home')}>Home</button>
        {!isLoggedIn ? (
          <>
            <button onClick={() => setPage('login')}>Login</button>
            <button onClick={() => setPage('register')}>Register</button>
          </>
        ) : (
          <>
            <button onClick={() => setPage('profile')}>Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>

      {/* Affichage des pages */}
      {page === 'home' && <Home isLoggedIn={isLoggedIn} />}
      {page === 'login' && (
        <Login
          onLogin={() => {
            setIsLoggedIn(true);
            setPage('home');
          }}
        />
      )}
      {page === 'register' && <Register />}
      {page === 'profile' && <Profile />}
    </div>
  );
}

export default App;
