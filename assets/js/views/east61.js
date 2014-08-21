define('views/east61',['zepto','ui/sl','app','views/loading','util'],function (require,exports,module) {
    var $=require('zepto'),
        sl=require('ui/sl'),
        app=require('app'),
        util=require('util'),
        Loading=require('views/loading');

    module.exports=sl.Activity.extend({
        events: {
            'tap .J_Back': 'back',
            'tap .ballPool.red .bd em': 'selectRed',
            'tap .ballPool.blue .bd em': 'selectBlue',
            'tap .J_Buy': "buy",
            'tap .J_Clear': 'clear',
            'tap .J_Random': 'random',
            'tap .J_RandomRed': 'randomRed',
            'tap .J_RandomBlue': 'randomBlue'
        },

        buy: function () {
            var that=this,
                betData="",
                flag=true,
                type='01',
                blues=that.$blue.filter('.curr'),
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

            if(!flag||blues.length<1) {
                sl.tip("请至少选择一注");
                return;
            }

            if(type=='01'&&blues.length==1) {
                betData="00|01|0001|"+codes;
            } else {
                betData="00|02|0001|"+codes02;
                betData+=util.pad(blues.length);

            }
            blues.each(function () {
                betData+=util.pad($(this).attr('data-code'),2);
            });

            console.log(betData);

            if(localStorage.east61BetData)
                localStorage.east61BetData+='#'+betData;
            else
                localStorage.east61BetData=betData;

            that.to('/east61Buy.html');
        },
        random: function () {
            this.randomRed();
            this.randomBlue();
        },
        randomRed: function () {
            var that=this;

            that.$red.find('em.curr').removeClass('curr');

            if(that.redTimer) {
                clearInterval(that.redTimer);
            }

            var i=6;
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
        randomBlue: function () {
            var that=this;

            var num=Math.round(Math.random()*11);
            that.$blue.removeClass('curr').eq(num).addClass('curr');
        },
        clear: function () {
            this.$('.ballPool.red .bd em.curr,.ballPool.blue .bd em.curr').removeClass('curr');
        },
        selectRed: function (e) {
            var $target=$(e.currentTarget);
            $target.toggleClass('curr');
        },
        selectBlue: function (e) {
            $(e.currentTarget).toggleClass('curr');
        },
        template: 'views/east61.html',
        onCreate: function () {
            var that=this,
                html="<li>";

            for(var i=0;i<=9;i++) {
                html+='<p><em data-red="'+i+'">'+i+'</em></p>';
                if((i+1)%8==0) { html+="</li><li>"; }
            }
            that.$('.J_RedList').append(html+"</li>");

            html="<li>";

            var arr='鼠 牛 虎 兔 龙 蛇 马 羊 猴 鸡 狗 猪'.split(' ');

            that.arr=arr;

            for(var i=1;i<=12;i++) {
                html+='<p><em data-code="'+i+'">'+arr[i-1]+'</em></p>';
                if(i%8==0) { html+="</li><li>"; }
            }
            that.$('.J_BlueList').append(html+"</li>");

            that.$blue=that.$('.ballPool.blue .bd em');
            that.$red=that.$('.J_RedList');

            that.$el.loading('load',{
                url: '/api/CPService/QueryGameXspar/?ct=json&gameid=90016&wagerissue=',
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
