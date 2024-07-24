import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { toyService } from '../services/toy.service.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export function ToyDashboard() {
  const [priceData, setPriceData] = useState({
    labels: ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered'],
    datasets: [
      {
        label: 'Prices per Category',
        data: [0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 0, 0, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(201, 203, 207, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  const [inventoryData, setInventoryData] = useState({
    labels: ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered'],
    datasets: [
      {
        label: 'Inventory by Category',
        data: [0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 0, 0, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(201, 203, 207, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    toyService.query().then(toys => {
      const categories = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered'];

      const categoryPrices = categories.map(category => {
        return toys.reduce((acc, toy) => {
          if (toy.labels.includes(category)) {
            return acc + toy.price;
          }
          return acc;
        }, 0);
      });

      const categoryInventory = categories.map(category => {
        const totalToysInCategory = toys.filter(toy => toy.labels.includes(category)).length;
        const inStockToysInCategory = toys.filter(toy => toy.labels.includes(category) && toy.inStock).length;
        return totalToysInCategory ? (inStockToysInCategory / totalToysInCategory) * 100 : 0;
      });

      setPriceData(prevData => ({
        ...prevData,
        datasets: [{
          ...prevData.datasets[0],
          data: categoryPrices,
        }]
      }));

      setInventoryData(prevData => ({
        ...prevData,
        datasets: [{
          ...prevData.datasets[0],
          data: categoryInventory,
        }]
      }));
    });
  }, []);

  return (
    <div className="toy-dashboard">
      <div className='chart-container'>
        <Pie data={priceData} />
      </div>
      <div className='chart-container'>
        <Pie data={inventoryData} />
      </div>
    </div>
  );
}
