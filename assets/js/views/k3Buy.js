define('views/k3Buy',['zepto','ui/sl','util','app','views/loading','views/buy'],function(require,exports,module) {
    var $=require('zepto'),
        sl=require('ui/sl'),
        app=require('app'),
        util=require('util'),
        Loading=require('views/loading'),
        Buy=require('views/buy');

    module.exports=Buy.extend({
        GameID: '35004',
        title: '快3选号',
        BetDataKey: 'k3BetData',
        backUrl: '/k3.html',
        types: [{
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
        }]
    });
});

