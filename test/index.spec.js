require('blanket')({
    pattern: 'index',
    "data-cover-never": ['node_modules', 'test']
});
var parse = require('..');
var assert = require('assert');
it('should parse loose', function () {
    var x = parse(`
    {
        name: "jack"
    }
    `);

    assert.deepEqual(x, {name: 'jack'});
});

it('should throw error on evil code', function () {
    assert.throws(() => parse(`
    {
        name: require('path')
    }
    `));
});

it('should throw error if defining function', function () {
    assert.throws(() => parse(`
    {
        name: function() {}
    }
    `));
});

it('should parse literal', function () {
    var x = parse('[1,2,4,45]');
    assert.deepEqual([1, 2 ,4 ,45] ,x);

    var x = parse('"hello"');
    assert.equal('hello', x);

    assert.throws(() => parse('ev'));

    assert.equal(123, parse('123'));
    assert.equal(true, parse('true'));
    assert.equal(false, parse('false'));
    assert.equal(0, parse('0'));
    assert.equal(null, parse('null'));
    assert.equal(void 0, parse('void 0'));

});

it('should allow comments', function() {
    var x = parse(`
    {
        /* hello world*/
        name: "jack" // comment here
    }
    `);

    assert.deepEqual(x, {name: 'jack'});

});

it('empty string parse should throw', function () {
    assert.throws(function() {
        parse('');
    });
});

it('variable is not allowed', function () {
    assert.throws(function(){
        var x = parse('process');
    });
    assert.throws(function(){
        parse('undefined');
    });
});
