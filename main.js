'use strict';

// Native imports
const fs = require('fs');
const path = require('path');

// Dependencies
const carlo = require('carlo');

// Global Variables
let app;

async function run () {
	app = await carlo.launch({
		width: 100,
		height: 50,
		channel: ['canary', 'stable'],
		title: 'Dragula',
	});

	app.on('exit', () => process.exit());
	app.serveFolder(path.join(__dirname, 'out'));

	await app.exposeFunction('remote_open', open);
	await app.exposeFunction('remote_close', close);
	await app.exposeFunction('remote_download', download);
	await app.exposeFunction('remote_markdown', markdown);
	await app.exposeFunction('remote_ondragstart', ondragstart);

	await app.load('index.html');
	return app;
}

run();

function download () {

}

function ondragstart () {
}

function markdown () {

}

async function open () {
	const win = app.mainWindow();
	const { left, top } = await win.bounds();

	await win.setBounds({
		width: 300,
		height: 200,
		left: left - 200,
		top: top - 150
	});
}

async function close () {
	const win = app.mainWindow();
	const { left, top } = await win.bounds();

	win.setBounds({
		width: 100,
		height: 50,
		left: left + 200,
		top: top + 150
	});
}

// // Function to handle native drag and drop
// ipcMain.on('ondragstart', (event, filePath) => {
// 	let file = nativeImage.createFromDataURL(filePath);

// 	fs.writeFile('image.png', file.toPNG(), () => {
// 		event.sender.startDrag({
// 			file: path.join(__dirname + '/image.png'),
// 			icon: file
// 		});
// 	});
// });

// // Function to handle native download
// ipcMain.on('download', (event,args) => {
// 	download(BrowserWindow.getFocusedWindow(),args.url);
// });

// // Function to copy markdown code to clipboard
// ipcMain.on('markdown', (event,args) => {
// 	clipboard.writeText('![alt data]('+ args.url+')');
// });

