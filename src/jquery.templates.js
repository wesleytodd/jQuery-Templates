/**
 * jQuery Templates
 *
 * A rip-off of Underscore templates
 *
 * Version : 0.0.1
 *
 * http://underscorejs.org/
 * http://wesleytodd.com/
 */
(function($) {

	var entityMap = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		'/': '&#x2F;'
	};
	var entities = '';
	for (var key in entityMap) entities += key;

	var entityRegex = new RegExp('[' + entities + ']', 'g');
	var _escape = function(string) {
		if (string === null) return '';
		return ('' + string).replace(entityRegex, function(match) {
			return entityMap[match];
		});
	};

	$.templateSettings = {
		evaluate    : /<%([\s\S]+?)%>/g,
		interpolate : /<%=([\s\S]+?)%>/g,
		escape      : /<%-([\s\S]+?)%>/g
	};

	var noMatch = /(.)^/;

	var escapes = {
		"'":      "'",
		'\\':     '\\',
		'\r':     'r',
		'\n':     'n',
		'\t':     't',
		'\u2028': 'u2028',
		'\u2029': 'u2029'
	};

	var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

	$.template = function(text, data, settings) {
		var render;
		settings = $.extend({}, $.templateSettings, settings);

		// Combine delimiters into one regular expression via alternation.
		var matcher = new RegExp([
			(settings.escape || noMatch).source,
			(settings.interpolate || noMatch).source,
			(settings.evaluate || noMatch).source
		].join('|') + '|$', 'g');

		// Compile the template source, escaping string literals appropriately.
		var index = 0;
		var source = "__p+='";
		text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
			source += text.slice(index, offset)
				.replace(escaper, function(match) { return '\\' + escapes[match]; });

			if (escape) {
				source += "'+\n((__t=(" + escape + "))==null?'':_escape(__t))+\n'";
			}
			if (interpolate) {
				source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
			}
			if (evaluate) {
				source += "';\n" + evaluate + "\n__p+='";
			}
			index = offset + match.length;
			return match;
		});
		source += "';\n";

		// If a variable is not specified, place data values in local scope.
		if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

		source = "var __t,__p='',__j=Array.prototype.join," +
			"print=function(){__p+=__j.call(arguments,'');};\n" +
			source + "return __p;\n";

		try {
			render = new Function(settings.variable || 'obj', '_escape', source);
		} catch (e) {
			e.source = source;
			throw e;
		}

		if (data) return render(data, _escape);
		var template = function(data) {
			return render.call(this, data, _escape);
		};

		// Provide the compiled function source as a convenience for precompilation.
		template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

		return template;
	};

})(jQuery);
