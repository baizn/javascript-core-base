/**
*	@description 包含事件监听、移动和模拟事件触发的事件机制，支持链式调用
*/
//插件方式
(function(window, undefined) {
	var Ev = window.Ev = window.$ = function(element) {
		return new Ev.fn.init(element);
	};

	/*EV对象构建*/
	Ev.fn = Ev.prototype = {
		init: function(element) {
			this.element = (element && element.nodeType === 1) ? element : document;
		},

		/*
			添加事件监听

		*/
		add: function(type, callback) {
			var that = this;
			if(that.element.addEventListener) {
				//支持Modern和IE9浏览器
				that.element.addEventListener(type, callback, false);
			} else if(that.element.attachEvent) {
				//支持IE5+
				if(type.indexOf('custom') !== -1) {
					if(isNaN(that.element[type])) {
						that.element[type] = 0;
					}

					var fnEv = function(event) {
						event = event ? event : window.event;
						if(event.propertyName === type) {
							callback.call(that.element);
						}
					};
					that.element.attachEvent('onpropertychange', fnEv);

					//在元素上存储绑定的propertychange的回调，方便移除事件绑定
					if(!that.element['callback' + callback]) {
						that.element['callback' + callback] = fnEv;
					}
				} else {
					that.element['on' + type] = callback;
				}
			} else {
				//其他浏览器
				that.element['on' + type] = callback;
			}
			return that;
		},
		remove: function(type, callback) {
			var that = this;
			if(that.element.removeEventListener) {
				that.element.removeEventListener(type, callback, false);
			} else if(that.element.detachEvent) {
				//自定义事件处理，支持IE5+
				if(type.indexOf('custom') !== -1) {
					//移除对相应的自定义属性的监听
					that.element.detachEvent('onpropertychange', that.element['callback' + callback]);
					that.element['callback' + callback] = null;
				}
			} else {
				that.element.detachEvent('on' + type, callback);
			}
			return that;
		},
		/**
			模拟触发事件
		*/
		trigger: function(type) {
			var that = this;
			try {
				//现代浏览器
				if(that.element.dispatchEvent) {
					//创建事件
					var evt = document.createEvent('Event');
					//定义事件类型
					evt.initEvent(type, true, true);
					//触发事件
					that.element.dispatchEvent(evt);
					//IE
				} else if(that.element.fireEvent) {
					if(type.indexOf('custom') != -1) {
						that.element[type] ++;
					} else {
						that.element.fireEvent('on' + type);
					}
				}
			} catch(e) {

			}
			return that;
		}
	}
	Ev.fn.init.prototype = Ev.fn;
})(window);

//对象字面量方式
var Event = {
	listener: {},
	addEvent: function(type, fn) {
		if(typeof this.listener[type] === 'undefined') {
			this.listener[type] = [];
		}
		if(typeof fn === 'function') {
			this.listener[type].push(fn);
		}
		return this;
	},
	triggerEvent: function(type) {
		var arrayEvent = this.listener[type];
		if(arrayEvent instanceof Array) {
			for(var i = 0, len = arrayEvent.length; i < len; i++) {
				if(typeof arrayEvent[i] === 'function') {
					arrayEvent[i]({
						type: type
					});
				}
			}
		}
		return this;
	},
	removeEvent: function(type, fn) {
		var arrayEvent = this.listener[type];
		if(typeof type === 'string' && arrayEvent instanceof Array) {
			if(typeof fn === 'function') {
				for(var i = 0, len = arrayEvent.length; i < len; i++) {
					if(arrayEvent[i] === fn) {
						this.listener[type].splice(i, 1);
						break;
					}
				}
			} else {
				delete this.listener[type];
			}
		}
		return this;
	}
};

//原型方式
var EventTarget = function() {
	this.listener = {};
};

