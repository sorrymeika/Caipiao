define('views/user',['zepto','ui/sl','ui/tabs','app','views/loading'],function (require,exports,module) {
    var $=require('zepto'),
        sl=require('ui/sl'),
        app=require('app'),
        Loading=require('views/loading'),
        Tabs=require('ui/tabs');

    module.exports=sl.Activity.extend({
        template: 'views/user.html',
        events: {
            'tap .J_Back': 'back',
            'tap .J_List [data-id]': 'toOrder'
        },
        toOrder: function (e) {
            var orderid=$(e.currentTarget).attr('data-id');
            sl.common.orderInfo=this.orders['order_'+orderid];
            this.to('/order/'+orderid+".html");
        },
        onCreate: function () {
            var that=this;

            that.orders={};

            new Tabs(that.$('#main'),{
                data: [{
                    title: '账户余额',
                    url: '/api/AccService/QuerySubAccount?ct=json',
                    tmpl: 'account'
                },{
                    title: '投注记录',
                    url: '/api/CPService/QueryOrderRecords/?ct=json&gameid=&wagerissue=&begintime=&endtime=&pageindex=1&pagelen=10&winflag=',
                    tmpl: 'record'
                },{
                    title: '中奖记录',
                    url: '/api/CPService/QueryOrderRecords/?ct=json&gameid=&wagerissue=&begintime=&endtime=&pageindex=1&pagelen=10&winflag=true',
                    tmpl: 'win'
                }],
                onChange: function (e,content,data) {
                    content.loading({
                        check: function (res) {
                            return !!(res&&res.ReturnCode=="00000");
                        }
                    }).loading('load',{
                        url: data.url,
                        success: function (res) {
                            res.UserName=localStorage.UserName;

                            if(data.tmpl!='account') {
                                $.each(res.data,function (i,item) {
                                    that.orders['order_'+item.OrderID]=item;
                                });
                            }
                            content.html(that.tmpl(data.tmpl,res));
                        },
                        error: function (xhr) {
                            if(xhr.status==500||xhr.status==401) {
                                sl.tip('还未登录...');
                                this.msg('还未登录...');
                                setTimeout(function () {
                                    that.to('/login.html');
                                },1000);
                            } else
                                this.msg('网络错误');

                            //content.html(that.tmpl(data.tmpl,data.data));
                        },
                        refresh: function (res) {
                            content.append(that.tmpl(data.tmpl,res));
                        }
                    })
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