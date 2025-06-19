// src/pages/Register.jsx
import { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/Users/register/', {
        email,
        username,
        password
      });
      alert('User registered!');
    } catch {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
      <br />
      <button type="submit">Register</button>
    </form>
  );
}
