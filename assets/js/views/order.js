define('views/order',['zepto','util','ui/sl','ui/tabs','app','views/loading'],function (require,exports,module) {
    var $=require('zepto'),
        sl=require('ui/sl'),
        app=require('app'),
        util=require('util'),
        Loading=require('views/loading'),
        common=sl.common;

    module.exports=sl.Activity.extend({
        template: 'views/order.html',
        events: {
            'tap .J_Back': 'back'
        },
        onCreate: function () {
            var that=this,
                orderInfo=common.orderInfo,
                data=[],
                betData;

            console.log(orderInfo);

            $.each(orderInfo.BetData.split('#'),function (i,item) {
                betData=item.split('|');

                var itemData={
                    type: betData[1],
                    times: parseInt(betData[2]),
                    typeName: betData[1]=='01'?'单式':betData[1]=='02'?'复式':'胆拖'
                },
                replaceCode=function (codes) {
                    return codes.replace(/\d{2}/g,function (r) {
                        return r+"&nbsp;&nbsp;"
                    }).replace(/&nbsp;&nbsp;$/,'')
                };

                console.log(betData[1])

                if(betData[1]=='01') {
                    itemData.num=1;

                    itemData.red=betData[3].substr(0,10);
                    itemData.red=replaceCode(itemData.red);

                } else if(betData[1]=='02') {

                    var red=parseInt(betData[3].substr(0,2));

                    itemData.red=betData[3].substr(2,red*2);

                    itemData.num=util.C(red,red-5);
                    itemData.red=replaceCode(itemData.red);

                } else {

                    var red=parseInt(betData[3].substr(0,2)),
                            red1=parseInt(betData[3].substr(red*2+2,2));

                    itemData.red=betData[3].substr(2,red*2);
                    itemData.red1=betData[3].substr(red*2+4,red1*2);

                    itemData.red='('+replaceCode(itemData.red)+')'+replaceCode(itemData.red1);

                    itemData.num=util.C(red1,7-red);
                }

                data.push(itemData);
            });

            orderInfo.codes=data;

            that.$('#main').html(that.tmpl('order',orderInfo));

            that.$el.loading('load',{
                url: '/api/CPService/QueryLotteryAnnouncement/?ct=json&gameid='+orderInfo.GameID+'&wagerissue='+orderInfo.WagerIssue+'&qsnum=1',
                success: function (res) {
                    console.log(res);
                },
                error: function () {
                    this.hide();
                }
            });

        },
        onStart: function () {
        },
        onResume: function () {
        },
        onDestory: function () {
        }
    });
});
