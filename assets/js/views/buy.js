define('views/buy',['zepto','ui/sl','util','app','views/loading'],function (require,exports,module) {
    var $=require('zepto'),
        sl=require('ui/sl'),
        app=require('app'),
        util=require('util'),
        Loading=require('views/loading');

    module.exports=sl.Activity.extend({
        template: 'views/buy.html',
        title: '双色球投注',
        GameID: '10001',
        BetDataKey: 'ssqBetData',
        events: {
            'tap .J_Back': 'back',
            'tap .J_Delete': 'del',
            'tap .J_Clear': 'clear',
            'tap .J_Random': 'random',
            'tap .J_Buy': 'buy',
            'tap .J_Select': function () {
                this.to(this.backUrl)
            },
            'input .J_Times': function () {
                var $times=this.$('.J_Times'),
                    times=$times.val();

                if(times=='') return;

                if(!/^\d+$/.test(times)) {
                    sl.tip('请输入正确的倍数');
                    $times.val(this.times);
                    return;
                }

                times=parseInt(times);
                if(times==0) {
                    sl.tip('请输入正确的倍数');
                    $times.val(this.times);
                    return;
                } else if(times>9999) {
                    sl.tip('输入的倍数过大');
                    $times.val(this.times);
                    return;
                }

                this.times=times;
                this._setInfo();
            },
            'input .J_Number': function () {
                var $number=this.$('.J_Number'),
                    number=$number.val();

                if(number=='') return;

                if(!/^\d+$/.test(number)) {
                    sl.tip('请输入正确的期数');
                    $number.val(this.number);
                    return;
                }

                number=parseInt(number);
                if(number==0) {
                    sl.tip('请输入正确的期数');
                    $number.val(this.number);
                    return;
                } else if(number>9999) {
                    sl.tip('输入的倍数过大');
                    $number.val(this.number);
                    return;
                }

                this.number=number;
                this._setInfo();
            }
        },
        buy: function () {
            var that=this;

            if(that.total<=0) {
                sl.tip('请至少选择一注');
                return;
            }

            if(!that.gameData) {
                sl.tip('网络错误');
                return;
            }

            sl.prompt('请输入您的投注密码',function (res) {
                if(!res) {
                    return;
                }

                if(!/^\d{6}$/.test(res)) {
                    sl.tip('请输入正确的密码');
                    return;
                }

                var betData=localStorage[that.BetDataKey].split('#'),
                    resultCode=[],
                    codes;

                $.each(betData,function (i,code) {
                    codes=code.split('|');
                    codes[2]=util.pad(that.times,4);
                    resultCode.push(codes.join('|'));
                });

                var data={
                    GameID: that.GameID,
                    WagerIssue: that.gameData.WagerIssue,
                    NumIssue: that.number,
                    RelationOrderID: '',
                    Sequence: '',
                    Amount: that.number*that.times*that.total*2*100,
                    DrawWay: 1,
                    BetData: resultCode.join('#'),
                    BetPassword: res,
                    BetCode: '',
                    VIP: ''
                }

                $('body').loading('load',{
                    url: '/api/CPService/Betting/?ct=json',
                    type: 'POST',
                    data: data,
                    success: function (res) {
                        sl.tip('投注成功！');
                    },
                    error: function (res) {
                        if(res.ReturnCode=='90026') {

                            data.OrderID=res.OrderID;

                            sl.prompt('请输入您的短信验证码',function (res) {

                                data.BetCode=res;

                                $('body').loading('load',{
                                    url: '/api/CPService/Betting/?ct=json',
                                    type: 'POST',
                                    data: data,
                                    success: function (res) {
                                        console.log(res)
                                        sl.tip('投注成功！');
                                    },
                                    error: function (res) {
                                        if(res.ReturnCode) {
                                            sl.tip('错误:'+res.ReturnCode);
                                        } else {
                                            sl.tip('网络错误');
                                        }
                                        this.hide();
                                    }
                                });

                            });

                        } else if(res.ReturnCode) {
                            sl.tip('错误:'+res.ReturnCode);
                        } else {
                            sl.tip('网络错误');
                        }
                        this.hide();
                    }
                });

            },'password');

        },
        random: function () {
            this.$('.J_List').append('<li><span>1注 单式</span><i class="ssqNums">04&nbsp;&nbsp;12&nbsp;&nbsp;13&nbsp;&nbsp;14&nbsp;&nbsp;22&nbsp;&nbsp;27</i><span>16</span><em class="ico-delete J_Delete"></em></li>');
        },
        clear: function () {
            this.$('.J_List li').remove();
            this.total=0;
            localStorage[that.BetDataKey]="";
            this._setInfo();
        },
        _setInfo: function (total) {
            var that=this,
                $total=that.$('.J_Total'),
                $money=that.$('.J_Money'),
                text=$total.html().replace(/\d+注/,that.total+'注');

            text=text.replace(/^\d+倍/,that.times+'倍');
            text=text.replace(/\d+期/,that.number+'期');

            $total.html(text);
            $money.html('共'+that.times*that.number*that.total*2+'元');
        },
        del: function (e) {
            var that=this,
                $target=$(e.currentTarget),
                $parent=$target.parent(),
                data=localStorage[that.BetDataKey].split('#');

            data.splice($parent.index(),1);

            localStorage[that.BetDataKey]=data.join('#');

            that.total-=parseInt($parent.attr('data-num'));

            $parent.remove();
            that._setInfo();
        },

        _loadData: function () {
            var that=this;

            that.$el.loading('load',{
                url: '/api/CPService/QueryGameXspar/?ct=json&gameid='+that.GameID+'&wagerissue=',
                success: function (res) {

                    that.gameData=res.Data[0];

                    that.$('.js_curPhase').html(res.Data[0].WagerIssue);
                    var endTime=new Date(res.Data[0].DrawEndTime.replace(/T|\:/,'-').split('-')),
                        leftTime=(endTime-new Date())/1000;

                    if(leftTime<0) {
                        that.$('.js_leftTime').html("投注已结束");
                        that.isOver=true;

                    } else {
                        that.$('.js_leftTime').html("投注剩余"+that.parseTime(leftTime));
                        that.isOver=false;

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
        onCreate: function () {
            var that=this,
                data,
                total=0;

            that.$('.J_Header').html(that.title);

            if(!localStorage[that.BetDataKey]) {
                data=null;
            } else {
                var sBetData=localStorage[that.BetDataKey].split('#'),
                    betData,
                    data=[],
                    opt;

                $.each(sBetData,function (i,item) {
                    betData=item.split('|');

                    $.each(that.types,function (j,typeOpt) {
                        if(item.indexOf(typeOpt.type)==0) {
                            opt=typeOpt;
                            return false;
                        }
                    });

                    if(!opt) return;

                    var itemData={
                        type: betData[1],
                        typeName: opt.name
                    },
                    replaceCode=function (codes) {
                        return codes.replace(/\d{2}/g,function (r) {
                            return '<em>'+r+"</em>"
                        }).replace(/&nbsp;&nbsp;$/,'')
                    };

                    var codes=betData[3],
                        pools=[];


                    if(opt.balls=='$') {
                        var num;
                        while(codes.length) {
                            num=parseInt(codes.substr(0,2));
                            codes=codes.substr(2);
                            pools.push([num,codes.substr(0,2*num)]);
                            codes=codes.substr(2*num);
                        }

                    } else {
                        opt.balls.replace(/\$(\d+)/g,function (r0,r1) {
                            r1=parseInt(r1);
                            pools.push([r1,codes.substr(0,2*r1)]);
                            codes=codes.substr(2*r1);
                            return '';
                        });
                    }

                    var t=opt.total.replace(/\$(\d+)/g,function (r0,r1) {
                        return pools[parseInt(r1)][0];
                    }).replace(/\$/g,function (r0,r1) {
                        return 'util.';
                    });

                    itemData.num=eval(t);

                    itemData.red=opt.red.replace(/\$(\d+)/g,function (r0,r1) {
                        return replaceCode(pools[parseInt(r1)][1]);
                    });

                    itemData.blue=opt.blue&&opt.blue.replace(/\$(\d+)/g,function (r0,r1) {
                        return replaceCode(pools[parseInt(r1)][1]);
                    });

                    total+=itemData.num;
                    data.push(itemData);
                });
            }

            that.total=total;
            that.times=1;
            that.number=1;

            that._setInfo();
            that.$('.J_Total').html(that.$('.J_Times').val()+'倍'+total+'注1期');
            that.$('.J_List').html(that.tmpl('list',{ data: data }));

            that._loadData();
        },
        onStart: function () {
        },
        onResume: function () {
        },
        onDestory: function () {
            $('body').loading('abort');
            this.interval&&clearInterval(this.interval);
        }
    });
});
