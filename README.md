loose-json
-------

a very loose yet safe json parser.

Typically, JSON literally should follow a very strict set of rules:

- all the keys and strings must be surrounded with double quotes.
- trailing comma is not allowed.

It is very easy to break the law if we write the JSON object as config file without IDE syntax checker. If you want to let your user utilize JSON as configuration object and wont expect JSON syntax annoying them, __loose-json__ is just what you want.

Here is the example:

```
var parse = require('loose-json');
var x = parse("{abc: 'hello'}"); // You dont have to use double quotes
console.log(JSON.stringify(x)); // {"abc": "hello"}

// comments are ok, it is safe enough
var x = parse(`
{
    a : [1, 2, 3], // comments here
    b : "//this is string"
}
`);
console.log(JSON.stringify(x)); // {"a":[1,2,3], "b": "//this is string"}

// no problem with literal
var x = parse('true');
assert.equal(x, true);; // passed
```

License
----
MIT
