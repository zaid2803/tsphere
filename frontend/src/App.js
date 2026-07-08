import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userDisplay, setUserDisplay] = useState('');
  
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const API_BASE = 'http://localhost:8000/api/';

  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks();
    }
  }, [isLoggedIn]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE}tasks/`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login/' : 'register/';
    
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          setIsLoggedIn(true);
          setUserDisplay(data.username || username);
          setPassword('');
        } else {
          alert("Registration successful! Please login.");
          setIsLogin(true);
          setPassword('');
        }
      } else {
        alert(data.error || JSON.stringify(data));
      }
    } catch (error) {
      console.error("Auth Error:", error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await fetch(`${API_BASE}tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, status: 'To Do' })
      });

      if (response.ok) {
        setTitle('');
        setDescription('');
        fetchTasks();
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // 🗑️ NEW DELETE FUNCTION
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_BASE}tasks/${id}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        fetchTasks(); // 🔄 Re-fetch remaining tasks instantly!
      } else {
        console.error("Backend refused to delete task.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="auth-container">
        <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Log in to manage your TaskSphere assets' : 'Sign up to get started'}
        </p>
        
        <form onSubmit={handleAuthSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Enter your username"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-input"
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="auth-btn">
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span className="auth-toggle-link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>TaskSphere Dashboard</h1>
        <div>
          <span style={{ color: 'var(--text-muted)', marginRight: '1rem' }}>User: {userDisplay}</span>
          <button className="auth-btn" style={{ width: 'auto', padding: '0.5rem 1rem', display: 'inline-block' }} onClick={() => setIsLoggedIn(false)}>
            Logout
          </button>
        </div>
      </div>
      
      <form onSubmit={createTask} style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--border)' }}>
        <h3>Create New Task</h3>
        <div className="form-group">
          <input 
            type="text" 
            className="form-input" 
            placeholder="Task Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <input 
            type="text" 
            className="form-input" 
            placeholder="Task Description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>
        <button type="submit" className="auth-btn" style={{ width: 'auto', padding: '0.75rem 2rem' }}>Add Task</button>
      </form>

      <h2>Current Tasks:</h2>
      <div>
        {tasks.map(task => (
          <div key={task.id} className="task-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, paddingRight: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '1.15rem' }}>{task.title}</strong>
                <span style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
                  {task.status}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>{task.description}</p>
            </div>
            
            {/* 🗑️ UPDATED STYLED DELETE BUTTON */}
            <button 
              onClick={() => deleteTask(task.id)}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#dc2626'}
              onMouseLeave={(e) => e.target.style.background = '#ef4444'}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;