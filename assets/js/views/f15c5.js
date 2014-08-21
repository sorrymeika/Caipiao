define('views/f15c5',['zepto','ui/sl','app','views/loading','util'],function (require,exports,module) {
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
            'tap .J_RandomRed': 'randomRed',
            'tap .J_Type': 'showType',
            'tap .J_Normal': 'showNormal',
            'tap .J_Hard': 'showHard'
        },
        showNormal: function () {
            var that=this,
                $target=that.$('.J_Normal');

            if(!$target.hasClass('curr')) {
                $target.addClass('curr').siblings('.curr').removeClass('curr');
                that.clear();
                that.$('.J_HardCont').hide();
                that.$('.J_MsgTitle').html('号码');
                that.$('.J_Msg').html('至少选择5个');
                $('.J_Random').show();
                that.showType();
            }
        },
        showHard: function () {
            var that=this,
                $target=that.$('.J_Hard');

            if(!$target.hasClass('curr')) {
                $target.addClass('curr').siblings('.curr').removeClass('curr');
                that.clear();
                that.$('.J_MsgTitle').html('胆码');
                that.$('.J_Msg').html('至少选择1个，最多选择4个');
                $('.J_Random').hide();
                $('.J_HardCont').show();
                that.showType();
            }
        },
        showType: function () {
            this.$('.J_Type,.J_TypeCon').toggleClass('visible');
            this.$('header').toggleClass('type_visible');
        },
        buy: function () {
            var that=this,
                betData="",
                reds=that.$red.filter('.curr');

            if(that.$('.J_Hard').hasClass('curr')) {
                var hards=that.$('.J_HardCont .J_RedList em.curr');

                if(reds.length+hards.length<=6) {
                    sl.tip("请至少选择一注");
                    return;
                }

                if(reds.length>4) {
                    sl.tip("胆码不能超过4个");
                    return;
                }

                betData="00|03|0001|"+util.pad(reds.length);
                reds.each(function () {
                    betData+=util.pad(this.innerHTML,2);
                });

                betData+=util.pad(hards.length);
                hards.each(function () {
                    betData+=util.pad(this.innerHTML,2);
                });

            } else {
                if(reds.length<5) {
                    sl.tip("请至少选择一注");
                    return;
                }

                if(reds.length==5) {
                    betData="00|01|0001|";
                    reds.each(function () {
                        betData+=util.pad(this.innerHTML,2);
                    });
                } else {
                    betData="00|02|0001|"+util.pad(reds.length);
                    reds.each(function () {
                        betData+=util.pad(this.innerHTML,2);
                    });
                }
            }

            if(localStorage.f15c5BetData)
                localStorage.f15c5BetData+='#'+betData;
            else
                localStorage.f15c5BetData=betData;

            that.to('/f15c5Buy.html');
        },
        random: function () {
            this.randomRed();
        },
        randomRed: function () {
            var that=this;

            that.$red.removeClass('curr');

            if(that.redTimer) {
                clearInterval(that.redTimer);
            }

            var i=5;
            that.redTimer=setInterval(function () {

                var num=Math.round(Math.random()*14);

                if(!that.$red.eq(num).hasClass('curr')) {
                    that.$red.eq(num).addClass('curr');
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
            if(!$target.hasClass('curr')) {
                this.$('[data-red="'+$target.attr('data-red')+'"].curr').removeClass('curr');
            }
            $target.toggleClass('curr');
        },
        template: 'views/f15c5.html',
        onCreate: function () {
            var that=this,
                html="<li>";

            for(var i=1;i<=15;i++) {
                html+='<p><em data-red="'+i+'">'+i+'</em></p>';
                if(i%8==0) { html+="</li><li>"; }
            }
            that.$('.J_RedList').append(html+"</li>");

            that.$red=that.$('.J_NormalRedList em');

            that.$el.loading('load',{
                url: '/api/CPService/QueryGameXspar/?ct=json&gameid=90015&wagerissue=',
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
