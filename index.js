fetch('logs.json')
  .then(res => res.json())
  .then(data => {
    const chartData = {};
    const logList = document.getElementById('log-list');

    data.forEach((entry, index) => {
      const { winner, points, players } = entry;

      // Count winners
      chartData[winner] = (chartData[winner] || 0) + 1;

      // Display log entry
      const li = document.createElement('li');
      li.innerHTML = `Round ${index + 1} → <span class="winner">${winner}</span> won with ${points} points (${players} players)`;
      logList.appendChild(li);
    });

    // Pie chart
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(chartData),
        datasets: [{
          data: Object.values(chartData),
          backgroundColor: ['#4caf50', '#f44336', '#2196f3', '#ff9800']
        }]
      }
    });
  });
