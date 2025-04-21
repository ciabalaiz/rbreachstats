const factionLogos = {
    "Anomalies": "images/factions/Anomalies.png",
    "Foundation": "images/factions/Foundation.png",
    "Counter": "images/factions/Counter.png",
    "GOC": "images/factions/GOC.png"
};

function nameFix(name) {
    name = name.toLowerCase()
    var current = "";

    if (name == "ntf" || name == "mtf" || name == "tacrep" || name == "foundation") {
        current = "Foundation";
    } else if (name == "sh" || name == "serpenthand" || name == "anomalies") {
        current = "Anomalies"
    } else  if (name == "ci" || name == "chaosinsurency" || name == "counter") {
        current = "Counter"
    } else {
        current = "Foundation"
    } 

    return current
}

function convertSpawnwaves(spawnwaves) {
    var newSpawnwave = [];

    spawnwaves.forEach(wave => {
        newSpawnwave.push(nameFix(wave))
    })

    return newSpawnwave
  }
  
function renderLogList(logs) {
    const logListContainer = document.getElementById("log-list");
    var i = 0

    logs.forEach(log => {
      const winner = nameFix(log.winner);
      var winner2 = nameFix(log.winner2);
      const points = log.points || 50;
      const points2 = log.points2 || 40;
      const scps = log.scps;
      const spawnwaves = convertSpawnwaves(log.spawnwaves);
      
      const pointDifference = Math.abs(points - points2);
  
      const listItem = document.createElement("li");
      listItem.classList.add("log-item");
    

      i = i + 1

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
          <span>"${"Round log "+i}"</span>
        </div>
      `;
      
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

function renderSpawnwaves(data) {
    const chartData = {};

    data.forEach((entry, index) => {
      var { spawnwaves } = entry;

      spawnwaves.forEach(wave => {
        wave = nameFix(wave)
        chartData[wave] = (chartData[wave] || 0) + 1;
      })     
    });
    
    const ctx = document.getElementById('spawnwaveChart').getContext('2d');
    
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
}

function renderFactionWinrate(data) {
    const chartData = {};

    data.forEach((entry, index) => {
      const { winner } = entry;
      chartData[winner] = (chartData[winner] || 0) + 1;
    });

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
}


fetch('logs.json')
  .then(res => res.json())
  .then(data => {
    renderSpawnwaves(data)
    renderFactionWinrate(data)
    renderLogList(data)
    renderSCPChart(data)
});
