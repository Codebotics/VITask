const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

app.on('ready',function(){
    createMainWindow();
});



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
        icon: __dirname + '/icons/png/256x256.png'
    }));
    //Quit app when closed
    mainWindow.on('closed',function(){
        mainWindow = null;
    });
    //Build Menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
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
        icon: __dirname + '/icons/png/256x256.png'
    }));
    dashWindow.on('closed',function(){
        dashWindow = null;
    });
    
};


//catch login:new
ipcMain.on('login:new',function(e,item){
    console.log(item);
    createDashboard();
    dashWindow.webContents.send('login:new',item);
});

//catch logout:new
ipcMain.on('logout:new',function(e,item){
    console.log(item);
    createMainWindow();
});

//catch resync:new
ipcMain.on('resync:new',function(e,item){
    console.log(item);
    dashWindow.webContents.send('resync:new',item);
});

//catch moodle:new
ipcMain.on('moodle:new',function(e,item){
    console.log(item);
    dashWindow.webContents.send('moodle:new',item)
});

//catch page:change
ipcMain.on('page:change',function(e,item){
    console.log(item);
    dashWindow.webContents.send('page:change',item);
});

//catch resync:details
ipcMain.on('resync:details',function(e,item){
    console.log(item);
    dashWindow.webContents.send('resync:details',item);
});

//catch nomoodle:new
ipcMain.on('nomoodle:new',function(e,item){
    console.log(item);
    dashWindow.webContents.send('nomoodle:new',item);
});


//create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label: 'Resync',
                accelerator: process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
                click()
                {
                    dashWindow.webContents.send('page:change','resync');
                }
            },
            {
                label: 'Logout',
                accelerator: process.platform == 'darwin' ? 'Command+L' : 'Ctrl+L',
                click()
                {
                    dashWindow.webContents.send('page:change','logout');
                }
            },
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
}