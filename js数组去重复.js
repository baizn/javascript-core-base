/*************************JS数组去除重复********************************************/
/*数组去重复，基于原型扩展*/
Array.prototype.removeDuplicate = function() {
	var arrObj = {},
		newArr = [],
		len = this.length;
	for(var i = 0; i < len; i++) {
		var value = this[i],
			type = (typeof value) + value;
		if(arrObj[type] === undefined) {
			newArr.push(value);
			arrObj[type] = len;
		}
	}
	return newArr;
}

var s = [1, 1, 2, 3, 4, 5, 4, 3, 4, 4, 5, 5, 6, 7];
s.removeDuplicate(); //[1, 2, 3, 4, 5, 6, 7]

/*去除重复后数组为字符串*/
var removeDuplicate = function(array) {
	array = array || [];
	var arrObj = {},
		len = array.length;
	for(var i = 0; i < len; i++) {
		var data = array[i];
		if(typeof(arrObj[data]) === 'undefined') {
			arrObj[data] = 1;
		}
	}
	array.length = 0;
	for(var arr in arrObj) {
		array[array.length] = arr;
	}
	return array;
}

var s = [1, 1, 2, 3, 4, 5, 4, 3, 4, 4, 5, 5, 6, 7];
removeDuplicate(s); //["1", "2", "3", "4", "5", "6", "7"]

/*去除重复后数组为数字*/
var removeDuplicate = function(array) {
	var str = [];
	for(var i = 0, len = array.length; i < len; i++) {
		!RegExp(array[i], 'g').test(str.join(',')) && (str.push(array[i]));
	}
	return str;
}

var s = [1, 1, 2, 3, 4, 5, 4, 3, 4, 4, 5, 5, 6, 7];
removeDuplicate(s); //[1, 2, 3, 4, 5, 6, 7]

/*hashtable的结构记录已有的元素，这样就可以避免内层循环*/
var removeDuplicate = function(array) {
	var hash = {},
		newArr = [];
	for(var i = 0, elem; (elem = array[i]) != null; i++) {
		if(!hash[elem]) {
			newArr.push(elem);
			hash[elem] = true;
		}
	}
	return newArr;
}

var s = [1, 1, 2, 3, 4, 5, 4, 3, 4, 4, 5, 5, 6, 7];
removeDuplicate(s); //[1, 2, 3, 4, 5, 6, 7]