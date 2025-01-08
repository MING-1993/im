const {  contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
  // 除函数外也可以暴露变量
});

contextBridge.exposeInMainWorld('electronAPI', {
  setUnreadCount: (count) => ipcRenderer.send('set-unread-count', count),
  checkWindowVisibility: async () => await ipcRenderer.invoke('check-window-visibility'),
  onWindowVisibilityChanged: (callback) => ipcRenderer.on('window-visibility-changed', (event, isVisible) => callback(isVisible)),
  downloadFile: (url) => ipcRenderer.send('download-file', url),
  setLoginState: (state) => ipcRenderer.send('set-login-state', state),
  getLoginState: () => ipcRenderer.invoke('get-login-state'),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
  installUpdate: () => ipcRenderer.send('install-update')
});
