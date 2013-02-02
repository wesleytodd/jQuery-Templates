describe('template', function() {
	
	it('can do basic attribute interpolation', function() {
		var basicTemplate = $.template("<%= thing %> is gettin' on my noives!");
		var result = basicTemplate({thing : 'This'});
		expect(result).to.be("This is gettin' on my noives!");
	});

	it('sans semicolon template', function() {
		var sansSemicolonTemplate = $.template("A <% this %> B");
		expect(sansSemicolonTemplate()).to.be("A  B");
	});

	it('backslash template', function() {
		var backslashTemplate = $.template("<%= thing %> is \\ridanculous");
		expect(backslashTemplate({thing: 'This'})).to.be("This is \\ridanculous");
	});

	it('can handle slash escapes in interpolations', function() {
		var escapeTemplate = $.template('<%= a ? "checked=\\"checked\\"" : "" %>');
		expect(escapeTemplate({a: true})).to.be('checked="checked"');
	});

	it('can run arbitrary javascript in templates', function() {
		var fancyTemplate = $.template("<ul><% \
			for (var key in people) { \
		%><li><%= people[key] %></li><% } %></ul>");
		var result = fancyTemplate({people : {moe : "Moe", larry : "Larry", curly : "Curly"}});
		expect(result).to.be("<ul><li>Moe</li><li>Larry</li><li>Curly</li></ul>");
	});

	it('can use escaped characters (e.g. \\n) in Javascript', function() {
		var escapedCharsInJavascriptTemplate = $.template("<ul><% $.each(numbers.split('\\n'), function(key, item) { %><li><%= item %></li><% }) %></ul>");
		var result = escapedCharsInJavascriptTemplate({numbers: "one\ntwo\nthree\nfour"});
		expect(result).to.be("<ul><li>one</li><li>two</li><li>three</li><li>four</li></ul>");
	});

	it('name collision template', function() {
		var namespaceCollisionTemplate = $.template("<%= pageCount %> <%= thumbnails[pageCount] %> <% $.each(thumbnails, function(key, p) { %><div class=\"thumbnail\" rel=\"<%= p %>\"></div><% }); %>");
		var result = namespaceCollisionTemplate({
			pageCount: 3,
			thumbnails: {
				1: "p1-thumbnail.gif",
				2: "p2-thumbnail.gif",
				3: "p3-thumbnail.gif"
			}
		});
		expect(result).to.be("3 p3-thumbnail.gif <div class=\"thumbnail\" rel=\"p1-thumbnail.gif\"></div><div class=\"thumbnail\" rel=\"p2-thumbnail.gif\"></div><div class=\"thumbnail\" rel=\"p3-thumbnail.gif\"></div>");
	});

	it('no interpolate template', function() {
		var noInterpolateTemplate = $.template("<div><p>Just some text. Hey, I know this is silly but it aids consistency.</p></div>");
		var result = noInterpolateTemplate();
		expect(result).to.be("<div><p>Just some text. Hey, I know this is silly but it aids consistency.</p></div>");
	});

	it('quote template', function() {
		var quoteTemplate = $.template("It's its, not it's");
		expect(quoteTemplate({})).to.be("It's its, not it's");
	});

	it('quote in statement and body', function() {
		var quoteInStatementAndBody = $.template("<%\
			if(foo == 'bar'){ \
			%>Statement quotes and 'quotes'.<% } %>");
		expect(quoteInStatementAndBody({foo: "bar"})).to.be("Statement quotes and 'quotes'.");
	});

	it('new line and tabs', function() {
		var withNewlinesAndTabs = $.template('This\n\t\tis: <%= x %>.\n\tok.\nend.');
		expect(withNewlinesAndTabs({x: 'that'})).to.be('This\n\t\tis: that.\n\tok.\nend.');
	});

	it('escape tags', function() {
		var template = $.template("<i><%- value %></i>");
		var result = template({value: "<script>"});
		expect(result).to.be('<i>&lt;script&gt;</i>');
	});

	it('reference this', function() {
		var stooge = {
			name: "Moe",
			template: $.template("I'm <%= this.name %>")
		};
		expect(stooge.template()).to.be("I'm Moe");
	});

	it('load html templates', function() {
		var fromHTML = $.template($('#template').html());
		expect(fromHTML({data : 12345}).replace(/\s/g, '')).to.be('<li>24690</li>');
	});

	it('change template settings', function() {
		var templateSettings = {
			evaluate    : /\{\{([\s\S]+?)\}\}/g,
			interpolate : /\{\{=([\s\S]+?)\}\}/g
		};

		var custom = $.template("<ul>{{ for (var key in people) { }}<li>{{= people[key] }}</li>{{ } }}</ul>", null, templateSettings);
		var result = custom({people : {moe : "Moe", larry : "Larry", curly : "Curly"}});
		expect(result).to.be("<ul><li>Moe</li><li>Larry</li><li>Curly</li></ul>");

		var customQuote = $.template("It's its, not it's", null, templateSettings);
		expect(customQuote({})).to.be("It's its, not it's");

		var quoteInStatementAndBody = $.template("{{ if(foo == 'bar'){ }}Statement quotes and 'quotes'.{{ } }}", null, templateSettings);
		expect(quoteInStatementAndBody({foo: "bar"})).to.be("Statement quotes and 'quotes'.");
	});

	it('change template settings again', function() {
		var templateSettings = {
			evaluate    : /<\?([\s\S]+?)\?>/g,
			interpolate : /<\?=([\s\S]+?)\?>/g
		};

		var customWithSpecialChars = $.template("<ul><? for (var key in people) { ?><li><?= people[key] ?></li><? } ?></ul>", null, templateSettings);
		var result = customWithSpecialChars({people : {moe : "Moe", larry : "Larry", curly : "Curly"}});
		expect(result).to.be("<ul><li>Moe</li><li>Larry</li><li>Curly</li></ul>");

		var customWithSpecialCharsQuote = $.template("It's its, not it's", null, templateSettings);
		expect(customWithSpecialCharsQuote({})).to.be("It's its, not it's");

		var quoteInStatementAndBody = $.template("<? if(foo == 'bar'){ ?>Statement quotes and 'quotes'.<? } ?>", null, templateSettings);
		expect(quoteInStatementAndBody({foo: "bar"})).to.be("Statement quotes and 'quotes'.");
	});

	it('change template setting one more time', function() {
		var templateSettings = {
			interpolate : /\{\{(.+?)\}\}/g
		};

		var mustache = $.template("Hello {{planet}}!", null, templateSettings);
		expect(mustache({planet : "World"})).to.be("Hello World!");

		var templateWithNull = $.template("a null undefined {{planet}}", null, templateSettings);
		expect(templateWithNull({planet : "world"})).to.be("a null undefined world");

	});

	it('$.template provides the generated function source, when a SyntaxError occurs', function() {
		try {
			$.template('<b><%= if x %></b>');
		} catch (ex) {
			var source = ex.source;
		}
		expect(/__p/.test(source)).to.be.ok();
	});

	it('$.template handles \\u2028 & \\u2029', function() {
		var tmpl = $.template('<p>\u2028<%= "\\u2028\\u2029" %>\u2029</p>');
		expect(tmpl()).to.be('<p>\u2028\u2028\u2029\u2029</p>');
	});

	it('$.templateSettings.variable', function() {
		var s = '<%=data.x%>';
		var data = {x: 'x'};
		expect($.template(s, data, {variable: 'data'})).to.be('x');
		$.templateSettings.variable = 'data';
		expect($.template(s)(data)).to.be('x');
		delete $.templateSettings.variable;
	});

	it('$.templateSettings is unchanged by custom settings.', function() {
		expect($.templateSettings.variable).to.not.be.ok();
		$.template('', {}, {variable: 'x'});
		expect($.templateSettings.variable).to.not.be.ok();
	});

	it('undefined template variables.', function() {
		var template = $.template('<%=x%>');
		expect(template({x: null})).to.be('');
		expect(template({x: undefined})).to.be('');

		var templateEscaped = $.template('<%-x%>');
		expect(templateEscaped({x: null})).to.be('');
		expect(templateEscaped({x: undefined})).to.be('');

		var templateWithProperty = $.template('<%=x.foo%>');
		expect(templateWithProperty({x: {} })).to.be('');
		expect(templateWithProperty({x: {} })).to.be('');

		var templateWithPropertyEscaped = $.template('<%-x.foo%>');
		expect(templateWithPropertyEscaped({x: {} })).to.be('');
		expect(templateWithPropertyEscaped({x: {} })).to.be('');
	});

	it('interpolate evaluates code only once.', function() {
		var count = 0;
		var template = $.template('<%= f() %>');
		template({f: function(){ expect(!(count++)).to.be.ok(); }});
		expect(count).to.be(1);

		var countEscaped = 0;
		var templateEscaped = $.template('<%- f() %>');
		templateEscaped({f: function(){ expect(!(countEscaped++)).to.be.ok(); }});
		expect(countEscaped).to.be(1);
	});

	it('$.template settings are not modified.', function() {
		var settings = {};
		$.template('', null, settings);
		expect(settings).to.be.eql({});
	});

	it('delimeters are applied to unescaped text.', function() {
		var template = $.template('<<\nx\n>>', null, {evaluate: /<<(.*?)>>/g});
		expect(template()).to.be('<<\nx\n>>');
	});

});
