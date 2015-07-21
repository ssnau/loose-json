var esprima = require('esprima'); // i would remove esprima some day
// i dont want to introduce another lib here
var assert = {
    equal: function (a, b) {
        if (a !== b) throw Error(a + ' not equal ' + b);
    }
};

function replaceAll(find, replace, str) {
      return str.replace(new RegExp(find, 'g'), replace);
}

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
        // Identifier: 不能有变量引用
        // FE, CF: 不能有函数声明和函数调用
        // VD: 不能有变量声明
        var isMalformed = /FunctionExpression|CallExpression|VariableDeclaration/.test(str);
        var str2 = replaceAll('{"type":"Property","key":{"type":"Identifier"', '', str);
        isMalformed = isMalformed || /Identifier/.test(str2);
        if (isMalformed) throw new Error('malformed JSON');
        // an safer eval
        var ev = eval;
        return function() {/*use strict*/ return ev('(' + code + ')')}()
    }
}
