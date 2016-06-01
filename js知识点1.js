/*正则表达式*/
//由数字、字母和加号组成，但加号不能再首位。
^(?!^\+)(?!.*\+$)[\d+a-z]{1,8}$

//整数或正浮点数
^([1-9]\d*|0)(\.\d{1,2})?$

//不能输入重复的字母
^(?:(?!([a-zA-Z]).*?\1)[A-Za-z])+$

/*基础知识点*/
if(!('a' in window)) {
	var a = 1;
}
console.log(a); //undefined

/*函数声明会覆盖变量声明，但不会覆盖变量赋值*/
function value() {
	return 1;
}
var value;
console.log(typeof value); //function

function value() {
	return 1;
}
var value = 0;
console.log(typeof value); // number

var a = 1,
	b = function a(x) {
		x && a(--x);
	}
console.log(a); //1

function a(x) {
	return x*2;
}
var a;
console.log(a); //a函数

function b(x, y, z) {
	arguments[2] = 10;
	console.log(z);
}
b(1, 2, 3); //10

function a() {
	console.log(this);
}
a.call(null); //window

/*给string定义一个toUpperCase方法，该方法不需要参数，
将字符串中字符索引(从0开始)为奇数的字母变为大写，然后返回该字符串。
例如，输入：console.log(‘xyz’.toUpperCase())，输出：xYz*/
String.prototype.toUpperCase = String.prototype.toUpperCase || function() {
	if('' === this || null === this) {
		return '';
	}
	var arrayStr = this.split('');
	var resultStr = '';
	for(var i = 0, n = arrayStr.length; i < n; i++) {
		if(i % 2 !== 0) {
			resultStr += arrayStr[i].toUpperCase();
		} else {
			resultStr += arrayStr[i];
		}
	}
	return resultStr;
};
console.log('xyz'.toUpperCase());

/*typeof instanceof contructor的区别及用法：
1、typeof：javascript的一元操作符，用于以字符串的形式返回变量的原始类型；
注意：typeof null也会返回object，大多数的对象类型(数组Array，时间Date等)也都会返回object；
2、contructor：内部原型属性，可以通过代码重写；
3、instanceof：javascript操作符，会在原型链中的构造器中搜索，找到返回true，否则返回false。
*/
var arr = [1, 2, 3];
typeof arr; //object
arr instanceof Array; // true
arr.constructor(); //[]

/*从数组中随机获取成员*/
var items = [12, 23, 'abc', 567, 119,'bzn'];
var randomItem = items[Math.floor(Math.random()*items.length)];

/*获取指定范围内的随机数
用处：生成测试用的假数据时候特别有用，如介与指定范围的工资数。
*/
var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

/*翻转字符串，abc24fg ---> gf42cba*/
var testStr = 'abc24fg';
testStr.split('').sort(
	function() {
		return 1;
	}).join('');

/*打乱数字数组的顺序*/
var numbers = [3,5,75,90,120];
numbers = numbers.sort(function() {
	return Math.random() - 0.5;
});
//更好的实现
function shuffle(array) {
    var tmp, current, top = array.length;

    if(top) while(--top) {
    	current = Math.floor(Math.random() * (top + 1));
    	tmp = array[current];
    	array[current] = array[top];
    	array[top] = tmp;
    }

    return array;
}

/*生成随机字母数字字符串*/
var generateRandomAlphaNum = function(len) {
    var rdmString = '';
    for( ; rdmString.length < len; rdmString  += Math.random().toString(36).substr(2));
    return  rdmString.substr(0, len);
}

/*追加一个数组到另一个数组中*/
var array1 = [1, 3, 'bai', {name:'bzn'}, -345];
var array2 = [2, 6, 90, 'bbb', {age: 15}];
Array.prototype.push.apply(array1, array2);

/*对象转为数组  待验证 ？？？？？*/
var argArray = Array.prototype.slice.call(arguments);

/*验证是否是数字
isFinite() 函数用于检查其参数是否是无穷大
*/
var isNumber = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

/*获取数组中最大值和最小值*/
var numbers = [1, 2, 34, -2, 45, 56, 100, 78, 90];
var maxInNumbers = Math.max.apply(Math, numbers);
var minInNumbers = Math.min.apply(Math, numbers);

/*从数组中删除元素
1、不要使用delete或remove删除元素：对数组使用delete，其实并没有删除掉元素，只是将元素置为undefined；
2、数组元素删除应使用splice；
3、删除对象的属性可以使用delete。
*/
var items = [1, 2, 34, -2, 45, 56, 100, 78, 90];
items.length; //9
delete items[3];
items.length; //9
//items 的结果为：[1, 2, 34, undefined, 45, 56, 100, 78, 90]

//正确的应该是：
var items = [1, 2, 34, -2, 45, 56, 100, 78, 90];
items.length; //9
items.splice(3,1);
items.length; //8
//items 的结果为：[1, 2, 34, 45, 56, 100, 78, 90]

/**保留指定的小数位数
toFixed() 方法可把 Number 四舍五入为指定小数位数的数字
*/
var num = 2.445566;
num = num.toFixed(2); //2.45

/*call 和 apply
call和apply在作用上是相同的：更改对象的内部指针，即改变对象的this指向的内容；
call和apply第一个参数意义一样，第二个参数不同：
apply传入的是一个参数数组，也就是将多个参数组合成为一个数组传入；
call作为参数传入。
使用apply的好处：可以直接将函数的arguments对象作为第二个参数传入。
*/

