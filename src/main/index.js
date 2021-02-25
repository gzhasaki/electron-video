const {app, BrowserWindow, Tray, ipcMain, shell, Menu, dialog} = require('electron');
const path = require('path');
const electron = require('electron')
// if(require('electron-squirrel-startup')) return;

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let AppTitle = 'OnlinePlayer';
let appTray = null;

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow() {

    mainWindow = new BrowserWindow({
        height: 768,
        useContentSize: true,
        width: 1366,
        title: AppTitle,
        skipTaskbar: false,
        transparent: false, frame: false, resizable: true,
        webPreferences: {
            nodeIntegration: true,
            spellcheck: false,
            webSecurity: false
        },
        alwaysOnTop: false,
        hasShadow: false,
    })
    const Menu = electron.Menu
    Menu.setApplicationMenu(null)

    mainWindow.loadURL(winURL)


    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

function initTray() {
    let trayMenuTemplate = [
        {
            'label': '设置',
            click: function () { }
        },
        {
            'label': '帮助',
            click: function () { }
        },
        {
            'label': '退出',
            click: function () {
                mainWindow.hide();
                mainWindow.close();
                setTimeout(()=>{app.quit()},2000);
            }
        }
    ]
    //系统托盘图标目录
    appTray = new Tray("D:\\idea_workspace\\electron-video\\build\\icons\\icon.ico") // 引入托盘中的小图标本地测试相对路径
    // appTray = new Tray(path.join(__dirname, '/static/icon.ico')) // 打包使用绝对路径

    appTray.setTitle(AppTitle);
    appTray.setToolTip(AppTitle);
    //图标的上下文菜单
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    appTray.setContextMenu(contextMenu);
    // 点击托盘中的图标显示客户端
    appTray.on('double-click', function () {
        mainWindow.show();
    })
}

app.on('ready', () => {
    createWindow();
    initTray();

})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        appTray && appTray.destroy();
        appTray = null;
        app.quit();
    };
})
app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (mainWindow === null) {
        createWindow()
    }
    else{
        mainWindow.show();
    }
})

ipcMain.on("hide-windows", function (event, param) {
    if (mainWindow != null) {
        mainWindow.hide();
    }
});
