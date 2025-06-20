import { useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Edit from './pages/Edit';
import Delete from './pages/Delete';
import ChangePass from './pages/ChangePass';
import List from './pages/List';


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
{isLoggedIn && (
  <>
    <button onClick={() => setPage('edit')}>Modifier</button>
    <button onClick={() => setPage('delete')}>Supprimer</button>
    <button onClick={() => setPage('change')}>Changer mot de passe</button>
    {localStorage.getItem('isAdmin') === 'true' && (
      <button onClick={() => setPage('list')}>Liste (admin)</button>
    )}
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
      {page === 'edit' && <Edit />}
      {page === 'delete' && <Delete />}
      {page === 'list' && <List />}
      {page === 'change' && <ChangePass />}

    </div>
  );
}

export default App;
