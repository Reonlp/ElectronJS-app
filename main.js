//FIRST YOU HAVE TO CREATE A PACKAGE.JSON (NPM INIT)
//THEN, EDIT IT. MAIN = MAIN.JS, START = ELECTRON .

//THEN, JUST DO AS FOLLOWS.

const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow} = electron;

let mainWindow;

//Listen for the app to be ready

app.on('ready', function(){
  //it creates a new addWindow
  mainWindow = new BrowserWindow({
  frame: true,
  transparent: true

  });
  //Load the html file into the window.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }));
});
