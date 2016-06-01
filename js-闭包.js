/*闭包：当函数a的内部函数b被函数a外的一个变量引用的时候，就创建了一个闭包。
作用：1、可以读取函数内部的变量；
2、让这些变量的值始终保持在内存中。
应该注意的问题：
1、由于闭包会使得函数中的变量都保存在内存中，因此对内存消耗很大，
不能滥用闭包，否则会造成网页性能问题；
2、闭包会在父函数外部，改变父函数内部变量的值。*/

/*闭包详细解析：
function a() {
	var i = 0;
	function b() {
		console.log(++i);
	}
	return b;
}
var c = a();
c();
涉及到的几个概念：函数的执行环境(excution context)，活动对象(call object)，作用域(scope)，作用域链(scope chain);
1、当定义函数a的时候，js解释器会将函数a的作用域链设置为定义a时a所在的环境，如果a是一个全局函数，则scope chain中只有window对象；
2、当执行函数a的时候，a会进入相应的执行环境；
3、在创建执行环境过程中，首先会给a添加一个scope属性，即a的作用域，其值就为window；
4、然后执行环境会创建一个活动对象。活动对象也是一个拥有属性的对象，但它不具有原型而且不能通过javascript代码直接访问。
创建完活动对象后，把活动对象添加到a的作用域链的最顶端。此时a的作用域包含两个对象：a的活动对象和window对象；
5、在活动对象上添加arguments属性，它保存着调用函数a时所传递的参数；
6、把函数a的形参和内部函数b的引用也添加到a的活动对象上，在这一步中，完成了b的定义，函数b的作用域链被设置为b所定义的环境，即a的作用域。
执行b时b的作用域链包含了三个对象：b的活动对象，a的活动对象和window对象。

总结：函数的作用域是在定义函数时候就已经确定，而不是在执行的时候确定。
JS垃圾回收机制：
在javascript中，如果一个对象不再被引用，那么这个对象就会被GC回收。如果两个对象互相引用，而不再被第3者所引用，那么这两个互相引用的对象也会被回收。
因为函数a被函数b引用，b又被a外的c引用，这就是为什么函数a执行后不会被删除的原因。
*/
/*题目一*/
var name = 'The Window';
var Person = {
	name:'My Name',
	getName:function() {
		return function() {
			return this.name;
		}
	}
}
console.log(Person.getName()()); //The Window

/*题目二*/
var result = [];
var copyArray = function() {
	for(var i = 0; i < 3; i++) {
		result[i] = function() {
			console.log(i);
		}
	}
}
copyArray();
result[0](); //3
result[1](); //3
result[2](); //3
//修改上面的方法，使其输出期望的值
var result = [];
var copyArray = function() {
	for(var i = 0; i < 3; i++) {
		result[i] = (function(j) {
			return function() {
				console.log(j);
			}
		})(i)
	}
}
copyArray();
result[0](); //0
result[1](); //1
result[2](); //2