import { app, BrowserWindow } from 'electron';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerResumeIpc } from './ipc/registerResumeIpc.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let mainWindow = null;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        title: 'Resume Tailor',
    });
    const isDev = !app.isPackaged;
    if (isDev) {
        mainWindow.loadURL('http://localhost:3001');
    }
    else {
        mainWindow.loadFile(join(__dirname, '..', 'dist', 'index.html'));
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
        createWindow();
});
app.whenReady().then(() => {
    registerResumeIpc();
    createWindow();
});
