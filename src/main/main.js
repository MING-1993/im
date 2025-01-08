const { app, BrowserWindow, ipcMain, session, dialog } = require('electron');
const path = require('node:path');
const { autoUpdater } = require('electron-updater');
require('dotenv').config();

let mainWindow;
let loginState = null;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 650,
    frame: false,
    titleBarStyle: 'hidden', // 隐藏默认标题栏，但保留原生按钮
    trafficLightPosition: { x: 5, y: 10 }, // macOS: 调整按钮位置
    icon: path.join(__dirname, 'path/to/icon.icns'),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow?.on('close', (event) => {
    event.preventDefault(); // 阻止默认行为
    mainWindow?.hide(); // 隐藏窗口
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'));
  }

  // 打开开发工具
  mainWindow.webContents.openDevTools()
}

// 应用启动逻辑
app.whenReady().then(() => {
  console.log('App is ready');
  ipcMain.handle('ping', () => {
    console.log('[main] Received ping')
    return 'pong';
  })

  // app.dock.setIcon('path/to/asset.png')
  createMainWindow();

  app.on('activate', () => {
    if (mainWindow) {
      mainWindow.show(); // 恢复窗口
    } else {
      createMainWindow();
    }

  })

  app.on('window-all-closed', () => {
    if (process.platform === 'darwin') {
      // event.preventDefault();
    } else {
      app.quit()
    }
  })

  // 启动自动更新
  autoUpdater.checkForUpdatesAndNotify();

  // 监听更新事件
  autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update-available');
  });
  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update-downloaded');
  });

  // 触发安装更新
  ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall();
  });

  // 保存登录状态
  ipcMain.on('set-login-state', (event, state) => {
    loginState = state;
  });

  // 获取登录状态
  ipcMain.handle('get-login-state', () => {
    return loginState;
  });

  // 处理未读消息
  ipcMain.on('set-unread-count', (event,count) => {
    console.log(`[main] Received unread count: ${count}`);
    if (process.platform === 'darwin') {
      // macOS：更新 Dock 图标徽章
      app.dock.setBadge(count > 0 ? count.toString() : '');
    }
  })

  // 返回窗口是否可见状态
  ipcMain.handle('check-window-visibility', () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      return false; // 窗口已关闭或销毁
    }

    return mainWindow.isVisible();
  })

  // 监听窗口事件，发送状态
  mainWindow.on('show', () => {
    console.log('窗口已打开')
    mainWindow.webContents.send('window-visibility-changed', true);
  });
  mainWindow.on('hide', () => {
    mainWindow.webContents.send('window-visibility-changed', false);
  });

  // 监听渲染进程的下载请求
  ipcMain.on('download-file', (event, url) => {
    console.log(`Starting download for: ${url}`);
    mainWindow.webContents.downloadURL(url);
  });

  // 下载逻辑
  session.defaultSession.on('will-download', (event, item, webContents) => {
    // const fileName = item.getFilename();
    // const filePath = path.join(app.getPath('downloads'), fileName); // 默认保存到下载目录
    // item.setSavePath(filePath); // 设置保存路径

    // 下载进度监听
    item.on('updated', (event, state) => {
      if (state === 'progressing') {
        console.log(`Downloaded: ${item.getReceivedBytes()} of ${item.getTotalBytes()}`);
      }
    });

    // 下载完成监听
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log(`Download successfully saved to: ${item.getSavePath()}`);
      } else {
        console.log(`Download failed: ${state}`);
      }
    });

  });

})
