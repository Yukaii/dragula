'use strict';
/* global remote_download, remote_markdown, remote_copyimage  */

// Module imports
import { saveAs } from 'file-saver';
const unsplash = require('./util/unsplash');
const canvas = require('./util/canvas');
const imgur = require('./util/imgur');


//Variables for Dom references
const reload = document.getElementById('reload');
const keyword = document.getElementById('keyword');
const drag = document.getElementById('drag');
const download = document.getElementById('download');
const markdown = document.getElementById('markdown');
const clipboard = document.getElementById('clipboard');
const original = document.getElementById('original');
const alert = document.getElementById('alert');
const loader = document.getElementById('loader');
const message = document.getElementById('message');

// Event to search image by keyword
keyword.onkeydown = (event) => {
	if (event.keyCode === 13) {
		loadImage(event.currentTarget.value);
	}
};

// Event to load new image
reload.onclick = (event) => {
	event.preventDefault();

	loadImage(keyword.value);
};

// Event to download the image
download.onclick = (event) => {
	event.preventDefault();
	saveAs(drag.getAttribute('src'), 'image.png')
};

// Event to copy the markdown code
markdown.onclick = (event) => {
	event.preventDefault();
	let img;
	alert.setAttribute('style', 'display:inline-flex;');
	drag.classList.add('image-blur');

	if (document.getElementsByClassName('image-original')[0]) {
		img = canvas.getDataUrl(drag);
	} else {
		img = canvas.getOriginalDataUrl(drag);
	}

	imgur.unploadImage(img).then(res => res.json()).then((body) => {
		alert.setAttribute('style', 'display:none;');
		drag.classList.remove('image-blur');
		const { data } = body;
		remote_markdown(data.link);
		markdownAnimate();
	});
};

// Event to see the original size of image
original.onclick = (event) => {
	event.preventDefault();
	drag.classList.toggle('image-original');
	drag.classList.toggle('image-canvas');
};

// Copy image to clipboard
clipboard.onclick = (event) => {
	event.preventDefault();
	let datauri;
	const image = document.querySelector('img#drag');
	if (document.getElementsByClassName('image-original')[0]) {
		datauri = canvas.getDataUrl(image);
	} else {
		datauri = canvas.getOriginalDataUrl(image);
	}
	remote_copyimage(datauri);
	markdownAnimate();
};

// Event to check if image loaded
drag.onload = (event) => {
	event.preventDefault();
	alert.setAttribute('style', 'display:none;');
	drag.classList.remove('image-blur');
};

// Function to fetch image from unsplash
const loadImage = (keyword) => {

	alert.setAttribute('style', 'display:inline-flex;');
	drag.classList.add('image-blur');

	if (keyword) {
		unsplash.fetchFromKeyword(keyword).then((url) => {
			drag.setAttribute('src', url);
		});
	} else {
		unsplash.fetchRandom().then((url) => {
			drag.setAttribute('src', url);
		});
	}
};

window.onload = function () {
	if (!drag.getAttribute('src')) {
		loadImage();
	}
};

// Function to do animation for markdown code successfully copied
const markdownAnimate = () => {

	alert.setAttribute('style', 'display:inline-flex;');
	loader.setAttribute('style', 'display:none;');
	message.setAttribute('style', 'display:block;');
	drag.classList.add('image-blur');

	setTimeout(() => {
		alert.setAttribute('style', 'display:none;');
		loader.setAttribute('style', 'display:block;');
		message.setAttribute('style', 'display:none;');
		drag.classList.remove('image-blur');
	}, 2000);
};
