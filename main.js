#!/usr/bin/env node

'use strict';

// Native imports
const fs = require('fs');
const os = require('os');
const path = require('path');
const childProcess = require('child_process');

const clipboardy = require('clipboardy');
const imageDataURI = require('image-data-uri');
const tempy = require('tempy');
const carlo = require('carlo');
const PowerShell = require('powershell');

const osType = os.type();

// Global Variables
let app;

async function run () {
	app = await carlo.launch({
		width: 300,
		height: 200,
		channel: ['canary', 'stable'],
		title: 'Dragula',
		icon: 'out/assets/dracula.png',
		localDataDir: path.join(os.homedir(), '.carlo-dragula'),
	});

	app.on('exit', () => process.exit());
	app.serveFolder(path.join(__dirname, 'out'));

	await app.exposeFunction('remote_open', open);
	await app.exposeFunction('remote_close', close);
	await app.exposeFunction('remote_download', download);
	await app.exposeFunction('remote_markdown', markdown);
	await app.exposeFunction('remote_copyimage', copyImage);

	await app.load('index.html');
	return app;
}

run();

function download () {

}

function copyImage (datauri) {
	const { imageType, dataBuffer } = imageDataURI.decode(datauri);
	let ext = imageType.replace(/^image\//, '');
	const tempfile = tempy.file({ extension: ext });
	fs.writeFileSync(tempfile, dataBuffer);

	// copy the file to clipboard
	let args;
	switch (osType) {
	case 'Darwin':
		args = [
			'-e',
			`set the clipboard to (read (POSIX file"${tempfile}") as JPEG picture)`
		];
		childProcess.spawnSync('osascript', args);
		break;
	case 'Linux':
		args = [
			'-selection',
			'clipboard',
			'-t',
			imageType,
			'-i',
			tempfile
		];
		childProcess.spawnSync('xclip', args);
		break;
	case 'Windows_NT':
		new PowerShell(`Set-Clipboard -LiteralPath ${tempfile}`);
		break;
	default:
		break;
	}
}

function markdown (link) {
	clipboardy.writeSync(`![alt data](${link})`);
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
		height: 80,
		left: left + 200,
		top: top + 150
	});
}

// // Function to handle native download
// ipcMain.on('download', (event,args) => {
// 	download(BrowserWindow.getFocusedWindow(),args.url);
// });
