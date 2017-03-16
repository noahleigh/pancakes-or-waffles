import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './ZeldaBotwPost.css';
import Post from './abstract/Post.jsx';

import {capitalizeFirstLetter,decapitalizeFirstLetter} from 'lib/stringies';
import ChancesGetter from 'getter/chances';
import CharacterGetter from 'getter/character';
import NarratorGetter from 'getter/less-common/narrator';
import BinaryChoicesGetter from 'getter/less-common/binaryChoices';

class ZeldaBotwPost extends Post {

	getMoreProps() {

		const narrator = new NarratorGetter({
			seed: this.seed
		}).values;
		const character = new CharacterGetter({
			seed: this.seed,
			fandom: this.post.fandom
		}).values.name;
		const chances = new ChancesGetter();

		let more = {};
		more.extras = {
			character: character,
			dialog: new NarratorGetter({seed:this.seed}).narrate(this.post.choices[0])
		};

		let values = new BinaryChoicesGetter({seed:this.seed}).values;
		more.choices = Math.random() >= .5 ? [values.good,values.bad]:[values.bad,values.good];
		more.choices = more.choices.map(capitalizeFirstLetter);
		return more;

	}

}

module.exports = CSSModules(ZeldaBotwPost,styles,{
	errorWhenNotFound: false
});