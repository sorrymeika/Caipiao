define('views/f15c5Buy',['zepto','ui/sl','util','app','views/loading','views/buy'],function(require,exports,module) {
    var $=require('zepto'),
        sl=require('ui/sl'),
        app=require('app'),
        util=require('util'),
        Loading=require('views/loading'),
        Buy=require('views/buy');

    module.exports=Buy.extend({
        GameID: '90015',
        title: '15选5投注',
        BetDataKey: 'f15c5BetData',
        backUrl: '/f15c5.html',
        types: [{
            type: '00|01',
            name: '单式',
            total: '1',
            balls: '$5',
            red: '$0'
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
    });
});

