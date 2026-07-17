const path = require('node:path');
const { app, BrowserWindow, Menu } = require('electron');

// 编辑器页面已经提供“关于”入口，不显示重复的 Electron 菜单栏。
Menu.setApplicationMenu(null);

function createWindow() {
    const win = new BrowserWindow({
        width: 1600,
        height: 900,
        minWidth: 960,
        minHeight: 640,
        title: 'DrawRu 编辑器',
        icon: path.join(__dirname, 'icon.ico'),
        backgroundColor: '#f5f6f8',
        webPreferences: {
            // 现有页面只需要浏览器 API，不需要 Node.js 注入。
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true
        }
    });

    win.loadFile(path.join(__dirname, '..', 'index.html'));
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
