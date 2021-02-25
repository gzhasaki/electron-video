var electronInstaller = require('electron-winstaller');
var path = require("path");

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: path.join('./build/OnlinePlayer-win32-x64'), //入口，electron-package生成的文件目录
    outputDirectory: path.join('./installer64'),     //出口，electron-winstaller生成的文件目录
    authors: 'zq',
    exe: "OnlinePlayer.exe",        //名称
    setupIcon: "./favicon32.ico",//安装图标，必须本地
    // iconUrl: 'http://pm72qibzx.bkt.clouddn.com/icon.ico',//程序图标，必须url
    noMsi: true,
    setupExe:'setup.exe',
    title:'Zqwd',
    description: "zqwd"
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
