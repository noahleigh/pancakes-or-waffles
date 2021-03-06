require('dotenv').config();

const request = require('request');
const http = require('http');
const https = require('https');
const fs = require('fs');
const mkdirp = require('mkdirp');

const pagesToLoad = 1;
const apiUrl = 'https://www.googleapis.com/customsearch/v1';

const fetchImageData = async function(query,{
	debug = false
}={}) {

	const parameters = {
		q: [
			query,
			'gameplay',
			'screenshot',
			'-slideshow',
			'-site:youtube.com'
		].join(' '),
		safe: 'medium',
		searchType: 'image',
		imgSize: 'xxlarge',
		num: 10,
		imgType: 'photo',
		cx: process.env.MC_GOOGLE_CX,
		key: process.env.MC_GOOGLE_KEY
	};

	return new Promise((resolve,reject) => {

		let results = [];
		let pagesLoaded = 0;
		const onResults = (localResults) => {
			pagesLoaded++;
			localResults = localResults.filter(item => item.image.width > item.image.height);
			results = results.concat(localResults);
			if(pagesLoaded >= pagesToLoad) {
				resolve({
					total: results.length,
					url: results[Math.floor(Math.random() * results.length)].link
				});
			}
		};

		for(let i = 0; i < pagesToLoad; i++) {
			if(!process.env.MC_GOOGLE_CX || debug === true) {
				onResults([
					{
						image: {
							width: 20,
							height: 10
						},
						link: 'http://cdn3.dualshockers.com/wp-content/uploads/2015/09/GravityRushRemastered-6.jpg'
					}
				]);
			}
			else {
				request({
					url: apiUrl,
					json: true,
					qs: {
						...parameters,
						start: (10*i)+1
					}
				},(error,response,body)=>{
					if(error || !body.items && results.length < 1) {
						reject(error?error:'req failed');
					}
					else if(!body.items) {
						onResults([]);
					}
					else {
						onResults(body.items);
					}
				});
			}
		}

	});
};

const download = (uri, filename) =>
	new Promise((yay, nay) => {
		request.head(uri, function(err, res, body){
			console.log('content-type:', res.headers['content-type']);
			console.log('content-length:', res.headers['content-length']);
			if(err){
				nay();
			}
			else {
				request(uri).pipe(fs.createWriteStream(filename)).on('close', yay);
			}
		});
	});

const saveRandomImage = () => 
	fetchImageData()
		.then(photo => 
			new Promise((yay, nay)=>{
				mkdirp('build', err => {
					if (!err) yay(photo);
					else throw err;
				});
			})
		)
		.then(photo => 
			download(photo.url, 'build/undefined')
		);
  
  
module.exports = saveRandomImage;