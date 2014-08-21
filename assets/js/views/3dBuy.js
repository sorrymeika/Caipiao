define('views/3dBuy',['zepto','ui/sl','util','app','views/loading'],function (require,exports,module) {
    var $=require('zepto'),
        sl=require('ui/sl'),
        app=require('app'),
        util=require('util'),
        Loading=require('views/loading');

    module.exports=sl.Activity.extend({
        events: {
            'tap .J_Back': 'back',
            'tap .J_Delete': 'del',
            'tap .J_Clear': 'clear',
            'tap .J_Random': 'random',
            'tap .J_Select': function () {
                this.to('/3d.html')
            },
            'tap .J_Buy': 'buy',
            'change .J_Times': function () {
                var $times=this.$('.J_Times'),
                    times=$times.val();

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
                }

                this.times=times;
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

                var threedDBetData=localStorage.threedDBetData.split('#'),
                    resultCode=[],
                    codes;

                $.each(threedDBetData,function (i,code) {
                    codes=code.split('|');
                    codes[2]=util.pad(that.times,4);
                    resultCode.push(codes.join('|'));
                });

                var data={
                    GameID: '10002',
                    WagerIssue: that.gameData.WagerIssue,
                    NumIssue: 1,
                    RelationOrderID: '',
                    Sequence: '',
                    Amount: that.times*that.total*2*100,
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
                        console.log(res)

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
            localStorage.threedDBetData="";
            this._setInfo();
        },
        _setInfo: function (total) {
            var that=this,
                $total=that.$('.J_Total'),
                $money=that.$('.J_Money'),
                text=$total.html().replace(/\d+注/,that.total+'注');

            text=text.replace(/^\d+倍/,that.times+'倍')

            $total.html(text);
            $money.html('共'+that.times*that.total*2+'元');
        },
        del: function (e) {
            var that=this,
                $target=$(e.currentTarget),
                $parent=$target.parent(),
                data=localStorage.threedDBetData.split('#');

            data.splice($parent.index(),1);

            localStorage.threedDBetData=data.join('#');

            that.total-=parseInt($parent.attr('data-num'));

            $parent.remove();
            that._setInfo();
        },
        template: 'views/3dBuy.html',
        onCreate: function () {
            var that=this,
                data,
                total=0;

            if(!localStorage.threedDBetData) {
                data=null;
            } else {
                var threedDBetData=localStorage.threedDBetData.split('#'),
                    betData,
                    data=[];

                $.each(threedDBetData,function (i,item) {
                    betData=item.split('|');

                    var itemData={
                        type: betData[1],
                        typeName: betData[0]=='01'&&betData[1]=='01'?'单式':betData[0]=='01'&&betData[1]=='02'?'复式':betData[0]=='02'&&betData[1]=='01'?'组3单式':betData[0]=='02'&&betData[1]=='06'?'组3复式':"组6"
                    },
                    replaceCode=function (codes) {
                        return codes.replace(/\d{2}/g,function (r) {
                            return r+"&nbsp;&nbsp;"
                        }).replace(/&nbsp;&nbsp;$/,'')
                    };

                    if(betData[0]=='01'&&betData[1]=='01') {
                        itemData.num=1;

                        itemData.red=betData[3].substr(0,6);
                        itemData.red=replaceCode(itemData.red);

                    } else if(betData[0]=='01'&&betData[1]=='02') {
                        var num=1,codes='',start=0;

                        for(var i=0,red;i<3;i++) {
                            red=parseInt(betData[3].substr(start,2));
                            start+=2;
                            codes+=red==1?betData[3].substr(start,red*2)+'&nbsp;':('('+replaceCode(betData[3].substr(start,red*2))+')');
                            start+=red*2;
                            num*=red;
                        }

                        itemData.num=num;
                        itemData.red=codes;
                    } else if(betData[0]=='02'&&betData[1]=='01') {
                        itemData.num=1;

                        itemData.red=betData[3].substr(0,6);
                        itemData.red=replaceCode(itemData.red);
                    } else if(betData[0]=='02'&&betData[1]=='06') {
                        itemData.num=util.A(parseInt(betData[3].substr(0,2)),2);

                        itemData.red=replaceCode(betData[3].substr(2,betData[3].length-2));
                    } else if(betData[0]=='03'&&betData[1]=='06') {
                        itemData.num=util.C(parseInt(betData[3].substr(0,2)),3);

                        itemData.red=replaceCode(betData[3].substr(2,betData[3].length-2));
                    }

                    total+=itemData.num;
                    data.push(itemData);
                });
            }

            that.total=total;
            that.times=1;

            that._setInfo();
            that.$('.J_Total').html(that.$('.J_Times').val()+'倍'+total+'注1期');
            that.$('.J_List').html(that.tmpl('list',{ data: data }));

            that.$el.loading('load',{
                url: '/api/CPService/QueryGameXspar/?ct=json&gameid=10002&wagerissue=',
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
        onStart: function () {
        },
        onResume: function () {
        },
        onDestory: function () {
            this.interval&&clearInterval(this.interval);
        }
    });
});
