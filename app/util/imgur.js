const request = require('request-promise-native');

const options = {
	url: 'https://api.imgur.com/3/upload',
	data:{
		type: 'base64'
	},
	headers: {
		'Authorization': 'Client-ID 8d2e0f29107b225'
	},
	dataType: 'json'
};

/**
 * This function upload dataURI to imgur.
 * @param {string} dataUri imagedata to be uploaded
 * @returns {Promise<Object>} promise with data of image uploaded
 */
const unploadImage = (dataUri)=>{
	options.formData = {'image': dataUri.split(',')[1]};
	return request.post(options);
};

module.exports = { unploadImage };
