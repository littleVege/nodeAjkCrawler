/**
 * Created by ตุ on 2015/7/12.
 */
var _ = require('underscore');
var url = require('url');
var store = require('./store');

function parseCommList(crawler,result,$) {
    var $content = $('#content');
    var $list = $content.find('.mainListing .list .list_item');
    $list.each(function (idx, item) {
        var $item = $(item);
        var $title = $item.find('.details .t_b .t');
        var u = $title.attr('href');
        u = url.resolve(result.uri,u);
        crawler.queue(u);
    });
    var $pagi = $('.listPager .multi-page');
    var $pageList = $pagi.find('a');
    $pageList.each(function (idx, item) {
        var $item = $(item);
        var pageu = $item.attr('href');
        pageu = url.resolve(result.uri,pageu);
        crawler.queue(pageu);
    });
}

function parseCommInfo(crawler,result,$) {
    var data = {};
    var currentUrl = result.uri;
    var cid = +currentUrl.match(/view\/(\d+)\?*/)[1];

    data['cid'] = cid;
    data['url'] = currentUrl;
    var $details = $('.comm-list');
    //parse left detail panel
    var $detailLContents = $details.find('.comm-l-detail dd');
    data['name'] = $detailLContents.eq(0).text();
    data['district'] = $detailLContents.eq(1).text();
    data['district'] && (data['district'] = data['district'].trim());
    data['address'] = $detailLContents.eq(2).text();
    var latlon = _resolveLatLon($detailLContents);
    data['lat'] = latlon.lat;
    data['lon'] = latlon.lon;
    data['dev'] = $detailLContents.eq(3).text();
    data['pm_name'] = $detailLContents.eq(4).text();
    data['pm_type'] = $detailLContents.eq(5).text();
    data['pm_fee'] = _resolveNum($detailLContents.eq(6).text());

    //parse right detail panel
    var $detailRContents = $details.find('.comm-r-detail dd');
    data['total_area'] = _resolveNum($detailRContents.eq(0).text());
    data['houses'] = _resolveNum($detailRContents.eq(1).text());
    data['build_time'] = _resolveDate($detailRContents.eq(2).text());
    data['plot_ratio'] = _resolveNum($detailRContents.eq(3).text());
    data['o_rate'] = (_resolveNum($detailRContents.eq(4).text()));
    data['parking'] = _resolveNum($detailRContents.eq(5).text());
    data['g_rate'] = (_resolveNum($detailRContents.eq(6).text()));

    store.saveCommInfo(data);
    var historyPrices = _resolveHistoryPrices(result,$);
    store.saveHistoryPrices(cid,historyPrices);

    _queueSellList(crawler,result, $,cid);
}

function _resolveLatLon($detailLContents) {
    var $link = $detailLContents.find('.comm-icon');
    var u = $link.attr('href');
    try {
        var hash = u.match(/#.+/ig)[0];
        var lat = hash.match(/l1=([\d.]+)&/)[1];
        var lon = hash.match(/l2=([\d.]+)&/)[1];
        return {lat:lat,lon:lon};
    } catch(e) {
        return {lat:0,lon:0};
    }
}

function _resolveNum(content) {
    try {
        return + content.match(/[\d.]+/)[0];
    } catch(e) {
        return -1;
    }
}

function _resolveDate(content) {
    if (/[\d\-\_]+/.test(content)) {
        return new Date(content);
    }
    return new Date('1849-01');
}

function _resolveHistoryPrices(result,$) {
    var prices = {};
    var $scripts = $('script');
    $scripts.each(function(idx,item) {
        var $item = $(item);
        var content = $item.text();
        if (/community\s*:\s*\[(.+)\],/ig.test(content)) {
            var commPricesStr = content.match(/community\s*:\s*\[(.+)\],/ig)[0];
            commPricesStr = commPricesStr.replace(/(community\s*:\s*)|,$/g,'');
            var commPrices = JSON.parse(commPricesStr);
            _.each(commPrices, function (item, idx, list) {
                for (var key in item) {
                    var val = item[key];
                    var year = key.substr(0,4);
                    var month = key.substr(4,6);
                    prices[year+'/'+month+'/'+'01'] = +val;
                }

            });
            return false;
        }
    });
    return prices;
}

function _queueSellList(crawler,result,$,commId) {
    var urlObj = url.parse(result.uri);
    var host = urlObj.host;
    var u = 'http://'+host+'/community/props/sale/'+commId+'/?from=baseinfopro';
    crawler.queue(u);
}

function parseHouseList(crawler,result,$) {
    var $houseList= $('.m-house-list .m-rent-house');
    $houseList.each(function(idx,item) {
        var $item = $(item);
        var $link = $item.children('a[_soj]');
        var u = url.resolve(result.uri,$link.attr('href'));
        crawler.queue(u);
    });

    var $pagi = $('.m-page .multi-page');
    var $pageLink = $pagi.find('a');
    $pageLink.each(function (idx, item) {
        var $item = $(item);
        var u = url.resolve(result.uri,$item.attr('href'));
        crawler.queue(u);
    });
}

function parseHouseInfo(result,$) {
    var data = {};
    data['url'] = result.uri;
    data['hid'] = result.uri.match(/A\d+/)[0];
    var $details = $('.phraseobox.cf');
    var $detailLList = $details.find('.litem .p_phrase');
    data['total_price'] = _resolveNum($detailLList.eq(0).find('dd').text());
    data['d_payment'] = _resolveNum($detailLList.eq(1).find('dd').text());
    data['m_payment'] = _resolveNum($detailLList.eq(2).find('dd').text());
    data['price'] = _resolveNum($detailLList.eq(3).find('dd').text());
    data['cid'] = _resolveCidFromHouseSellPage($detailLList.eq(4).find('dd'));

    var $detailRList = $details.find('.ritem .p_phrase');
    data['h_type'] = $detailRList.eq(0).find('dd').text();
    data['area'] = _resolveNum($detailRList.eq(1).find('dd').text());
    data['dir'] = $detailRList.eq(2).find('dd').text();
    data['floor'] = $detailRList.eq(3).find('dd').text();
    data['decoration'] = $detailRList.eq(4).find('dd').text();
    data['type'] = $detailRList.eq(5).find('dd').text().trim();
    data['de'] = $('#propContent').text();
    data['tags'] = _resolveTags($('#proLinks'),$);
    store.saveSellInfo(data);
}

function _resolveTags($item,$) {
    var tags = [];
    var $tagLinks = $item.find('p a');
    $tagLinks.each(function (idx, item) {
        var $item =$(item);
        tags.push($item.text());
    });
    var $tagSpans = $item.find('p span');
    $tagSpans.each(function (idx, item) {
        var $item =$(item);
        tags.push($item.text());
    });
    return tags.join(';');
}

function _resolveCidFromHouseSellPage($item) {
    var $link = $item.find('a').eq(0);
    var u = $link.attr('href');
    if (/view\/(\d+)/.test(u)) {
        return +u.match(/view\/(\d+)/)[1];
    }
    return 0;
}

exports.parseHouseInfo = parseHouseInfo;
exports.parseCommList = parseCommList;
exports.parseCommInfo = parseCommInfo;
exports.parseHouseList = parseHouseList;