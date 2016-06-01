/*
实现一个函数clone，可以对JavaScript中的5种主要的数据类型
（包括Number、String、Object、Array、Boolean）进行值复制

考察知识点：
考察点1：对于基本数据类型和引用数据类型在内存中存放的是值还是指针这一区别是否清楚
考察点2：是否知道如何判断一个变量是什么类型的
考察点3：递归算法的设计
*/
//方法一
Object.prototype.clone = function() {
	var obj = this.constructor === Array ? [] : {};
	for(var o in this) {
		obj[o] = typeof this[o] === 'object' ? this[o].clone() : this[o];
	}
	return obj;
};

//方法二
function clone(obj) {
	var buf;
	if(obj instanceof Array) {
		buf = [];
		var i = obj.length;
		while(i--) {
			buf[i] = clone(obj[i]);
		}
		return buf;
	} else if(obj instanceof Object) {
		buf = {};
		for(var k in obj) {
			buf[k] = clone(obj[k]);
		}
		return buf;
	} else {
		return obj;
	}
}

//定义一个log方法，可以替代console.log
function log() {
	console.log.apply(console, arguments);
}

//扩展：定义一个log方法，打印出的内容需要加[travelsky]前缀，比如hello，需要打印出[travelsky]hello
function log() {
	//为了使用unshift数组方法
	var argus = Array.prototype.slice.call(arguments);
	argus.unshift('[travelsky]');
	console.log.apply(console, argus);
}
log('hello');

/*上下文*/
var User = {
	count: 1,
	getCount: function() {
		return this.count;
	}
};
console.log(User.getCount()); //1
var func = User.getCount;
console.log(func()); //undefined

//如何保证User总是访问到func的上下文呢，即正确返回1
var func = User.getCount.bind(User);
console.log(func()); //1

//解决bind的兼容性
Function.prototype.bind = Function.prototype.bind || function(context) {
	var self = this;
	return function() {
		return self.apply(context, arguments);
	}
}