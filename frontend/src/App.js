import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userDisplay, setUserDisplay] = useState('');
  
  // Registration Profile States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Editing state trackers
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

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
    const payload = isLogin 
      ? { username, password } 
      : { username, password, email, name, age };
    
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
          setName('');
          setEmail('');
          setAge('');
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

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}tasks/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) fetchTasks();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const saveEdit = async (id) => {
    try {
      const response = await fetch(`${API_BASE}tasks/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDescription })
      });
      if (response.ok) {
        setEditingTaskId(null);
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating task fields:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_BASE}tasks/${id}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const getStatusStyle = (status) => {
    if (status === 'In Progress') return { background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' };
    if (status === 'Completed') return { background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' };
    return { background: 'rgba(99, 102, 241, 0.2)', color: '#6366f1' };
  };

  const totalTasks = tasks.length;
  const todoTasks = tasks.filter(t => t.status === 'To Do').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const doneTasks = tasks.filter(t => t.status === 'Completed').length;

  if (!isLoggedIn) {
    return (
      <div className="auth-container">
        <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="auth-subtitle">{isLogin ? 'Log in to manage your TaskSphere assets' : 'Sign up to get started'}</p>
        
        <form onSubmit={handleAuthSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="form-input" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-input" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="number" className="form-input" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Username</label>
            <input type="text" className="form-input" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="auth-btn">{isLogin ? 'Sign In' : 'Register'}</button>
        </form>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span className="auth-toggle-link" onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Sign Up' : 'Sign In'}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>TaskSphere Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>User: {userDisplay}</span>
          <button 
            style={{ background: '#334155', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }} 
            onClick={() => setIsLoggedIn(false)}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: '600' }}>TOTAL TASKS</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#fff' }}>{totalTasks}</div>
        </div>
        <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: '#6366f1', marginBottom: '0.25rem', fontWeight: '600' }}>TO DO</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#6366f1' }}>{todoTasks}</div>
        </div>
        <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: '#f59e0b', marginBottom: '0.25rem', fontWeight: '600' }}>IN PROGRESS</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#f59e0b' }}>{inProgressTasks}</div>
        </div>
        <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: '#10b981', marginBottom: '0.25rem', fontWeight: '600' }}>DONE</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#10b981' }}>{doneTasks}</div>
        </div>
      </div>
      
      <form onSubmit={createTask} style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--border)' }}>
        <h3>Create New Task</h3>
        <div className="form-group"><input type="text" className="form-input" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
        <div className="form-group"><input type="text" className="form-input" placeholder="Task Description" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <button type="submit" style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' }}>Add Task</button>
      </form>

      <h2>Current Tasks:</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tasks.map(task => (
          <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            
            {editingTaskId === task.id ? (
              <div style={{ flex: 1, paddingRight: '1rem' }}>
                <input type="text" className="form-input" style={{ marginBottom: '0.5rem' }} value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                <input type="text" className="form-input" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }} onClick={() => saveEdit(task.id)}>Save</button>
                  <button style={{ background: '#475569', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }} onClick={() => setEditingTaskId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, paddingRight: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '1.15rem', textDecoration: task.status === 'Completed' ? 'line-through' : 'none', opacity: task.status === 'Completed' ? 0.6 : 1 }}>
                    {task.title}
                  </strong>
                  <span style={{ ...getStatusStyle(task.status), padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', display: 'inline-block' }}>
                    {task.status}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: 0, textDecoration: task.status === 'Completed' ? 'line-through' : 'none', opacity: task.status === 'Completed' ? 0.5 : 1 }}>
                  {task.description}
                </p>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {editingTaskId !== task.id && (
                <>
                  {task.status === 'To Do' && (
                    <>
                      <button style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }} onClick={() => updateStatus(task.id, 'In Progress')}>Start</button>
                      <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }} onClick={() => updateStatus(task.id, 'Completed')}>Complete</button>
                    </>
                  )}

                  {task.status === 'In Progress' && (
                    <>
                      <button style={{ background: '#6366f1', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }} onClick={() => updateStatus(task.id, 'To Do')}>To Do</button>
                      <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }} onClick={() => updateStatus(task.id, 'Completed')}>Complete</button>
                    </>
                  )}

                  {task.status === 'Completed' && (
                    <>
                      <button style={{ background: '#6366f1', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }} onClick={() => updateStatus(task.id, 'To Do')}>To Do</button>
                      <button style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }} onClick={() => updateStatus(task.id, 'In Progress')}>In Progress</button>
                    </>
                  )}

                  <button 
                    style={{ background: '#334155', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }} 
                    onClick={() => startEditing(task)}
                  >
                    Edit
                  </button>
                </>
              )}
              <button 
                style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }} 
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default App;