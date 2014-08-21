define('views/ssq',['zepto','ui/sl','app','views/loading','util'],function (require,exports,module) {
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
            'tap .J_RandomBlue': 'randomBlue',
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
                that.$('.cpBar,.J_RandomRed,.J_RandomBlue,.J_Random').show();
                that.$('.J_HardCont').hide();
                that.$('.J_MsgTitle').html('红球');
                that.$('.J_Msg').html('至少选择6个红球');
                that.showType();
            }
        },
        showHard: function () {
            var that=this,
                $target=that.$('.J_Hard');

            if(!$target.hasClass('curr')) {
                $target.addClass('curr').siblings('.curr').removeClass('curr');
                that.clear();
                that.$('.J_MsgTitle').html('胆码-红球');
                that.$('.J_Msg').html('至少选择一个，最多选择5个');
                $('.cpBar,.J_RandomRed,.J_RandomBlue,.J_Random').hide();
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
                reds=that.$red.filter('.curr'),
                blues=that.$blue.filter('.curr');

            if(that.$('.J_Hard').hasClass('curr')) {
                var hards=that.$('.J_HardCont .J_RedList em.curr');

                if(reds.length+hards.length<7||blues.length<1) {
                    sl.tip("请至少选择一注");
                    return;
                }

                if(reds.length>5) {
                    sl.tip("胆码不能超过5个");
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

                betData+=util.pad(blues.length);
                blues.each(function () {
                    betData+=util.pad(this.innerHTML,2);
                });

            } else {
                if(reds.length<6||blues.length<1) {
                    sl.tip("请至少选择一注");
                    return;
                }

                var a=1,b=1;
                for(var i=reds.length;i>6;i--) {
                    a*=i;
                }
                for(var i=1,n=reds.length-6;i<=n;i++) {
                    b*=i;
                }

                if(reds.length==6&&blues.length==1) {
                    betData="00|01|0001|";
                    reds.each(function () {
                        betData+=util.pad(this.innerHTML,2);
                    });
                    blues.each(function () {
                        betData+=util.pad(this.innerHTML,2);
                    });
                } else {
                    betData="00|02|0001|"+util.pad(reds.length);
                    reds.each(function () {
                        betData+=util.pad(this.innerHTML,2);
                    });
                    betData+=util.pad(blues.length);
                    blues.each(function () {
                        betData+=util.pad(this.innerHTML,2);
                    });
                }

                //alert(a/b*blues.length);
            }
            console.log(betData);

            if(localStorage.ssqBetData)
                localStorage.ssqBetData+='#'+betData;
            else
                localStorage.ssqBetData=betData;

            that.to('/ssqBuy.html');
        },
        random: function () {
            this.randomRed();
            this.randomBlue();
        },
        randomRed: function () {
            var that=this;

            that.$red.removeClass('curr');

            if(that.redTimer) {
                clearInterval(that.redTimer);
            }

            var i=6;
            that.redTimer=setInterval(function () {

                var num=Math.round(Math.random()*32);

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
        randomBlue: function () {
            var that=this;

            var num=Math.round(Math.random()*15);
            that.$blue.removeClass('curr').eq(num).addClass('curr');
        },
        clear: function () {
            this.$('.ballPool.red .bd em.curr,.ballPool.blue .bd em.curr').removeClass('curr');
        },
        selectRed: function (e) {
            var $target=$(e.currentTarget);
            if(!$target.hasClass('curr')) {
                this.$('[data-red="'+$target.attr('data-red')+'"].curr').removeClass('curr');
            }
            $target.toggleClass('curr');
        },
        selectBlue: function (e) {
            $(e.currentTarget).toggleClass('curr');
        },
        template: 'views/ssq.html',
        onCreate: function () {
            var that=this,
                html="<li>";

            for(var i=1;i<=33;i++) {
                html+='<p><em data-red="'+i+'">'+i+'</em></p>';
                if(i%8==0) { html+="</li><li>"; }
            }
            that.$('.J_RedList').append(html+"</li>");

            html="<li>";

            for(var i=1;i<=16;i++) {
                html+='<p><em>'+i+'</em></p>';
                if(i%8==0) { html+="</li><li>"; }
            }
            that.$('.J_BlueList').append(html+"</li>");

            that.$blue=that.$('.ballPool.blue .bd em');
            that.$red=that.$('.J_NormalRedList em');

            that.$el.loading('load',{
                url: '/api/CPService/QueryGameXspar/?ct=json&gameid=10001&wagerissue=',
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
                error: function(xhr) {
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
