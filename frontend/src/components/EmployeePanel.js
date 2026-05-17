import React, { useState } from 'react';
import api from '../api';

const EmployeePanel = ({ employees, onEmployeeCreated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/users', { name, email, password, role: 'employee' });
      setName('');
      setEmail('');
      setPassword('');
      setMessage('Employee account created successfully');
      onEmployeeCreated();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to create employee');
    }
  };

  return (
    <div className="dashboard-card card-custom p-4 employee-panel">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5>Employee Management</h5>
          <p className="text-muted mb-0">Add and review employees instantly.</p>
        </div>
        <div className="text-end">
          <div className="fw-bold">{employees.length}</div>
          <div className="small text-muted">Active employees</div>
        </div>
      </div>

      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary w-100 mb-4">Create Employee</button>
      </form>

      <div>
        <h6 className="mb-3">Active Employees</h6>
        <div className="list-group list-group-flush">
          {employees.length > 0 ? (
            employees.map((employee) => (
              <div key={employee._id} className="list-group-item border-0 px-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{employee.name}</strong>
                    <div className="small text-muted">{employee.email}</div>
                  </div>
                  <span className="badge bg-secondary bg-opacity-10 text-secondary">Employee</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted">No employees found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeePanel;
