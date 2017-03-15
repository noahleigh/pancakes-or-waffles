import request from 'browser-request';
import env from 'env';
import random from 'lib/random';

const pagesToLoad = 6;
const apiUrl = 'https://www.googleapis.com/customsearch/v1';

module.exports = function(query,params) {

	if(!params) params = {};
	if(!params.debug) params.debug = false;

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
		cx: env.googleSearchCx,
		key: env.googleSearchKey
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
					url: random(results).link
				});
			}
		};

		for(let i = 0; i < pagesToLoad; i++) {
			if(!env.googleSearchCx || params.debug === true) {
				onResults([
					{
						image: {
							width: 20,
							height: 10
						},
						link: 'http://vignette3.wikia.nocookie.net/projectcars/images/8/8c/Project_Cars_Screenshots_(1).JPG/revision/latest?cb=20150324015839'
					}
				]);
			}
			else {
				request({
					url: apiUrl,
					json: true,
					qs: Object.assign(
						{}, parameters,
						{
							start: (10*i)+1
						}
					)
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
