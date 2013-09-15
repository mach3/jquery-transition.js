/*!
 * jquery-transition.js
 * --------------------
 * @version 0.8.1
 * @author mach3
 * @license MIT License
 * @url http://github.com/mach3/jquery-transtion.js
 */
(function($){
	/**
	 * Detect support of css transition, event name
	 */
	$.support.transitionInfo = (function(){
		var el, names, name, info = null;
		el = document.createElement("div");
		names = {
			"WebkitTransition": "webkitTransitionEnd",
			"MozTransition": "transitionend",
			"OTransition": "oTransitionEnd otransitionend",
			"transition": "transitionend"
		};
		for(name in names){
			if(el.style[name] === ""){
				info = { name: name, eventName: names[name] };
				break;
			}
		}
		return info;
	}());

	$.support.transition = $.support.transitionInfo !== null;

	/**
	 * Map for easing functions
	 * If "jquery-easing" plugin imported, use one from them
	 */
	$.transitionEasings = (function(data){
		$.each(data, function(key, names){
			$.each(names, function(i, name){
				if(typeof $.easing[name] === "function"){
					data[key] = name;
					return false;
				}
			});
		});
		return data;
	}({
		"ease": ["easeInOutQuad", "swing"],
		"linear": ["linear"],
		"ease-in": ["easeInCubic", "swing"],
		"ease-out": ["easeOutCubic", "swing"],
		"ease-in-out": ["easeInOutCubic", "swing"],
		"common": ["swing"]
	}));

	/**
	 * Attach css transition like $.fn.animate
	 * If transition isn't supported, fallback with $.fn.animate
	 * When no arguments passed, return object which contains jquery-transition data
	 * 
	 * @example:
	 *   $(ele).transition({left: 100, opacity: 1}, {duration: 1000, easing: "ease"});
	 *
	 * @param Object styles
	 * @param Object options
	 */
	$.fn.transition = function(styles, options){
		var transition, dfd, process = [];

		dfd = $.Deferred();
		dfd.promise(this);

		options = $.extend({
			delay: 0, // delay for animation
			duration: 500, // duration for animation
			easing: "ease-out", // easing function
			complete: $.noop // callback when complete
		}, options);

		if($.support.transition){
			transition = "all :duration :easing :delay"
				.replace(":duration", (options.duration / 1000) + "s" )
				.replace(":easing", options.easing)
				.replace(":delay", (options.delay / 1000) + "s");
		} else {
			options.easing = $.transitionEasings[options.easing] || $.transitionEasing.common;
		}

		this.data("onTransitionEnd", options.complete);

		this.each(function(){
			var node = $(this);

			if(! $.support.transition){
				process.push(node.stop().delay(options.delay).animate(styles, options));
				return;
			}

			process.push(function(){
				var _dfd, eventName;

				_dfd = $.Deferred();
				_dfd.promise(this);
				eventName = $.support.transitionInfo.eventName;
				node.css("transition", transition);
				node.off(eventName);
				node.on(eventName, function(e){
					var node, handler;
					node = $(this);
					handler = node.data("onTransitionEnd");
					node.css("transition", "");
					node.off(e.type);
					node.data("onTransitionEnd", undefined);
					if($.isFunction(handler)){
						handler.apply(this);
					}
					_dfd.resolve();
				});
				// just in case nothing changed
				setTimeout(
					$.proxy(function(){
						this.trigger($.support.transitionInfo.eventName);
					}, node),
					options.duration + 10
				);
				node.css(styles);
				return this;
			}());
		});

		$.when.apply($, process).then(function(){
			dfd.resolve();
		});

		return this;
	};

}(jQuery));