var esprima = require('esprima'); // i would remove esprima some day
// i dont want to introduce another lib here
var assert = {
    equal: function (a, b) {
        if (a !== b) throw Error(a + ' not equal ' + b);
    }
};

module.exports = function (code) {
    try {
        var j = JSON.parse(code);
        return j;
    } catch (e) {
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
}
