const factionLogos = {
    "Anomalies": "images/factions/Anomalies.png",
    "Foundation": "images/factions/Foundation.png",
    "Counter": "images/factions/Counter.png",
    "GOC": "images/factions/GOC.png"
  };
  
  // Render function for the round log list
  function renderLogList(logs) {
    const logListContainer = document.getElementById("log-list");
  
    logs.forEach(log => {
      // Get round data
      const winner = log.winner;
      const winner2 = log.winner2;
      const points = log.points;
      const points2 = log.points2;
      const scps = log.scps;
      const spawnwaves = log.spawnwaves;
      
      const pointDifference = Math.abs(points - points2);
  
      const listItem = document.createElement("li");
      listItem.classList.add("log-item");
      
      listItem.innerHTML = `
        <div class="log-item-header">
          <img src="${factionLogos[winner]}" alt="${winner} Logo">
          <h3>${winner} (${points} points)</h3>
          <span>vs</span>
          <h3>${winner2} (${points2} points)</h3>
          <img src="${factionLogos[winner2]}" alt="${winner2} Logo">
        </div>
        <div class="log-item-details">
          <p><strong>Point Difference:</strong> ${pointDifference}</p>
          <p><strong>SCPs Spawned:</strong> ${scps.join(", ")}</p>
          <p><strong>Spawnwaves:</strong> ${spawnwaves.join(", ")}</p>
        </div>
        <div class="log-item-footer">
          <span>Round log details</span>
        </div>
      `;
      
      // Append the item to the list
      logListContainer.appendChild(listItem);
    });
  }

function renderSCPChart(logs) {
    const scpStats = {};
  
    logs.forEach(log => {
      const winner = log.winner;
      const winner2 = log.winner2;
      const points = log.points ?? 0;
      const points2 = log.points2 ?? 0;
      const scps = log.scps || [];
  
      const anomaliesWon = winner === "Anomalies" && points > points2;
  
      scps.forEach(scp => {
        if (!scpStats[scp]) {
          scpStats[scp] = { wins: 0, total: 0 };
        }
  
        scpStats[scp].total++;
        if (anomaliesWon) {
          scpStats[scp].wins++;
        }
      });
    });
  
    const labels = Object.keys(scpStats);
    const winRates = labels.map(scp => {
      const { wins, total } = scpStats[scp];
      return ((wins / total) * 100).toFixed(1);
    });
  
    const ctx = document.getElementById("scpChart").getContext("2d");
  
    new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "SCP Win Rate (%)",
          data: winRates,
          backgroundColor: ['#4caf50', '#f44336', '#2196f3', '#ff9800', '#b540d9', '#7fe4f1']
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }


fetch('logs.json')
  .then(res => res.json())
  .then(data => {
    const chartData = {};
    const logList = document.getElementById('log-list');

    data.forEach((entry, index) => {
      const { winner, points, players } = entry;

      // Count winners
      chartData[winner] = (chartData[winner] || 0) + 1;
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

    //Log List Render (each round data)

    renderLogList(data)

    //SCP Chart (winrates)
    renderSCPChart(data)
  });
