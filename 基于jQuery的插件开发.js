/*
	基于jQuery的插件开发：
		1、类级别的插件开发，即给jQuery添加新的全局函数，相当于给jQuery类本身添加方法，
		jQuery的全局函数就是属于jQuery命名空间的函数；
			1.1添加一个新的全局函数：
			jQuery.sum = function(a, b) {
				return a + b;
			}
			调用时：jQuery.sum(1, 2) 或 $.sum(1, 2);
			1.2增加多个全局函数：
			jQuery.sum = function(a, b) {
				return a + b;
			};
			jQuery.dup = function(a, b) {
				return a - b;
			};
			调用时同上。
			1.3使用jQuery.extend(object)：
			jQuery.extend({
				sum:function(a, b) {
					return a + b;
				},
				dup:function(a, b) {
					return a - b;
				}
			});
			1.4使用命名空间：
			为了避免函数名及变量名与其他jQuery插件冲突，我们可以添加自定义命名空间。
			jQuery.String = {
				sum:function(a, b) {
					return a + b;
				},
				dup:function(a, b) {
					return a - b;
				}
			};
			采用命名空间的函数仍然是全局函数，调用时采用的方法：$.String.sum(1, 2)。
		2、对象级别的插件开发，即给jQuery对象添加方法。
			2.1形式一：
			(function($) {
				$.fn.extend({
					sum:function(opt, callback) {
	
					}
				})
			})(jQuery);
			2.2形式二：
			(function($) {
				$.fn.sum = function() {
	
				};
			})(jQuery);
			2.3接收options参数以控制插件的行为
			$.fn.sum = function(options) {
				var defaults = {
					foreground:'red'
				};
				var opts = $.extend(defaults, options);
				//插件具体功能

			}
			2.4暴露插件的默认设置
			$.fn.sum = function(options) {
				var opts = $.extend({}, $.fn.sum.defaults, options);
				//插件的具体实现

			};
			$.fn.sum.defaults = {
				foreground:'red'
			};
			使用者可以这样调用：$.fn.sum.defaults.foreground = 'blue';
			这个只需要调用一次，且不需要在ready块中调用。
			$('#id').sum();
			也可以通过传递配置参数给插件的方法来覆盖缺省设置：
			$('#blue').sum({
				foreground:'blue'
			});
			2.5适当的暴露一些函数
			$.fn.sum = function(options) {
				return this.each(function() {
					var $this = $(this);
					//具体实现代码

					var markup = $this.html();
					markup = $.fn.sum.format(markup);
					$this.html(markup);
				});
			};
			//定义format函数
			$.fn.sum.format = function(txt) {
				return '<strong>' + txt + '</strong>';
			}
			2.6保持私有函数的私有性
			(function($) {
				//插件定义
				$.fn.sum = function(options) {
					debug(this);
					//具体实现
					...
				};

				//私有函数定义
				var debug = function($obj) {
					if(window.console && window.console.log) {
						window.console.log('selection count:' + $obj.size())
					}
				};
			})(jQuery);
*/
;(function($) {
	//插件的定义
	$.fn.hilight = function(options) {
		debug(this);
		var opts = $.extend({}, $.fn.hilight.defaults, options);
		return this.each(function() {
			var $this = $(this);
			var o = $.meta ? $.extend({}, opts, $this,data()) : opts;
			//更新元素样式
			$this.css({
				backgroundColor:o.backround,
				color:o.foreground
			});
			var markup = $this.html();
			markup = $.fn.format(markup);
			$this.html(markup);
		});
	};
	//私有函数
	var debug = function($obj) {
		if(window.console && window.console.log) {
			window.console.log('selection count:' + $obj.size())
		}
	};

	//定义暴露函数format
	$.fn.hilight.format = function(txt) {
		return '<strong>' + txt + '</strong>';
	};

	//插件的defaults
	$.fn.hilight.defaults = {
		foreground:'red',
		background:'yellow'
	};
})(jQuery);