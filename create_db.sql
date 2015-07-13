CREATE DATABASE `crawl_ajk` /*!40100 DEFAULT CHARACTER SET utf8 */;

CREATE TABLE `comms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) DEFAULT NULL COMMENT '小区唯一ID号',
  `url` varchar(300) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL COMMENT '名称',
  `address` varchar(300) DEFAULT NULL COMMENT '地址',
  `lat` double DEFAULT NULL COMMENT '纬度',
  `lon` double DEFAULT NULL COMMENT '经度',
  `dev` varchar(200) DEFAULT NULL COMMENT '开发商',
  `pm_name` varchar(200) DEFAULT NULL COMMENT '物业公司',
  `pm_type` varchar(100) DEFAULT NULL COMMENT '物业类型',
  `pm_fee` double DEFAULT NULL COMMENT '物业费用',
  `total_area` double DEFAULT NULL COMMENT '总建面',
  `houses` int(11) DEFAULT NULL COMMENT '总户数',
  `build_time` datetime DEFAULT NULL COMMENT '建造年代',
  `plot_ratio` double DEFAULT NULL COMMENT '容积率',
  `o_rate` double DEFAULT NULL COMMENT '出租率：0.8',
  `parking` int(11) DEFAULT NULL COMMENT '停车位数量',
  `district` varchar(200) DEFAULT NULL COMMENT '区域名称： 朝阳 亚运村小营',
  `g_rate` double DEFAULT NULL COMMENT '绿化率:0.367',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8 COMMENT='	';


CREATE TABLE `comm_sells` (
  `hid` varchar(100) NOT NULL COMMENT '售房ID',
  `url` varchar(300) DEFAULT NULL,
  `total_price` double DEFAULT NULL COMMENT '售价',
  `price` double DEFAULT NULL,
  `d_payment` double DEFAULT NULL COMMENT '首付（元）',
  `m_payment` double DEFAULT NULL COMMENT '月供',
  `cid` int(11) DEFAULT NULL COMMENT '小区ID',
  `h_type` varchar(300) DEFAULT NULL COMMENT '房型',
  `area` double DEFAULT NULL COMMENT '面积',
  `dir` varchar(45) DEFAULT NULL COMMENT '朝向',
  `floor` varchar(45) DEFAULT NULL COMMENT '楼层',
  `decoration` varchar(45) DEFAULT NULL COMMENT '装修',
  `type` varchar(45) DEFAULT NULL COMMENT '房屋类型（普通住宅）',
  `de` longtext COMMENT '房源描述',
  `tags` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`hid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `comm_prices` (
  `cid` int(11) NOT NULL,
  `time` datetime NOT NULL COMMENT '时间',
  `price` double DEFAULT NULL COMMENT '价格',
  PRIMARY KEY (`cid`,`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

