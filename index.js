var esprima = require('esprima');
var assert = require('assert');

module.exports = function (code) {
    if (!code) return void 0;
    var ast = esprima.parse('(' + code + ')', {
        attachComment: false,
        range: false,
        loc: false,
        tolerant: false
    });

    assert.equal(ast.type, 'Program');
    assert.equal(ast.body.length, 1);
    assert.equal(ast.body[0].type, 'ExpressionStatement');

    var expression = ast.body[0].expression;
    var str = JSON.stringify(expression);
    var isMalformed = /FunctionExpression|CallExpression|VariableDeclaration/.test(str);
    if (isMalformed) throw new Error('malformed JSON');
    // an safer eval
    var ev = eval;
    return function() {/*use strict*/ return ev('(' + code + ')')}()
}
