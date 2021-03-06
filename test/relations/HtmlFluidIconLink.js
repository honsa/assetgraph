const pathModule = require('path');
/*global describe, it*/
const expect = require('../unexpected-with-plugins');
const AssetGraph = require('../../lib/AssetGraph');

describe('relations/HtmlFluidIconLink', function() {
  it('should handle a test case with an existing <link rel="fluid-icon"> element', async function() {
    const assetGraph = new AssetGraph({
      root: pathModule.resolve(
        __dirname,
        '../../testdata/relations/HtmlFluidIconLink/'
      )
    });
    await assetGraph.loadAssets('index.html');
    await assetGraph.populate();

    expect(assetGraph, 'to contain relation', 'HtmlFluidIconLink');
    expect(assetGraph, 'to contain asset', 'Png');
  });
});
