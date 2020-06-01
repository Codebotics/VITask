const electron = require('electron');
const url = require('url');
const path = require('path');

const ua = require('universal-analytics');
const analytics = ua('UA-157430748-1');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent(app)) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

app.on('ready',function(){
    createMainWindow();
});

function trackEvent(category, action, label, value) {
    analytics
      .event({
        ec: category,
        ea: action,
        el: label,
        ev: value,
      })
      .send();
  }

function createMainWindow()
{
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    /*mainWindow.maximize();*/
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
        backgroundColor: '#3C4858',
        icon: path.join(__dirname, 'icons/png/64x64.png')
    }));
    //Quit app when closed
    mainWindow.on('closed',function(){
        mainWindow = null;
    });
    //Build Menu from template
    const mainMenu = Menu.buildFromTemplate(loginMenuTemplate);
    //Insert Menu
    Menu.setApplicationMenu(mainMenu);
}



function createDashboard(){
    dashWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    /*dashWindow.maximize();*/
    dashWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'dashboard.html'),
        protocol: 'file:',
        slashes: true,
        icon: path.join(__dirname, 'icons/png/64x64.png')
    }));
    dashWindow.on('closed',function(){
        dashWindow = null;
    });
    //Build Menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert Menu
    Menu.setApplicationMenu(mainMenu); 
};


//catch login:new
ipcMain.on('login:new',function(e,item){
    console.log(item);
    createDashboard();
    dashWindow.webContents.send('login:new',item);
    trackEvent('User Interaction', 'New Login');
});

//catch logout:new
ipcMain.on('logout:new',function(e,item){
    console.log(item);
    createMainWindow();
    trackEvent('User Interaction', 'New Logout');
});

//catch resync:new
ipcMain.on('resync:new',function(e,item){
    console.log(item);
    dashWindow.webContents.send('resync:new',item);
    trackEvent('User Interaction', 'New Resync');
});

//catch moodle:new
ipcMain.on('moodle:new',function(e,item){
    console.log(item);
    dashWindow.webContents.send('moodle:new',item)
    trackEvent('User Interaction', 'New Moodle');
});

//catch page:change
ipcMain.on('page:change',function(e,item){
    console.log(item);
    dashWindow.webContents.send('page:change',item);
    trackEvent('User Interaction', 'New Page Change');
});

//catch resync:details
ipcMain.on('resync:details',function(e,item){
    console.log(item);
    dashWindow.webContents.send('resync:details',item);
    trackEvent('User Interaction', 'New Resync Details');
});

//catch nomoodle:new
ipcMain.on('nomoodle:new',function(e,item){
    console.log(item);
    dashWindow.webContents.send('nomoodle:new',item);
    trackEvent('User Interaction', 'New No Moodle');
});


//create main menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

//createlogin  menu template
const loginMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

mainMenuTemplate.push({
    label:'Navigate',
        submenu:[
            {
                label: 'Dashboard',
                accelerator: process.platform == 'darwin' ? 'Command+D' : 'Ctrl+D',
                click(){
                    dashWindow.webContents.send('page:change','dashboard');
                }
            },
            {
                label: 'Academic History',
                accelerator: process.platform == 'darwin' ? 'Command+H' : 'Ctrl+H',
                click(){
                    dashWindow.webContents.send('page:change','academics');
                }
            },
            {
                label: 'Attendance',
                accelerator: process.platform == 'darwin' ? 'Command+W' : 'Ctrl+W',
                click(){
                    dashWindow.webContents.send('page:change','attendance');
                }
            },
            {
                label: 'Marks',
                accelerator: process.platform == 'darwin' ? 'Command+M' : 'Ctrl+M',
                click(){
                    dashWindow.webContents.send('page:change','marks');
                }
            },
            {
                label: 'Moodle',
                accelerator: process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
                click(){
                    dashWindow.webContents.send('page:change','moodlelogin');
                }
            },
            {
                label: 'Timetable',
                accelerator: process.platform == 'darwin' ? 'Command+T' : 'Ctrl+T',
                click(){
                    dashWindow.webContents.send('page:change','timetable');
                }
            }
        ]
    });

//for mac add empty object
if(process.platform=="darwin"){
    mainMenuTemplate.unshift({});
}


//add developer tools item if not in production
if(process.env.NODE_ENV!=='production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
        {
            role: 'reload'
        }
    ]
    })

    loginMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
        {
            role: 'reload'
        }
    ]
    })
}



function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            application.quit();
            return true;
    }
};



