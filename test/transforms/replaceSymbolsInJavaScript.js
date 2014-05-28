/*global describe, it*/
var unexpected = require('../unexpected-with-plugins'),
    AssetGraph = require('../../lib/'),
    uglifyJs = AssetGraph.JavaScript.uglifyJs;

describe('replaceSymbolsInJavaScript', function () {
    var expect = unexpected.clone().addAssertion('to come out as', function (expect, subject, value, done) {
        // subject.code, subject.defines
        expect(subject, 'to be an object');
        var assetConfig = {
            url: 'file://' + __dirname + '/bogus.js'
        };
        if (subject.parseTree instanceof uglifyJs.AST_Node) {
            assetConfig.parseTree = subject.parseTree;
        } else if (typeof subject.text === 'string') {
            assetConfig.text = subject.text;
        } else if (Buffer.isBuffer(subject.rawSrc)) {
            assetConfig.rawSrc = subject.rawSrc;
        }
        new AssetGraph()
            .loadAssets(new AssetGraph.JavaScript(assetConfig))
            .replaceSymbolsInJavaScript({type: 'JavaScript'}, subject.defines || {})
            .queue(function (assetGraph) {
                expect(assetGraph.findAssets({fileName: 'bogus.js'})[0], 'to have the same AST as', value);
            })
            .run(done);
    });

    it('should replace a primitive value', function (done) {
        expect({
            text: 'var bar = FOO;',
            defines: {
                FOO: '"foo"'
            }
        }, 'to come out as', function () {
            /* jshint ignore:start */
            var bar = 'foo';
            /* jshint ignore:end */
        }, done);
    });

    it('should not replace the LHS of an assignment', function (done) {
        expect({
            text: 'var FOO = "bar";',
            defines: {
                FOO: new uglifyJs.AST_String({value: 'foo'})
            }
        }, 'to come out as', 'var FOO = "bar";', done);
    });

    it('should replace complex value', function (done) {
        expect({
            text: 'var bar = FOO;',
            defines: {
                FOO: {quux: {baz: 123}}
            }
        }, 'to come out as', function () {
            /* jshint ignore:start */
            var bar = {quux: {baz: 123}};
            /* jshint ignore:end */
        }, done);
    });
});
