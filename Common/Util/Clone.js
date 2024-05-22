exports.isType = (type, val) => val.constructor.name.toLowerCase() === type.toLowerCase();

exports.Clone = function(original) {
	if (typeof (original) == "object") {
		if (isType('array',original)) {
			return CloneArray(original);
		}

		return CloneObject(original);
	}

	return original;
};

function CloneObject(original) {
	var newObj = new Object();

	for ( var ele in original) {
		if (typeof (original[ele]) == "object") {
			if (isType('array',original[ele])) {
				newObj[ele] = CloneArray(original[ele]);
			} else {
				newObj[ele] = CloneObject(original[ele]);
			}
		} else {
			newObj[ele] = original[ele];
		}
	}

	return newObj;
}

function CloneArray(original) {
	var newArray = new Array();

	var len = original.length;
	for ( var i = 0; i < len; i++) {
		if (typeof (original[i]) == "object") {
			if (isType('array',original[i])) {
				newArray[i] = CloneArray(original[i]);
			} else {
				newArray[i] = CloneObject(original[i]);
			}
		} else {
			newArray[i] = original[i];
		}
	}

	return newArray;
}
