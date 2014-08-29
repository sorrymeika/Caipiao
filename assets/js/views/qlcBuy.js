define('views/qlcBuy',['zepto','ui/sl','util','app','views/loading','views/buy'],function(require,exports,module) {
    var $=require('zepto'),
        sl=require('ui/sl'),
        app=require('app'),
        util=require('util'),
        Loading=require('views/loading'),
        Buy=require('views/buy');

    module.exports=Buy.extend({
        GameID: '10003',
        title: '七乐彩投注',
        BetDataKey: 'qlcBetData',
        backUrl: '/qlc.html',
        types: [{
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
        }]
    });
});

