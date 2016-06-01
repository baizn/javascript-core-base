
call()方法的作用和apply()方法类似，只有一个区别，就是call()方法接受的是若干参数的列表，而apply()方法接受的是一个包含多个参数的数组。

## Function.prototype.call()

call()方法在使用一个指定this值和若干个指定的参数值的前提下调用某个函数或方法。

### 语法

```
fun.call(thisArg[, arg1[, arg2[, ...]]])
```

### 参数
**thisArg**

在fun函数运行时指定的this值。指定的this值并不一定是该函数执行时真正的this值，如果这个函数处于非严格模式下，则指定为null和undefined的this值会自动指向全局对象（浏览器中就是window对象），同时值为原始值（数字，字符串，布尔值）的this会指向该原始值的自动包装对象。

**arg1, arg2**

指定的参数列表。

### 描述
当调用一个函数时，可以赋值一个不同的this对象。this引用当前对象，即call方法的第一个参数。

通过call方法，可以在一个对象上借用另一个对象上的方法，如Object.prototype.toString.call([])，就是一个Array对象借用了Object对象上的方法。

### 示例
#### 使用call方法调用父构造函数
在一个子构造函数中，你可以通过调用父构造函数的call方法来实现继承，类似于java中的写法。下例中，使用Food和Toy构造函数创建的对象实例都会拥有在Product构造函数中添加的name属性和price属性，但category属性是各自的构造函数中定义的。

```
function Product(name, price) {
	this.name = name;
	this.price = price;

	return this;
}

function Food(name, price) {
	Product.call(this, name, price);
	this.category = 'food';
}

Food.prototype = Object.create(Product.prototype);
Food.prototype.constructor = Food;

function Toy(name, price) {
	Product.call(this, name, price);
	this.category = 'toy';
}

Toy.prototype = Object.create(Product.prototype);
Toy.prototype.constructor = Toy;

var cheese = new Food('feta', 5);
var fun = new Toy('robot', 10);
```

#### 使用call方法调用匿名函数
在下例的for循环体内，我们创建了一个匿名函数，然后通过调用该函数的call方法，将每个数组元素作为指定的this值执行了那个匿名函数。这个匿名函数的主要目的是给每个元素对象添加一个print方法。这里不是必须得让数组元素作为this的值传入那个匿名函数。

```
var animals = [
	{
		speicies: 'Lions',
		name: 'king'
	},
	{
		speicies: 'Whale',
		name: 'Fail'
	}
];

for(var i = 0, len = animals.length; i < len; i++) {
	(function(i) {
		this.print = function() {
			console.log('#' + i + ' ' + this.species + ' ' + this.name);
		}
		this.print();
	}).call(anmials[i], i);
}
```

#### 使用call方法调用匿名函数并且指定上下文的this
在下面的例子中，当调用greet方法时，该方法的this值会绑定到i对象。

```
function greet() {
	var reply = [this.person, 'Is An Aesome', this.role];
	console.log(reply);
}

var i = {
	person: 'Douglas',
	role: 'JS'
};

greet.call(i);
```

## Function.prototype.apply()

apply()方法在指定this值和参数（参数以数组或类数组对象的形式存在）的情况下调用某个函数。

### 语法
```
fun.apply(thisArg[, argsArray])
```

### 参数
**thisArg**

在fun函数运行时指定的this值。指定的this值并不一定是该函数执行时真正的this值，如果这个函数处于非严格模式下，则指定为null或undefined时会自动指向全局对象（浏览器中就是window对象），同时值为原始值（数字、字符串、布尔值）的this会指向该原始值的自动包装对象。

**argsArray**

一个数组或者类数组对象，其中的数组元素将作为单独的参数传给fun函数。如果该参数的值为null或undefined，则表示不需要传入任何参数。从ES5开始，可以使用类数组对象。

### 描述
在调用一个存在的函数时，你可以为其指定一个this对象。this指当前对象，也就是正在调用这个函数的对象。使用apply，你可以只写一次这个方法然后在另一个对象中继承它，而不用在新对象中重复写该方法。

apply可以使用数组字面量，如fun.apply(this, ['eat', 'ban'])，或数组对象，如fun.apply(this, new Array('eat', 'ban'))。也可以使用arguments对象作为argsArray参数。arguments是一个函数的局部变量。它可以被用作调用对象的所有未指定的参数。这样，在使用apply函数的时候就不需要知道被调用对象的所有参数。可以使用arguments来把所有参数传递给被调用对象。

