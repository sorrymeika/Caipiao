﻿define('views/menu',['zepto','ui/sl','app','views/loading'],function(require,exports,module) {
    var $=require('zepto'),
        sl=require('ui/sl'),
        app=require('app'),
        Loading=require('views/loading');

    module.exports=sl.Activity.extend({
        className: 'view transparent',
        template: 'views/menu.html',
        animateInClassName: 'anim-left-in',
        animateOutClassName: 'anim-left-out',
        events: {
            'tap': 'toBack',
            'swipeLeft': 'back',
            'tap .J_Index': function() {
                this.to('/');
            },
            'tap .J_User': function() {
                this.to(localStorage.authCookies?'/user.html':'/login.html');
            },
            'tap .J_Prize': function() {
                this.to('/prizeList.html');
            },
            'tap .J_News': function() {
                this.to('/newsList.html',{
                    easingIn: this.animateInClassName,
                    easingOut: this.animateOutClassName
                });
            },
            'tap .J_Signout': function(e) {
                var that=this;

                if(!localStorage.authCookies) {
                    that.to('/login.html');
                } else {
                    that.$('.J_Signout').css({ position: 'relative' }).loading('load',{
                        url: '/api/AccService/Logout',
                        check: false,
                        checkData: false,
                        success: function(res) {
                            if(res.StatusCode=='0') {
                                localStorage.authCookies='';
                                localStorage.auth='';
                                localStorage.UserName='';

                                sl.tip('退出成功！');
                                $(e.currentTarget).html('登录');
                            } else {
                                sl.tip(res.ErrorMessage);
                            }
                        },
                        error: function() {
                            this.hide();
                            sl.tip('网络错误！');
                        }
                    });
                }
            }
        },
        toBack: function(e) {
            if($(e.target).hasClass('view')) {
                this.back();
            }
        },
        onCreate: function() {
            var that=this;

            var $signout=that.$('.J_Signout').css({ position: 'relative' }).show().html(localStorage.authCookies?'退出':'登录');
            if(localStorage.authCookies)
                $signout.loading('load',{
                    url: '/api/AccService/QueryLoginStatus',
                    check: false,
                    checkData: false,
                    success: function(res) {
                        if(res.ReturnCode!='0000') {
                            localStorage.authCookies='';
                            localStorage.auth='';
                            localStorage.UserName='';

                            that.$('.J_Signout').html('登录');
                        }
                    }
                });
        },
        playUnderlayer: function(underlayer) {
            underlayer.$el.addClass('stop');
        },
        onStart: function() {
        },
        onResume: function() {
            this.$('.J_Signout').show().html(localStorage.authCookies?'退出':'登录');

        },
        onDestory: function() {
        }
    });
});
