/*********************Javascript继承*******************************/
//【方式一：构造继承】把父类的构造函数当成一个普通的方法，放到子类的构造函数中去执行
var Animal = function() {
	this.run = function() {
		console.log('I can run');
	}
}
var People = function(name) {
	//这里传入的就是父类的构造方法，然后执行父类的构造方法，就可以使用父类的方法了
	this.father = Animal;
	this.father();
	//要删除，否则在子类添加和父类相同名称的方法时，会修改到父类
	delete this.father;
	this.name = name;
	this.say = function() {
		console.log('My name is ' + name);
	}
}
var Girl = function(name, age) {
	this.father = People;
	this.father(name);
	delete this.father;
	this.age = age;
	this.introduce = function() {
		console.log('My name is ' + name + ', I am ' + age);
	}
}

//测试
var animal = new Animal();
animal.run();
var people = new People('baizn');
people.run();
people.say();
var girl = new Girl('lan', 22);
girl.run();
girl.say();
girl.introduce();

/*构造继承缺点：指定父类，声明父类对象，然后删除临时变量，
一旦忘记delete，还要承担父类被修改的风险，针对这个，我们可以用call和apply改进*/
//【方式二：使用call和apply改造构造继承】
var Animal = function() {
	this.run = function() {
		console.log('I can run');
	}
}
var People = function(name) {
	//这里传入的就是父类的构造方法，然后执行父类的构造方法，就可以使用父类的方法了
	this.father = Animal;
	this.father.call(this, name);
	this.name = name;
	this.say = function() {
		console.log('My name is ' + name);
	}
}
var Girl = function(name, age) {
	this.father = People;
	this.father.apply(this, new Array(name));
	this.age = age;
	this.introduce = function() {
		console.log('My name is ' + name + ', I am ' + age);
	}
}
console.log(girl instanceof Animal); // false
/*总结：构造继承的优点是支持多继承；缺点是只是通过调用父类的构造方法复制父类的属性和方法到子类中，
其他什么都没做，严格来说都不能称为继承；不支持instanceof。*/

//【方式三：原型继承】
var Point = function(dimension) {
	this.dimension = dimension;
	this.test = function() {
		console.log('dimension:' + dimension);
	}
};

var Point2D = function(x, y) {
	this.x = x;
	this.y = y;
};

Point2D.prototype = new Point(2);
//测试
var point2D = new Point2D(3,4);
point2D.test(); //dimension:2
console.log(point2D instanceof Point); // true

//【方式四：混合继承】：构造继承和原型继承
var People = function(name) {
	this.name = name;
	this.sayName = function() {
		console.log('My Name is :' + name);
	}
}

var Girl = function(name, age) {
	//构造继承
	this.father = People;
	this.father(name);
	delete this.father;
	this.introduce = function() {
		console.log('My name is ' + name + ', I am ' + age);
	}
}
//原型继承
Girl.prototype = new People();

//测试
var girl = new Girl('xuan', 22);
console.log(girl instanceof People);
girl.sayName();
girl.introduce();

//【方式五：实例继承法】：只用于核心对象的继承
var ExtendingError = function(msg) {
	var errorInstance = new Error(msg);
	errorInstance.errorMsg = function() {
		console.log('ErrorInfo is:' + msg);
	}
	return errorInstance;
};

//测试
var errorInfo = new ExtendingError('number is less than 0');
errorInfo.errorMsg();
console.log(errorInfo.toString());

//【方式六：拷贝继承】：将对象的属性和方法一一复制
Function.prototype.Extend = function(obj) {
	for(var pro in obj) {
		this.prototype[pro] = obj[pro];
	}
}

function Animal() {}
function People() {}
People.Extend(new Animal());
/*缺点：
	1、将对象的属性方法一一复制的时候，其实用的就是反射，反射对效率影响很大；
	2、和原型继承一样，必须初始化父类对象，当确定继承关系时，但参数还不确定就不适用。
*/

/*经典javascript构造器*/
function Rectangle(width, height) {
	this.width = width; 
	this.height = height;
}
Rectangle.prototype.getArea = function() {
	return this.width * this.height;
}
Rectangle.prototype.getPerimeter = function() {
	return 2 * (this.width + this.height);
}
Rectangle.prototype.toString = function() {
	return this.constructor.name + 'a = ' + this.getArea() + 'p = ' + this.getPerimeter();
}

function Square(side) {
	this.width = side;
	this.height = side;
}
//Square继承Rectangle
Square.prototype = Object.create(Rectangle.prototype, {
	constructor:{
		value:Square
	}
});
Square.prototype.getPerimeter = function() {
	return this.width * 4;
}

/*纯原型继承*/
//定义Rectangle原型
var Rectangle = {
	name:'Rectangle',
	getArea: function() {
		return this.width * this.height;
	},
	getPerimeter: function() {
		return 2 * (this.width + this.height);
	},
	toString: function() {
		return this.name + ' a = ' + this.getArea() + ' p = ' + this.getPerimeter();
	}
};

//定义Square子对象覆盖一些属性来改变行为
var Square = Object.create(Rectangle);
Square.name = 'Square';
Square.getArea = function() {
	return this.width * this.height;
}
Square.getPerimeter = function() {
	return this.width * 4;
}

//创建对象
var rect = Object.create(Rectangle);
rect.width = 6;
rect.height = 4;
var square = Object.create(Square);
square.width = 5;
console.log(rect.toString());
console.log(square.toString());

/*对象工厂
创建对象最受欢迎的方法之一是使用工厂函数。区别在于以前使用共享函数产生原型对象
再创建这些对象的实例，现在是调用一个函数来返回对象实例。
*/
function Controllor(model, view) {
	view.update(model.value);
	return {
		up: function(evt) {
			model.value ++;
			view.update(model.value);
		},
		down: function(evt) {
			model.value --;
			view.update(model.value);
		},
		save: function(evt) {
			model.save();
			view.close();
		}
	};
}

var on = Controllor({
	value: 5,
	save: function() {
		console.log('Saving value ' + this.value + 'someWhere');
	}
},{
	update: function(newValue) {
		console.log('View now has ' + newValue);
	},
	close: function() {
		console.log('Now hiding view');
	}
});
setTimeout(on.up, 100);
setTimeout(on.down, 200);
setTimeout(on.save, 300);

//输出
View now has 5  
View now has 6  
View now has 5  
Saving value 5 somewhere  
Now hiding view 