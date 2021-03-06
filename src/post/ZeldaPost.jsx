import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './ZeldaPost.css';
import Post from './abstract/Post.jsx';

import {capitalizeFirstLetter} from 'lib/stringies';
import BinaryChoicesValues from 'getter/less-common/binaryChoices';
import NarratorGetter from 'getter/less-common/narrator';

class ZeldaPost extends Post {

	getMoreProps() {

		const binaryChoices = this.buildGetter(BinaryChoicesValues).values;

		for(let k in binaryChoices) {
			binaryChoices[k] = capitalizeFirstLetter(binaryChoices[k]);
		}

		let more = {
			extras : binaryChoices,
			choices: [this.buildGetter(NarratorGetter).narrate(this.post.choices[0])]
		};

		return more;

	}

}

module.exports = CSSModules(ZeldaPost,styles,{
	errorWhenNotFound: false
});
