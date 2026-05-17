import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TaskChart = ({ analytics }) => {
  const labels = ['Pending', 'In Progress', 'Completed', 'Overdue'];
  const data = {
    labels,
    datasets: [
      {
        label: 'Tasks',
        data: [
          analytics.totals.pending || 0,
          analytics.totals['in-progress'] || 0,
          analytics.totals.completed || 0,
          analytics.overdue || 0,
        ],
        backgroundColor: ['#0d6efd', '#ffc107', '#198754', '#dc3545'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Task Status Breakdown',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default TaskChart;
