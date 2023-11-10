const { app, BrowserWindow, Menu, MenuItem, shell, ipcMain } = require('electron');
const { spawn } = require('child_process');

app.on('ready', () => {
  createWindow();
});

function createWindow() {
  const win = new BrowserWindow({
    width: 840,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
  });

  win.loadFile('index.html');

  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }
}

const popularSpotsMenu = new Menu();

const teleportToLocation = (latitude, longitude, altitude) => {
  const adbCommand = `adb shell am start-foreground-service -a theappninjas.gpsjoystick.TELEPORT --ef lat ${latitude} --ef lng ${longitude} --ef alt ${altitude}`;
  const childProcess = spawn('cmd', ['/c', adbCommand], { shell: true });

  childProcess.stdout.on('data', (data) => {
    console.log(`ADB Output: ${data}`);
  });

  childProcess.stderr.on('data', (data) => {
    console.error(`ADB Error: ${data}`);
  });

  childProcess.on('close', (code) => {
    console.log(`ADB Process Exited with Code: ${code}`);
  });
};

// Define popular locations with their names and coordinates
const popularLocations = [
  { name: 'Tulsa', latitude: 36.153980, longitude: -95.992775, altitude: 0 },
  { name: 'New York City', latitude: 40.7128, longitude: -74.0060, altitude: 0 },
  { name: 'Tokyo', latitude: 35.682839, longitude: 139.759455, altitude: 0 },
  { name: 'Zaragoza', latitude: 41.661119, longitude: -0.893551, altitude: 0 },
  { name: 'Peir 39 (San Fran)', latitude: 37.8086, longitude: -122.4090, altitude: 0 },
  // Add more popular spots here
];

popularLocations.forEach((spot) => {
  popularSpotsMenu.append(new MenuItem({
    label: spot.name,
    click: () => {
      teleportToLocation(spot.latitude, spot.longitude, spot.altitude);
    }
  }));
});

const template = [
  {
    label: 'Exit',
    click: () => {
      app.quit();
    }
  },
  {
    label: 'Console',
    submenu: [
      {
        label: 'Open DevTools',
        click: () => {
          BrowserWindow.getFocusedWindow().webContents.openDevTools();
        }
      }
    ]
  },
  {
    label: 'Popular Spots',
    submenu: popularSpotsMenu
  },
  {
    label: 'Discord',
    click: () => {
      shell.openExternal('https://discord.gg/GJHvsMggnC');
    }
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('navigate', (event, coords) => {
  // Handle navigation requests here if needed.
  // This example code doesn't open a separate map window.
});
