/**
 * Created by µØ on 2015/7/12.
 */
var NodeCrawler = require('crawler');
var processor = require('./processor');
var crawler = new NodeCrawler({
    maxConnections : 2,
    skipDuplicates:true,
    // This will be called for each crawled page
    callback : function (error, result, $) {
        // $ is Cheerio by default
        //a lean implementation of core jQuery designed specifically for the server
        if(error) {
            console.error(error);
        } else {
            var title = $('title').text();
            var url = result.uri;

            console.log('current crawl\n%s£º%s\n',title,url);
            if (/prop\/view\/A\d+/.test(url)) {
                processor.parseHouseInfo(result,$);
            }
            if (/sale(\/[p\d]+\/)*/.test(url)) {
                processor.parseHouseList(crawler,result,$);
            }

            if (/community\/view\/\d+/.test(url)) {
                processor.parseCommInfo(crawler,result,$);
            }

            if (/community(\/W0QQpZ\d+)*/.test(url)) {
                processor.parseCommList(crawler,result,$);
            }
        }

    }
});
crawler.queue('http://beijing.anjuke.com/community/');