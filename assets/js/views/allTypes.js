﻿define('views/allTypes',['zepto','util'],function (require,exports,module) {
    var $=require('zepto'),
        util=require('util');

    var texts='鼠 牛 虎 兔 龙 蛇 马 羊 猴 鸡 狗 猪'.split(' '),
        east61Texts={};

    $.each(texts,function (i,text) {
        east61Texts[util.pad(i+1)]=text;
    });

    var types={
        t_10001: [{
            type: '00|01',
            name: '单式',
            total: '1',
            balls: '$6$1',
            red: '$0',
            blue: '$1'
        },{
            type: '00|02',
            name: '复式',
            total: '$C($0,$0-6)*$1',
            balls: '$',
            red: '$0',
            blue: '$1'
        },{
            type: '00|03',
            name: '胆拖',
            total: '$C($1,6-$0)*$2',
            balls: '$',
            red: '$0($1)',
            blue: '$2'
        }],
        t_10002: [{
            type: '01|01',
            name: '单式',
            total: '1',
            balls: '$3',
            red: '$0',
            maxTimes: 99
        },{
            type: '01|06',
            name: '复式',
            total: '$0*$1*$2',
            balls: '$',
            red: '$0($1)($2)'
        },{
            type: '02|01',
            name: '组3单式',
            total: '1',
            balls: '$3',
            red: '$0'
        },{
            type: '02|06',
            name: '组3复式',
            total: '$A($0,2)',
            balls: '$',
            red: '$0'
        },{
            type: '03|06',
            name: '组6',
            total: '$C($0,3)',
            balls: '$',
            red: '$0'
        }],
        t_90016: [{
            type: '00|01',
            name: '单式',
            total: '1',
            balls: '$6$1',
            red: '$0',
            blue: '$1',
            blueTextArray: east61Texts
        },{
            type: '00|02',
            name: '复式',
            total: '$0*$1*$2*$3*$4*$5*$6',
            balls: '$',
            red: '$0$1$2$3$4$5',
            blue: '$1',
            blueTextArray: east61Texts
        }],
        t_10003: [{
            type: '00|01',
            name: '单式',
            total: '1',
            balls: '$7',
            red: '$0'
        },{
            type: '00|02',
            name: '复式',
            total: '$C($0,$0-7)',
            balls: '$',
            red: '$0',
            blue: '$1'
        },{
            type: '00|03',
            name: '胆拖',
            total: '$C($1,7-$0)',
            balls: '$',
            red: '($0)$1'
        }],
        t_35004: [{
            type: '01|01',
            name: '和值',
            total: '1',
            balls: '$1',
            red: '$0'
        },{
            type: '01|02',
            name: '复式和值',
            total: '$0',
            balls: '$',
            red: '$0',
            blue: '$1'
        },{
            type: '03|01',
            name: '三同号单选',
            total: '1',
            balls: '$1',
            red: '$0'
        },{
            type: '02|01',
            name: '三同号通选',
            total: '1',
            balls: '$0',
            red: '通选'
        },{
            type: '05|01',
            name: '二同号单选',
            total: '1',
            balls: '$3',
            red: '$0'
        },{
            type: '05|02',
            name: '二同号复选',
            total: '1',
            balls: '$3',
            red: '$0'
        }],
        t_90015: [{
            type: '00|01',
            name: '单式',
            total: '1',
            balls: '$5',
            red: '$0',
            maxTimes: 99
        },{
            type: '00|02',
            name: '复式',
            total: '$C($0,$0-5)',
            balls: '$',
            red: '$0',
            blue: '$1'
        },{
            type: '00|03',
            name: '胆拖',
            total: '$C($1,5-$0)',
            balls: '$',
            red: '($0)$1'
        }]
    };

    return types;
});