define('views/3dBuy',['zepto','ui/sl','util','app','views/loading','views/buy'],function(require,exports,module) {
    var $=require('zepto'),
        sl=require('ui/sl'),
        app=require('app'),
        util=require('util'),
        Loading=require('views/loading'),
        Buy=require('views/buy');

    module.exports=Buy.extend({
        GameID: '10002',
        title: '3D投注',
        BetDataKey: 'threedDBetData',
        backUrl: '/3d.html',
        types: [{
            type: '01|01',
            name: '单式',
            total: '1',
            balls: '$3',
            red: '$0'
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
        }]
    });
});

