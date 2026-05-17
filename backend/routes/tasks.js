const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { assignedTo: req.user._id };
    const tasks = await Task.find(filter).populate('assignedTo', 'name email role');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch tasks', error: error.message });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { assignedTo: req.user._id };
    const tasks = await Task.find(filter);
    const totals = {
      pending: 0,
      'in-progress': 0,
      completed: 0,
      overdue: 0,
    };
    tasks.forEach((task) => {
      totals[task.status] += 1;
    });
    const overdue = tasks.filter((task) => task.status === 'overdue').length;
    res.json({ totals, overdue, totalTasks: tasks.length });
  } catch (error) {
    res.status(500).json({ message: 'Analytics error', error: error.message });
  }
});

router.post('/', async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can create tasks' });
  }

  try {
    const { title, description, deadline, assignedTo } = req.body;
    const assignee = await User.findById(assignedTo);
    if (!assignee) {
      return res.status(400).json({ message: 'Assigned user not found' });
    }
    const task = await Task.create({
      title,
      description,
      deadline,
      assignedTo,
      createdBy: req.user._id,
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('taskCreated', { taskId: task._id, assignedTo, createdBy: req.user._id, status: task.status });
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Task creation failed', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'admin' && !task.assignedTo.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const updates = {};
    if (req.body.status) updates.status = req.body.status;
    if (req.body.title) updates.title = req.body.title;
    if (req.body.description) updates.description = req.body.description;
    if (req.body.deadline) updates.deadline = req.body.deadline;
    if (req.body.assignedTo && req.user.role === 'admin') updates.assignedTo = req.body.assignedTo;

    const updated = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });

    const io = req.app.get('io');
    if (io) {
      io.emit('taskUpdated', { taskId: updated._id, status: updated.status, assignedTo: updated.assignedTo, updatedBy: req.user._id });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
});

module.exports = router;
