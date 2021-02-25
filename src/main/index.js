const {app, BrowserWindow, Tray, ipcMain, shell, Menu, dialog} = require('electron');
const path = require('path');
const electron = require('electron')
const winston = require('winston');
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
let settingsWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`+(info.splat!==undefined?`${info.splat}`:" "))
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join('logs/error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join('logs/all.log') }),
    ],
});

function createWindow() {

    mainWindow = new BrowserWindow({
        height: 768,
        useContentSize: true,
        width: 1366,
        title: AppTitle,
        skipTaskbar: false,
        transparent: false, frame: false, resizable: false,
        webPreferences: {
            nodeIntegration: true,
            spellcheck: false,
            webSecurity: false
        },
        alwaysOnTop: false,
        hasShadow: false,
        show: false
    })
    const Menu = electron.Menu
    Menu.setApplicationMenu(null)

    mainWindow.loadURL(winURL)

    mainWindow.on('ready-to-show', function () {
        mainWindow.show() // 初始化后再显示
    })
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
    appTray = new Tray("https://g.csdnimg.cn/static/logo/favicon32.ico") // 引入托盘中的小图标本地测试相对路径
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


ipcMain.on("open-new-window", function (event, param) {
    if (!settingsWindow) {
        settingsWindow = null;
        settingsWindow = new BrowserWindow({
            width: 1024,
            height: 600,
            skipTaskbar: false,
            transparent: false, frame: false, resizable: true,
            webPreferences: {
                nodeIntegration: true
            },
            icon: path.join(__dirname, 'build/icons/icon.ico'),
            alwaysOnTop: false,
            hasShadow: false,
            parent:mainWindow,
            show: false
        })
        settingsWindow.setMenu(null)
        settingsWindow.loadURL(winURL + "#/settings")
        settingsWindow.on('ready-to-show', () => {
            // 等初始化完成后再显示
            settingsWindow.show()
        })
        settingsWindow.on('closed', () => {
            // 取消引用 window 对象，如果你的应用支持多窗口的话，
            // 通常会把多个 window 对象存放在一个数组里面，
            // 与此同时，你应该删除相应的元素。
            logger.info('settingsWindow close.')
            settingsWindow = null;
        })
    }
});

ipcMain.on('hide-settings-window', function () {
    if (settingsWindow) {
        settingsWindow.hide();

        setTimeout(()=>{
            settingsWindow.close();
        },100);
    }
})
