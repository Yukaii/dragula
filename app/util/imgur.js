function dataURItoBlob (dataURI) {
	// convert base64/URLEncoded data component to raw binary data held in a string
	var byteString;
	if (dataURI.split(',')[0].indexOf('base64') >= 0)
		byteString = atob(dataURI.split(',')[1]);
	else
		byteString = unescape(dataURI.split(',')[1]);
	// separate out the mime component
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
	// write the bytes of the string to a typed array
	var ia = new Uint8Array(byteString.length);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([ia], {
		type: mimeString
	});
}


/**
 * This function upload dataURI to imgur.
 * @param {string} dataUri imagedata to be uploaded
 * @returns {Promise<Object>} promise with data of image uploaded
 */
const unploadImage = (dataUri) => {
	const formData = new FormData();
	formData.append('type', 'file');
	formData.append('image', dataURItoBlob(dataUri));

	return fetch('https://api.imgur.com/3/upload.json', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			Authorization: 'Client-ID 8d2e0f29107b225'
		},
		body: formData
	});
};

module.exports = {
	unploadImage,
	dataURItoBlob
};
