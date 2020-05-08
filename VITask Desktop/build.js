var electronInstaller = require('electron-winstaller');

// In this case, we can use relative paths
var settings = {
    // Specify the folder where the built app is located
    appDirectory: './release-builds/VITask-win32-ia32',
    // Specify the existing folder where 
    outputDirectory: './installer',
    // The name of the Author of the app (the name of your company)
    authors: 'VITask',
    // The name of the executable of your built
    exe: './VITask.exe'
};

resultPromise = electronInstaller.createWindowsInstaller(settings);
 
resultPromise.then(() => {
    console.log("The installers of your application were succesfully created !");
}, (e) => {
    console.log(`Well, sometimes you are not so lucky: ${e.message}`)
});