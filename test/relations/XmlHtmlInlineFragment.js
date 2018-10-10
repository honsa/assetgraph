const pathModule = require('path');
/*global describe, it*/
const expect = require('../unexpected-with-plugins');
const AssetGraph = require('../../lib/AssetGraph');

describe('relations/XmlHtmlInlineFragment', function() {
  it('should handle a test case with an RSS feed with a <description> tag', async function() {
    const assetGraph = new AssetGraph({
      root: pathModule.resolve(
        __dirname,
        '../../testdata/relations/XmlHtmlInlineFragment/'
      )
    });
    await assetGraph.loadAssets('index.html');
    await assetGraph.populate();

    expect(assetGraph, 'to contain assets', 4);
    expect(assetGraph, 'to contain assets', 'Html', 2);
    expect(assetGraph, 'to contain assets', 'Rss', 1);
    expect(assetGraph, 'to contain assets', 'Png', 1);
    expect(assetGraph, 'to contain relation', 'XmlHtmlInlineFragment');

    const rss = assetGraph.findAssets({ type: 'Rss' })[0];
    const fragmentRelation = assetGraph.findRelations({
      type: 'XmlHtmlInlineFragment'
    })[0];

    expect(
      fragmentRelation.to.text,
      'to equal',
      'Here is some text containing an interesting description and an image: <img src="foo.png">.'
    );

    assetGraph.findAssets({ type: 'Png' })[0].fileName = 'bar.png';

    expect(
      fragmentRelation.to.text,
      'to equal',
      'Here is some text containing an interesting description and an image: <img src="bar.png">.'
    );
    expect(
      rss.text,
      'to equal',
      '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n <title>RSS Title</title>\n <description>This is an example of an RSS feed</description>\n <lastBuildDate>Mon, 06 Sep 2010 00:01:00 +0000 </lastBuildDate>\n <pubDate>Mon, 06 Sep 2009 16:20:00 +0000 </pubDate>\n <ttl>1800</ttl>\n <item>\n  <title>Example entry</title>\n  <description>Here is some text containing an interesting description and an image: &lt;img src="bar.png"&gt;.</description>\n  <link>http://www.wikipedia.org/</link>\n  <guid>unique string per item</guid>\n  <pubDate>Mon, 06 Sep 2009 16:20:00 +0000 </pubDate>\n </item>\n</channel>\n</rss>\n'
    );
  });
});
