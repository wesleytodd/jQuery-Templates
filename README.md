# jQuery Templates

A direct rip-off of Underscore templates.  I copied everything, including the unit tests.  See the [Underscore documentation](http://documentcloud.github.com/underscore/#template) for more information.

## Example

```javascript
var compiled = $.template("hello: <%= name %>");
compiled({name : 'moe'});
=> "hello: moe"

var list = "<% _.each(people, function(name) { %> <li><%= name %></li> <% }); %>";
$.template(list, {people : ['moe', 'curly', 'larry']});
=> "<li>moe</li><li>curly</li><li>larry</li>"

var template = $.template("<b><%- value %></b>");
template({value : '<script>'});
=> "<b>&lt;script&gt;</b>"

var compiled = $.template("<% print('Hello ' + epithet); %>");
compiled({epithet: "stooge"});
=> "Hello stooge."

## Why?

I have often wanted to use some nice templates in my jQuery code.  The "official" templates that were to be included with jQuery were deprecated, and including two libraries with similar functionality is not good practice.  

## Tests

Run:

	npm install
	grunt server

Then go to `http://localhost:8000/test`.
