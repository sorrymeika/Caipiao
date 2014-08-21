define('views/3d',['zepto','ui/sl','app','views/loading','util'],function (require,exports,module) {
    var $=require('zepto'),
        sl=require('ui/sl'),
        app=require('app'),
        util=require('util'),
        Loading=require('views/loading');

    module.exports=sl.Activity.extend({
        events: {
            'tap .J_Back': 'back',
            'tap .ballPool.red .bd em': 'selectRed',
            'tap .J_Buy': "buy",
            'tap .J_Clear': 'clear',
            'tap .J_Random': 'random',
            'tap .J_RandomRed': 'randomRed'
        },

        buy: function () {
            var that=this,
                betData="",
                flag=true,
                type='01',
                codes='',
                codes02='';

            that.$red.each(function () {
                var $items=$(this).find('em.curr');

                if($items.length==0) {
                    flag=false;
                } else if($items.length>1) {
                    type='02';
                }

                codes02+=util.pad($items.length,2);
                $items.each(function () {
                    codes+=util.pad(this.innerHTML,2);
                    codes02+=util.pad(this.innerHTML,2);
                });
            });

            if(!flag) {
                sl.tip("请至少选择一注");
                return;
            }

            if(type=='01') {
                betData="01|01|0001|"+codes;
            } else {
                betData="01|02|0001|"+codes02;

            }

            console.log(betData);

            if(localStorage.threedDBetData)
                localStorage.threedDBetData+='#'+betData;
            else
                localStorage.threedDBetData=betData;

            that.to('/3dBuy.html');
        },
        random: function () {
            this.randomRed();
        },
        randomRed: function () {
            var that=this;

            that.$red.find('em.curr').removeClass('curr');

            if(that.redTimer) {
                clearInterval(that.redTimer);
            }

            var i=3;
            that.redTimer=setInterval(function () {

                var num=Math.round(Math.random()*8);

                console.log(i,num);

                if(!that.$red.eq(i-1).find('em').eq(num).hasClass('curr')) {
                    that.$red.eq(i-1).find('em').eq(num).addClass('curr');
                    i--;
                }

                if(i<=0) {
                    clearInterval(that.redTimer);
                    that.redTimer=null;
                }

            },100);

        },
        clear: function () {
            this.$('.ballPool.red .bd em.curr').removeClass('curr');
        },
        selectRed: function (e) {
            var $target=$(e.currentTarget);
            $target.toggleClass('curr');
        },
        selectBlue: function (e) {
            $(e.currentTarget).toggleClass('curr');
        },
        template: 'views/3d.html',
        onCreate: function () {
            var that=this,
                html="<li>";

            for(var i=0;i<=9;i++) {
                html+='<p><em data-red="'+i+'">'+i+'</em></p>';
                if((i+1)%8==0) { html+="</li><li>"; }
            }
            that.$('.J_RedList').append(html+"</li>");

            html="<li>";

            that.$red=that.$('.J_RedList');

            that.$el.loading('load',{
                url: '/api/CPService/QueryGameXspar/?ct=json&gameid=10002&wagerissue=',
                success: function (res) {

                    that.$('.js_curPhase').html(res.Data[0].WagerIssue);
                    var endTime=new Date(res.Data[0].DrawEndTime.replace(/T|\:/,'-').split('-')),
                        leftTime=(endTime-new Date())/1000;

                    if(leftTime<0) {
                        that.$('.js_leftTime').html("投注已结束");
                        that.isOver=true;

                    } else {
                        that.$('.js_leftTime').html("投注剩余"+that.parseTime(leftTime));

                        that.interval=setInterval(function () {
                            leftTime--;
                            if(leftTime<=0) {
                                that.isOver=true;
                                that.$('.js_leftTime').html("投注已结束");
                                clearInterval(that.interval);
                                that.interval=null;
                            } else
                                that.$('.js_leftTime').html("投注剩余"+that.parseTime(leftTime));

                        },1000);
                    }
                },
                error: function (xhr) {
                    if(xhr.status==500||xhr.status==401) {
                        this.msg('还未登录...');
                        setTimeout(function () {
                            that.to('/login.html');
                        },1000);
                    } else
                        this.msg('网络错误');
                }
            });
        },
        parseTime: function (s) {
            var h=Math.floor(s/(60*60));
            s=s-h*60*60;
            m=Math.floor(s/60);
            s=Math.floor(s-m*60);

            return h+"时"+m+"分"+s+"秒";
        },
        onStart: function () {
        },
        onResume: function () {
            this.clear();
        },
        onDestory: function () {
            this.interval&&clearInterval(this.interval);
        }
    });
});
