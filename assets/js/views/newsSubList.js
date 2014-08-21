﻿define('views/newsSubList',['zepto','ui/sl','ui/tabs','app','views/loading'],function (require,exports,module) {
    var $=require('zepto'),
        sl=require('ui/sl'),
        app=require('app'),
        Tabs=require('ui/tabs'),
        Loading=require('views/loading');

    module.exports=sl.Activity.extend({
        template: 'views/newsSubList.html',
        events: {
            'tap .J_Back': 'back',
            'tap .J_List [data-id]': 'toNews'
        },
        toNews: function (e) {
            var $target=$(e.currentTarget),
                id=$target.attr('data-id');

            this.to('/news/'+id+'.html');
        },
        onCreate: function () {
            var that=this;

            that.$el.loading('load',{
                url: '/api/CPService/QueryCpNewsSmallType/?ct=json&newClass='+that.route.data.id,
                success: function (res) {

                    var data=[];

                    $.each(res.Data,function (i,item) {
                        data.push({
                            id: item.NewType,
                            title: item.NName
                        })
                    });

                    new Tabs(that.$('#main'),{
                        data: data,
                        onChange: function (e,content,item) {

                            console.log(item)

                            content.loading('load',{
                                url: '/api/CPService/queryCpNewsList/?ct=json&r=0.6135462955571711&newsclasses=&newstype='+item.id+'&currentindex=1&len=10',
                                success: function (res) {
                                    content.html(that.tmpl('list',res));
                                }
                            });
                        }
                    });
                }
            })


        },
        onStart: function () {
        },
        onResume: function () {
        },
        onDestory: function () {
        }
    });
});
