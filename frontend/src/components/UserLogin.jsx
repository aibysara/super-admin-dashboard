import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserLogin.css';

function UserLogin() {
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
        // Fetch user info to verify role
        const userRes = await fetch('http://127.0.0.1:8000/api/accounts/me/', {
          headers: {
            'Authorization': `Bearer ${json.access}`,
          },
        });
        const userData = await userRes.json();

        if (userData.role === 'user') {
          localStorage.setItem('access_token', json.access);
          localStorage.setItem('refresh_token', json.refresh);
          setMessage('✅ Login successful! Redirecting...');
          setTimeout(() => navigate('/user-page'), 1000);
        } else {
          setMessage('🚫 You are NOT authorized as a normal user.');
        }
      } else {
        setMessage(`❌ Login failed: ${json.detail || JSON.stringify(json)}`);
      }
    } catch (error) {
      setMessage('⚠️ An error occurred. Try again later.');
      console.error(error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>User Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default UserLogin;
