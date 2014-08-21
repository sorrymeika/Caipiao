define('views/menu',['zepto','ui/sl','app'],function (require,exports,module) {
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
            'tap .J_Index': function () {
                this.to('/');
            },
            'tap .J_User': function () {
                this.to(localStorage.authCookies?'/user.html':'/login.html');
            },
            'tap .J_Prize': function () {
                this.to('/prizeList.html');
            },
            'tap .J_News': function () {
                this.to('/newsList.html',{
                    easingIn: this.animateInClassName,
                    easingOut: this.animateOutClassName
                });
            }
        },
        toBack: function (e) {
            if($(e.target).hasClass('view')) {
                this.back();
            }
        },
        onCreate: function () {
            var that=this;
        },
        playUnderlayer: function (underlayer) {
            underlayer.$el.addClass('stop');
        },
        onStart: function () {
        },
        onResume: function () {
            console.log("index onResume");
        },
        onDestory: function () {
            console.log("index onDestory");
        }
    });
});
