import React, { useEffect, useState } from 'react';
import api from '../api';

const CreateTask = ({ onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await api.get('/users');
        setEmployees(response.data.filter((user) => user.role === 'employee'));
      } catch (err) {
        setMessage('Unable to load employee list');
      }
    };
    loadEmployees();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/tasks', { title, description, deadline, assignedTo });
      setTitle('');
      setDescription('');
      setDeadline('');
      setAssignedTo('');
      setMessage('Task created successfully');
      onCreated();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to create task');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea className="form-control" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Deadline</label>
        <input type="date" className="form-control" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Assign To</label>
        <select className="form-select" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
          <option value="">Select employee</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>{employee.name}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary w-100">Create Task</button>
    </form>
  );
};

export default CreateTask;
