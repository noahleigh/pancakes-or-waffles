import abstractGetter from 'getter/abstract/abstract';

import binaries from 'json-loader!yaml-loader!corpus/less-common/binaries.yaml';

export default class extends abstractGetter {

	constructor(defaults={}) {
		super(defaults);
	}

	get values() {

		return {
			good: this.expand(this.randomArray(binaries.good)),
			bad: this.expand(this.randomArray(binaries.bad))
		};

	}
}
