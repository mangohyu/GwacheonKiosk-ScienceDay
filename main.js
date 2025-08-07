const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const os = require('os');

let mainWindow;

function createWindow() {
  // 윈도우7 호환성을 위한 설정
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 1600,
    minHeight: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'icon.ico'),
    show: false,
    fullscreenable: true,
    autoHideMenuBar: false
  });

  // 윈도우가 준비되면 표시
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // HTML 파일 로드
  mainWindow.loadFile('index.html');

  // 개발자 도구 (개발 시에만 사용)
  // mainWindow.webContents.openDevTools();

  // 윈도우가 닫힐 때 처리
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 시스템 정보 핸들러 등록
ipcMain.handle('get-system-info', async () => {
  return {
    platform: os.platform(),
    nodeVersion: process.version,
    electronVersion: process.versions.electron,
    chromeVersion: process.versions.chrome
  };
});

// 앱이 준비되면 윈도우 생성
app.whenReady().then(() => {
  createWindow();

  // macOS에서 dock 아이콘 클릭 시 윈도우 재생성
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 모든 윈도우가 닫히면 앱 종료
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 보안: 새 윈도우 생성 방지
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
}); 