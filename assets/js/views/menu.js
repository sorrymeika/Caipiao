define('views/menu',['zepto','ui/sl','app'],function(require,exports,module) {
    var $=require('zepto'),
        sl=require('ui/sl'),
        app=require('app');

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
                if(!localStorage.authCookies) {
                    this.to('/login.html');
                } else {
                    localStorage.authCookies='';
                    localStorage.auth='';
                    localStorage.UserName='';

                    $(e.currentTarget).html('登录');

                    sl.tip('退出成功！');
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

            that.$('.J_Signout').show().html(localStorage.authCookies?'退出':'登录').loading('load',{
                url: '/api/AccService/QueryLoginStatus',
                check: false,
                checkData: false,
                success: function(res) {
                    console.log(res);
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