/*题目一*/
var Person = function() {
	this.value = 'Person对象';
}
var value = 'Global变量';
var Student = function() {
	console.log(this.value);
}
window.Student(); //Global变量
Student.call(window); //Global变量
Student.call(new Person()); //Person对象

/*题目二*/
var Person = new function() {
	this.key = 'Person';
}
var Teacher = function(name) {
	var key = 'Teacher';
	console.log(this.key); //Person
	console.log(name); //新对象
}
Teacher.apply(Person, ['新对象']);

/*JS中的关键字this：指代函数上下文，取决于函数是怎样被调用的，而不是
怎样被定义的。*/

/*普通对象与函数对象
函数对象预定义的属性是prototype；
普通对象预定义属性为__proto__属性 或 [[prototype]]
原型对象其实就是普通对象(Function.prototype除外，它是函数对象，但它没有prototype属性)

*/
function f() {}
var o = new f();
typeof Object ; //function
typeof o ; //object

/******************JS原生面试题目**************************/
//获取页面上的checkbox，不使用第三方框架
var domList = document.getElementsByTagName('input'),
	domLen = domList.length,
	checkboxList = [];
while(domLen --) {
	var checkbox = domList[domLen];
	if(checkbox.type === 'checkbox') {
		checkboxList.push(checkbox);
	}
}

//设置一个已知ID的DIV的html内容为travesty，字体颜色设为黑色，不使用第三方库
var div = document.getElementById('ID');
div.innerHTML = 'travelsky';
div.style.color = '#000';

//当一个DOM节点被点击时候，我们希望执行一个函数，应该怎么做
1、直接在DOM里绑定事件：<div onclick="test()"></div>
2、在JS里通过onclick绑定：xxx.onclick = test();
3、通过事件添加进行绑定：addEventListener(xxx, 'click', test);

那么问题来了，javascript的事件绑定模型都有什么？
1、事件冒泡：事件开始由最具体的元素接收，然后逐机向上传播；
2、事件捕捉：事件由最不具体的节点先接收，然后逐级向下，一直到具体的；
3、DOM事件流：三个阶段（事件捕捉，目标阶段，事件冒泡）

//已知数组 var strArray = ['Hello', 'World', '!'], 输出Hello World !
strArray.join('');

//已知有字符串var str = get-element-by-tag-name，写一个函数转成驼峰表示法“getElementByTagName”
function convert(val) {
	var arr = val.split('-');
	for(var i = 1, n = arr.length; i < n; i++) {
		arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substr(1, arr[i].length-1);
	}
	val = arr.join('');
	return val;
}
convert('get-element-by-tag-name');

//var numberArr = [3, 6, 2, 4, 1];
//1、实现对该数组的倒序，输出[1, 4, 2, 6, 3]
//2、实现该数组的降序排列，输出[6, 4, 3, 2, 1]
numberArr.sort(function(){
  return 1;
});

numberArr.sort(function(a,b){
  return a<b;
});


//输出今天的日期，以YYYY/MM/DD的方式，比如2015年4月16日，则输出2015/04/16
var date = new Date(),
	year = date.getFullYear(),
	month = date.getMonth() + 1,
	day = date.getDate();
month = month < 10 ? '0' + month : month;
day = day < 10 ? '0' + day : day;
console.log(year + '/' + month + '/' +day);

//为了保证页面输出安全，经常需要对一些特殊的字符进行转义，写一个函数，实现对
//< , > , & , " 进行转义
function escapeHtml(str) {
	return str.replace(/[<>"&]/g, function(match) {
		switch(match) {
			case '<':
				return '&lt;';
			case '>':
				return '&gt;';
			case '&':
				return '&amp;';
			case '\"':
				return '&quot;';
		}
	});
}

/*
有这样一个URL：http://item.taobao.com/item.htm?a=1&b=2&c=&d=xxx&e，
请写一段JS程序提取URL中的各个GET参数(参数名和参数个数不确定)，
将其按key-value形式返回到一个json结构中，
如{a:’1′, b:’2′, c:”, d:’xxx’, e:undefined}
*/
function serilizeUrl(url) {
	var getParams = url.split('?')[1],
		params = getParams.split('&'),
		result = {};
	for(var i = 0, n = params.length; i < n; i++) {
		var param = params[i];
			keyValue = param.split('=');
		result[keyValue[0]] = keyValue[1];
	}
	return result;
}
serilizeUrl('http://item.taobao.com/item.htm?a=1&b=2&c=&d=xxx&e');

/*
javascript中callee和caller的作用
caller是返回一个函数的引用，该函数调用了当前函数；
callee是返回正在执行的function函数，也就是所指定的function对象的正文。
*/

/*callee应用:
如果一对兔子每月生一对兔子；一对新生兔，从第二个月起就开始生兔子；
假定每对兔子都是一雌一雄，试问一对兔子，第n个月能繁殖成多少对兔子？
*/
var result = [];
function fn(n) { //斐波那契数列
	if(n === 1) {
		return 1;
	} else if(n === 2) {
		return 2;
	} else {
		if(result[n]) {
			return result[n];
		} else {
			//argument.callee()表示fn()
			result[n] = argument.callee(n-1) + argument.callee(n-2);
			return result[n];
		}
	}
}