### 示例
#### 使用apply来链接构造器
可以使用apply来给一个对象链接构造器，类似于Java。

```
Function.prototype.construct = function(aArgs) {
	var oNew = Object.create(this.prototype);
	this.apply(oNew, aArgs);
	return oNew;
}
```

可以使用下面的方式替换create方法。

```
Function.prototype.construct = function(aArgs) {
	var fc = this, fNewConstr = function() {
		fc.apply(this, aArgs);
	};
	fNewConstr.prototype = fc.prototype;
	return new fNewConstr();
}
```

#### 使用apply和内置函数
apply用法允许你在某些本来需要写成遍历数组变量的任务中使用内建的函数。

```
var numbers = [5, 2, 9, 10, 1];

var max = Math.max.apply(null, numbers);
var min = Math.min.apply(null, numbers);
```

如果数组很大，可以继续优化：

```
function minOfArray(arr) {
	var min = Infinity;
	var QUANTUM = 32768;

	for(var i = 0, len = arr.length; i < len; i++) {
		var submin = Math.min.apply(null, arr.slice(i, Math.min(i + QUANTUM, len)));
		min = Math.min(submin, min);
	}

	return min;
}

var min = minOfArray(numbers);
```

## Function.pototype.bind()

bind()方法会创建一个新函数，当这个函数被调用时，它的this值是传递给bind()的第一个参数，它的参数是 bind()的其它参数和其它原本的参数。

### 语法
```
fun.bind(thisArg[, arg1[, arg2[, ...]]])
```

### 参数
**thisArg**

当绑定函数被调用时，该参数会作为原函数运行时的this指向。当使用new操作符调用绑定函数时，该参数无效。

**arg1, arg2, ...**

当绑定函数被调用时，这些参数加上绑定函数本身的参数会按照顺序作为原函数运行时的参数。

### 描述
bind()函数会创建一个新函数（称为绑定函数），新函数与被调函数（绑定函数的目标函数）具有相同的函数体。当目标函数被调用时this值绑定到bind()的第一个参数，该参数不能被重写。绑定函数被调用时，bind()也接受预设的参数提供给原函数。一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的this值被忽略，同时调用时的参数被提供给模拟函数。

### 示例
#### 创建绑定函数
bind()函数最简单的用法是创建一个函数，使这个函数不论怎么调用都有同样的this值。

```
this.x = 10;
var module = {
	x: 80,
	getX: function() {
		return this.x;
	}
}

module.getX(); //80

var retrieveX = module.getX;
retrieveX(); //10

var boundGetX = retrieveX.bind(module);
boundGetX(); //80
```

#### 分离函数
bind()另一个用法是使一个函数拥有预设的初始参数。这些参数作为bind的第二个参数跟在this后面，之后它们会被插入到目标函数的参数列表的开始位置，传递给绑定函数的参数会跟在它们的后面。

```
function list() {
	return Array.prototype.slice.call(arguments);
}

var list1 = list(1, 2, 3); //[1, 2, 3]

var leadingList = list.bind(undefined, 30);

var list2 = leadingList(); //[37]
var list3 = leadingList(1, 2, 3); // [37, 1, 2, 3]
```

#### 配合setTimeout
默认情况下，使用window.setTimeout()时，this关键字会指向window对象。当使用类的方法时，需要this引用类的实例，需要显式地把this绑定到回调函数以便继续使用实例。

```
function LateBloomer() {
	this.petalCount = Math.ceil(Math.random()*12) + 1;
}

LateBloomer.prototype.bloom = function() {
	window.setTimeout(this.declare.bind(this), 1000);
};

LateBloomer.prototype.declare = function() {
	console.log('I am a beautiful flower width ' + this.petalCount + ' petals');
};

var flower = new LateBloomer();
flower.bloom(); 
```

#### 快捷调用
需要为一个特定的this值的函数创建一个捷径的时候，bind()方法很好用。

可以用Array.prototype.slice来将一个类似于数组的对象转成一个真正的数组。

```
var slice = Array.prototype.slice;
slice.apply(arguments);
```

用bind()可以使这个过程变得简单。slice是Function.prototype的call()方法的绑定函数，并且将Array.prototype的slice()方法作为this的值。

```
var unboundSlice = Array.prototype.slice;
var slice = Function.prototype.call.bind(unboundSlice);

slice(arguments);
```
























