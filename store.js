/**
 * Created by ตุ on 2015/7/12.
 */
var _ = require('underscore');
var conf = require('./config');
var mysql = require('mysql');
var connection = mysql.createConnection(conf.mysqlConnection);
connection.config.queryFormat = function (query, values) {
    if (!values) return query;
    return query.replace(/\:([_\w]+)/g, function (txt, key) {
        if (values.hasOwnProperty(key)) {
            return this.escape(values[key]);
        }
        return txt;
    }.bind(this));
};
connection.connect();

function saveSellHouseInfo(data) {
    var insertSellInfoSql = 'INSERT INTO comm_sells (hid,url,total_price,price,d_payment,m_payment,cid,h_type,area,dir,floor,decoration,type,de,tags) VALUES ' +
        '(:hid,:url,:total_price,:price,:d_payment,:m_payment,:cid,:h_type,:area,:dir,:floor,:decoration,:type,:de,:tags);';
    connection.query(insertSellInfoSql,data, function(err, rows, fields) {
        if (err) {
            console.error(err);
            console.error(this.sql);
        }
    });
}

function saveRentHouseInfo(data) {

}

function saveCommunityInfo(data) {
    var insertCommInfoSql = 'INSERT INTO comms ' +
        '(cid,url,name,address,lat,lon,dev,pm_name,pm_type,pm_fee,total_area,houses,build_time,plot_ratio,o_rate,parking,district,g_rate) VALUES ' +
        '(:cid,:url,:name,:address,:lat,:lon,:dev,:pm_name,:pm_type,:pm_fee,:total_area,:houses,:build_time,:plot_ratio,:o_rate,:parking,:district,:g_rate);';
    connection.query(insertCommInfoSql,data, function(err, rows, fields) {
        if (err) {
            console.error(err);
            console.error(this.sql);
        }
    });
}

function saveHistoryPrices(commId,historyPrices) {
    _.each(historyPrices, function (price,time) {
        _savePrice(commId,time,price);
    });
}

function _savePrice(commId,time,price) {
    connection.query('INSERT INTO comm_prices (cid,time,price) VALUES (:cid,:time,:price);',{cid:commId,time:time,price:price}, function(err, rows, fields) {
        if (err) {
            console.error(err);
            console.error(this.sql);
        }
    });
}
exports.connection = connection;
exports.saveCommInfo = saveCommunityInfo;
exports.saveSellInfo = saveSellHouseInfo;
exports.saveHistoryPrices = saveHistoryPrices;