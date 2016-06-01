/*对象深拷贝*/
	/**
		判断obj的类型
	*/
	var isClass = function(obj) {
		if(obj === null) {
			return 'Null';
		}
		if(obj === undefined) {
			return 'Undefined';
		}
		return Object.prototype.toString.call(obj).slice(8, -1);
	};

	/*实现对象深拷贝一*/
	var deepClone = function(obj) {
		if(typeof obj !== 'object') {
			return obj;
		}
		var classType = isClass(obj);
		if(classType === 'Object') {
			var newObj = {};
			for(var key in obj) {
				newObj[key] = arguments.callee(obj[key]);
			}
			return newObj;
		} else if(classType === 'Array') {
			var newArr = [];
			for(var i = 0, len = obj.length; i < n; i++) {
				newArr.push(obj[i]);
			}
			return newArr;
		}
	}

	/*实现对象深拷贝二*/
	function deepClone(obj){
	    var result,oClass=isClass(obj);
	        //确定result的类型
	    if(oClass==="Object"){
	        result={};
	    }else if(oClass==="Array"){
	        result=[];
	    }else{
	        return obj;
	    }
	    for(key in obj){
	        var copy=obj[key];
	        if(isClass(copy)=="Object"){
	            result[key]=arguments.callee(copy);//递归调用
	        }else if(isClass(copy)=="Array"){
	            result[key]=arguments.callee(copy);
	        }else{
	            result[key]=obj[key];
	        }
	    }
	    return result;
	}