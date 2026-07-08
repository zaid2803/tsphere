import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Grab the backend URL from environment variables
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/tasks/';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          title: title.trim(), 
          description: description.trim(), 
          status: 'To Do' 
        })
      });

      if (response.ok) {
        setTitle('');
        setDescription('');
        fetchTasks(); // 🔄 Re-fetch fresh data from the DB so it displays instantly!
      } else {
        const errorData = await response.json();
        console.error("API Rejected the Task:", errorData);
      }
    } catch (error) {
      console.error("Network connection error:", error);
    }
  };
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>TaskSphere Management App</h1>
      
      <form onSubmit={createTask} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Task Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Task Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
        <button type="submit">Add Task</button>
      </form>

      <h2>Current Tasks:</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.status} <br />
            {task.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;