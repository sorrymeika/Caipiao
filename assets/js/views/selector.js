define('views/selector',['zepto','ui/sl','app','views/loading','util','ui/dropdown'],function(require,exports,module) {
    var $=require('zepto'),
        sl=require('ui/sl'),
        app=require('app'),
        util=require('util'),
        Loading=require('views/loading'),
        Dropdown=require('ui/dropdown');

    module.exports=sl.Activity.extend({
        template: 'views/selector.html',
        title: '双色球选号',
        GameID: '10001',
        BetDataKey: 'ssqBetData',
        buyUrl: '/ssqBuy.html',
        tabs: [{
            name: '普通投注',
            randomFlag: true,
            types: [{
                type: '00|01',
                condition: '$0==6&&$1==1',
                single: true,
                codes: '$codes0$codes1'
            },{
                type: '00|02',
                condition: '$0>=7||$1>=2',
                codes: '$0$codes0$1$codes1'
            }],
            balls: [{
                color: 'red',
                title: '红球',
                msg: '至少选择6个红球',
                randomFlag: true,
                randomNum: 6,
                range: [1,33]
            },{
                color: 'blue',
                title: '蓝球',
                msg: '请至少选择1个蓝球',
                randomFlag: true,
                randomNum: 1,
                range: [1,16]
            }]
        },{
            name: '胆拖投注',
            randomFlag: false,
            errors: [['$0>5','胆码不能超过5个']],
            types: [{
                type: '00|03',
                condition: '$0>=1&&$0<=5&&($0+$1>=7)&&$2>=1',
                codes: '$0$codes0$1$codes1'
            }],
            balls: [{
                color: 'red',
                title: '胆码-红球',
                msg: '至少选择1个，最多选择5个',
                randomFlag: false,
                range: [1,33]
            },{
                color: 'red',
                title: '拖码-红球',
                msg: '至少选择2个红球',
                randomFlag: false,
                range: [1,33]
            },{
                color: 'blue',
                title: '拖码-蓝球',
                msg: '请选择1个蓝球',
                randomFlag: false,
                range: [1,16]
            }]
        }],
        events: {
            'tap .J_Back': 'back',
            'tap .js_red_ball_pool em': 'selectRed',
            'tap .js_blue_ball_pool em': 'selectBlue',
            'tap .J_Clear': 'clear',
            'tap .J_Buy': "buy",
            'tap .J_RandomOne': function(e) {
                var that=this;
                that._random($(e.currentTarget).closest('.js_ball_pool'));
            },
            'tap .J_Random': function(e) {
                var that=this;

                that.$('.js_ball_pool[data-num]').each(function() {
                    that._random($(this));
                });
            }
        },
        _nextStep: function() {
            this.to(this.buyUrl);
        },
        buy: function() {
            var that=this,
                opt=that.currentType,
                $pools=$('.js_ball_pool',opt.$el),
                pools=[];

            if(localStorage[that.BetDataKey]&&$pools.find('em.curr').length==0) {
                that._nextStep();
                return;
            }

            $.each(opt.balls,function(i) {
                var selected=$pools.eq(i).find('em.curr'),
                    betData='';

                selected.each(function() {
                    betData+=util.pad(this.innerHTML,2);
                });

                pools.push([selected.length,betData]);
            });

            var flag=true,
                type,
                msg;

            if(opt.errors) {
                $.each(opt.errors,function(i,errorOpt) {
                    var condition=errorOpt[0].replace(/\$(\d+)/g,function(r0,r1) {
                        return pools[parseInt(r1)][0];
                    });

                    if(eval(condition)) {
                        flag=false;
                        msg=errorOpt[1];
                        return false;
                    }
                });

                if(!flag) {
                    sl.tip(msg);
                    return;
                }
            }

            $.each(opt.types,function(i,typeOpt) {
                var condition=typeOpt.condition.replace(/\$(\d+)/g,function(r0,r1) {
                    return pools[parseInt(r1)][0];
                });
                if(!eval(condition)) {
                    flag=false;
                } else {
                    type=typeOpt;
                    flag=true;
                    return false;
                }
            });

            if(!flag) {
                sl.tip("请至少选择一注");
                return;
            }

            var betCodes=type.codes.replace(/\$(\d+)/g,function(r0,r1) {
                return ','+util.pad(pools[parseInt(r1)][0])+',';
            }).replace(/\$codes(\d+)/g,function(r0,r1) {
                return pools[parseInt(r1)][1];
            }).replace(/\,/g,function() {
                return '';
            });

            betCodes=type.type+'|0001|'+betCodes;

            if(type.single) {
                if(localStorage[that.BetDataKey]&&localStorage[that.BetDataKey].indexOf(type.type)!=0) {
                    sl.confirm('一笔订单只能包含一种模式注码，是否清除之前注码？',function() {
                        localStorage[that.BetDataKey]=betCodes;
                        that._nextStep();
                    });
                } else {
                    if(localStorage[that.BetDataKey])
                        localStorage[that.BetDataKey]+='#'+betCodes;
                    else
                        localStorage[that.BetDataKey]=betCodes;

                    that._nextStep();
                }

            } else {
                if(localStorage[that.BetDataKey]) {
                    sl.confirm('一笔订单只能包含一种模式注码，是否清除之前注码？',function() {
                        localStorage[that.BetDataKey]=betCodes;
                        that._nextStep();
                    });
                } else {
                    localStorage[that.BetDataKey]=betCodes;
                    that._nextStep();
                }
            }

        },
        _random: function($container) {
            var $balls=$container.find('.bd em'),
                target=$container[0],
                i=parseInt($container.attr('data-num')),
                max=$balls.length-1;

            $balls.removeClass('curr');

            if(target._random_timer) {
                clearInterval(target._random_timer);
            }

            target._random_timer=setInterval(function() {

                var num=Math.round(Math.random()*max);

                if(!$balls.eq(num).hasClass('curr')) {
                    $balls.eq(num).addClass('curr');
                    i--;
                }

                if(i<=0) {
                    clearInterval(target._random_timer);
                    target._random_timer=null;
                }

            },100);
        },
        onCreate: function() {
            var that=this,
                tabs=[];

            that.$('.J_Header').html(that.title);

            $.each(that.tabs,function(i,tab) {
                tabs.push({
                    text: tab.name
                });

                html='<div class="js_type_cont" style="display:'+(i==0?'block':'none')+'">';

                $.each(tab.balls,function(i,ballOpt) {

                    html+='<div class="'+ballOpt.color+' ballPool js_ball_pool"'+(ballOpt.randomFlag?' data-num="'+ballOpt.randomNum+'"':'')+'>\
                        <div class="hd">'+(ballOpt.randomFlag?'<span class="J_RandomOne">随机</span>':'')+' <em class="J_MsgTitle">'+ballOpt.title+'</em>\
                            <i class="J_Msg">'+ballOpt.msg+'</i> </div>\
                        <div class="bd">\
                            <ul class="table redBallList js_'+ballOpt.color+'_ball_pool"><li>';

                    for(var i=ballOpt.range[0],n=ballOpt.range[1];i<=n;i++) {
                        html+='<p><em data-'+ballOpt.color+'="'+i+'">'+i+'</em></p>';
                        if(i%8==0) { html+="</li><li>"; }
                    }

                    html+='</ul>\
                        </div>\
                    </div>';
                });

                html+='</div>';

                var $cont=$(html).appendTo(that.$('#main'));

                that.tabs[i].$el=$cont;
            });

            that.currentType=that.tabs[0];
            that.$('.J_Random')[that.currentType.randomFlag?'show':'hide']();

            if(that.tabs.length>=2) {
                that.$('.J_Type').dropdown({
                    data: tabs,
                    onChange: function(e,index) {

                        that.currentType=that.tabs[index];
                        that.currentType.$el.show().siblings('.js_type_cont').hide();

                        that.$('.J_Random')[that.currentType.randomFlag?'show':'hide']();
                    }
                });
            }

            that._loadData();
        },
        _loadData: function() {
            var that=this;

            that.$el.loading('load',{
                url: '/api/CPService/QueryGameXspar/?ct=json&gameid='+that.GameID+'&wagerissue=',
                success: function(res) {

                    that.$('.js_curPhase').html(res.Data[0].WagerIssue);
                    var endTime=new Date(res.Data[0].DrawEndTime.replace(/T|\:/,'-').split('-')),
                        leftTime=(endTime-new Date())/1000;

                    if(leftTime<0) {
                        that.$('.js_leftTime').html("投注已结束");
                        that.isOver=true;

                    } else {
                        that.$('.js_leftTime').html("投注剩余"+that.parseTime(leftTime));

                        that.interval=setInterval(function() {
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
                        setTimeout(function() {
                            that.to('/login.html');
                        },1000);
                    } else
                        this.msg('网络错误');
                }
            });
        },
        clear: function() {
            this.$('.js_ball_pool .bd em.curr').removeClass('curr');
        },
        selectRed: function(e) {
            var $target=$(e.currentTarget);
            if(!$target.hasClass('curr')) {
                this.$('[data-red="'+$target.attr('data-red')+'"].curr').removeClass('curr');
            }
            $target.toggleClass('curr');
        },
        selectBlue: function(e) {
            $(e.currentTarget).toggleClass('curr');
        },
        parseTime: function(s) {
            var h=Math.floor(s/(60*60));
            s=s-h*60*60;
            m=Math.floor(s/60);
            s=Math.floor(s-m*60);

            return h+"时"+m+"分"+s+"秒";
        },
        onStart: function() {
        },
        onResume: function() {
            this.clear();
        },
        onDestory: function() {
            this.interval&&clearInterval(this.interval);
        }
    });
});