EventTarget.prototype = {
	constructor: this,
	addEvent: function(type, fn) {
		if(typeof type === 'string' && typeof fn === 'function') {
			if(typeof this.listener[type] ==='undefined') {
				this.listener[type] = [fn];
			} else {
				this.listener[type].push(fn);
			}
		}
		return this;
	},
	addEvents: function(obj) {
		obj = typeof obj === 'object' ? obj : {};
		for(var type in obj) {
			if(type && typeof obj[type] === 'function') {
				this.addEvent(type, obj[type]);
			}
		}
		return this;
	},
	triggerEvent: function(type) {
		if(type && this.listener[type]) {
			var events = {
				type: type,
				target: this
			};
			for(var len = this.listener[type].length, start = 0; start < len; start += 1) {
				this.listener[type][start].call(this, events);
			}
		}
		return this;
	},
	triggerEvents: function(array) {
		if(array instanceof Array) {
			for(var i = 0, len = array.length; i < len; i += 1) {
				this.triggerEvent(array[i]);
			}
		}
		return this;
	},
	removeEvent: function(type, callback) {
		var listeners = this.listener[type];
		if(listeners instanceof Array) {
			if(typeof callback === 'function') {
				for(var i = 0, len = listeners.length; i < len; i += 1) {
					if(listeners[i] === callback) {
						listeners.splice(i, 1);
						break;
					}
				}
			} else if(callback instanceof Array) {
				for(var lis = 0, keyLen = callback.length; lis < keyLen; lis += 1) {
					this.removeEvent(type, callback[lis]);
				}
			} else {
				delete this.listener[type];
			}
		}
		return this;
	},
	removeEvents: function(types) {
		if(types instanceof Array) {
			for(var i =0, len = types.length; i < len; i += 1) {
				this.removeEvent(types[i]);
			}
		} else if(typeof types === 'object') {
			for(var type in types) {
				this.removeEvent(type, types[type]);
			}
		}
		return this;
	}
};

//DOM/伪DOM方式
var $$ = function(element) {
	return new _$(element);
};

var _$ = function(element) {
	this.element = (element && element.nodeType ===1 ) ? element : document;
};

_$.prototype = {
	constructor: this,
	addEvent: function(type, fn, capture) {
		var element = this.element;
		if(window.addEventListener) {
			element.addEventListener(type, fn, capture);

			var evt = document.createEvent('HTMLEvents');
			evt.initEvent(type, capture || false, false);
			//在元素上存储创建的事件，方便自定义触发
			if(!element['ev' + type]) {
				element['ev' + type] = evt;
			}
		} else if(window.attachEvent) {
			element.attachEvent('on' + type, fn);
			if(isNaN(element['cu' + type])) {
				//自定义属性，触发事件用
				element['cu' + type] = 0;
			}

			var fnEv = function(event) {
				if(event.propertyName === 'cu' + type) {
					fn.call(element);
				}
			};

			el.attachEvent('onpropertychange', fnEv);

			//在元素上存储帮的propertychange事件，方便删除
			if(!element['ev' + type]) {
				element['ev' + type] = [fnEv];
			} else {
				element['ev' + type].push(fnEv);
			}
		}
		return this;
	},
	triggerEvent: function(type) {
		var element = this.element;
		if(typeof type === 'string') {
			if(document.dispatchEvent) {
				if(element['ev' + type]) {
					element.dispatchEvent(element['ev' + type]);
				} else if(document.attachEvent) {
					//改变对应自定义属性，触发自定义事件
					element['cu' + type]++;
				}
			}
		}
		return this;
	},
	removeEvent: function(type, fn, capture) {
		var element = this.element;
		if(window.removeEventListener) {
			element.removeEventListener(type, fn, capture || false);
		} else if(window.detachEvent) {
			element.detachEvent('on' + type, fn);
			var arrEv = element['ev' + type];
			if(arrEv instanceof Array) {
				for(var i = 0, len = arrEv.length; i < len; i += 1) {
					//删除该方法名下所有绑定的propertychange事件
					element.detachEvent('onpropertychange', arrEv[i]);
				}
			}
		}
		return this;
	}
};
