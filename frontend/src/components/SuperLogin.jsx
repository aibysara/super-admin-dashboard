import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SuperLogin.css';

function SuperAdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { username, password };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', json.access);
        localStorage.setItem('refresh_token', json.refresh);

        setMessage('Login successful! Redirecting...');
        navigate('/admin-dashboard');
      } else {
        setMessage(`Login failed: ${json.detail || JSON.stringify(json)}`);
      }
    } catch (error) {
      setMessage('An error occurred. Try again later.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Super Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="input"
          />
        </div>

        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="input"
          />
        </div>

        <button type="submit" className="button superadmin-btn">Login</button>
      </form>

      {message && <p className="paragraph">{message}</p>}
    </div>
  );
}

export default SuperAdminLogin;
