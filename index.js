'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');
const Tray = require('tray');
const Menu = require('menu');
const Positioner = require('electron-positioner');
const events = require('events')
const fs = require('fs')
const path = require('path');
const discover = require("nanodiscover");

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new BrowserWindow({
		width: 600,
		height: 400
	});

	win.loadUrl(`file://${__dirname}/index.html`);
	//win.openDevTools();
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate-with-no-open-windows', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();

  //menu
	var dockMenu = Menu.buildFromTemplate([
			{ label: 'send a file', click: function(){ console.log('send a file.'); }},
			{ type: 'separator' },
			{ label: 'exit', click: function(){ app.exit(); }}
	]);
	app.dock.setMenu(dockMenu);
	//tray
	var iconPath = path.join(__dirname, 'icons', 'icon.png');
	var appIcon = new Tray(iconPath);
	appIcon.setToolTip('edge filesender.');
	appIcon.setContextMenu(dockMenu);

	//move
	const positioner = new Positioner(mainWindow);
	positioner.move('topRight');
	//advertisement
	discover.createAnnouncer("edge","sender");
	var browser = discover.createBrowser("edge","sender");
	browser.on("nodeUp",function (ip) {
	  	console.log("Found Node with IP ", ip);
	});
	browser.on("nodeDown",function (ip) {
	  	console.log("Lost node with IP ", ip);
	});
});
