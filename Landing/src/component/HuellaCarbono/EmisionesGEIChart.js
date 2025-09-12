import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const EmisionesGEIChart = ({ data }) => {
  // data: { estacionaria, movil, fugitiva }
  const chartData = {
    labels: ['Estacionaria', 'Móvil', 'Fugitiva'],
    datasets: [
      {
        label: 'Toneladas de CO2 equivalentes',
        data: [data.estacionaria, data.movil, data.fugitiva],
        backgroundColor: ['#3b82f6', '#60a5fa', '#2563eb'],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Toneladas de CO2 equivalentes' },
      },
      x: {
        title: { display: false },
      },
    },
  };
  return <Bar data={chartData} options={options} />;
};

export default EmisionesGEIChart;
