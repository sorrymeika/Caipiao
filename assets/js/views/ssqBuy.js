define('views/ssqBuy',['zepto','ui/sl','util','app','views/loading','views/buy'],function(require,exports,module) {
    var $=require('zepto'),
        sl=require('ui/sl'),
        app=require('app'),
        util=require('util'),
        Loading=require('views/loading'),
        Buy=require('views/buy');

    module.exports=Buy.extend({
        GameID: '10001',
        title: '双色球投注',
        BetDataKey: 'ssqBetData',
        backUrl: '/ssq.html',
        types: [{
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
        }]
    });
});
