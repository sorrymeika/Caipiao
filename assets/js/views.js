define("views/3d",["zepto","ui/sl","app","views/loading","views/selector","util"],function(e,o,a){var r=(e("zepto"),e("ui/sl"),e("app"),e("util"),e("views/loading"),e("views/selector"));a.exports=r.extend({title:"3D选号",GameID:"10002",BetDataKey:"threedDBetData",buyUrl:"/3dBuy.html",tabs:[{name:"直选",randomFlag:!0,repeat:!0,types:[{type:"01|01",condition:"$0==1&&$1==1&&$2==1",single:!0,codes:"$codes0$codes1$codes2"},{type:"01|02",condition:"$0>1||$1>1||$2>1",codes:"$0$codes0$1$codes1$2$codes2"}],balls:[{color:"red",title:"百位",msg:"至少选择1个",randomFlag:!0,randomNum:1,range:[0,9]},{color:"red",title:"十位",msg:"至少选择1个",randomFlag:!0,randomNum:1,range:[0,9]},{color:"red",title:"个位",msg:"至少选择1个",randomFlag:!0,randomNum:1,range:[0,9]}]},{name:"组三单式",randomFlag:!1,types:[{type:"02|01",condition:"$0==1&&$1==1",sort:!0,codes:"$codes0$codes1$codes0"}],balls:[{color:"red",title:"重号",msg:"请选择1个号码",randomFlag:!1,single:!0,range:[0,9]},{color:"red",title:"单号",msg:"请选择1个号码",single:!0,randomFlag:!1,range:[0,9]}]},{name:"组三复式",randomFlag:!1,types:[{type:"02|06",condition:"$0>=2",codes:"$0$codes0"}],balls:[{color:"red",title:"选号",msg:"至少选择2个",randomFlag:!1,range:[0,9]}]},{name:"组六选号",randomFlag:!1,types:[{type:"03|06",condition:"$0>=3",codes:"$0$codes0"}],balls:[{color:"red",title:"选号",msg:"至少选择3个",randomFlag:!1,range:[0,9]}]}]})});
define("views/3dBuy",["zepto","ui/sl","util","app","views/loading","views/buy"],function(t,e,n){var u=(t("zepto"),t("ui/sl"),t("app"),t("util"),t("views/loading"),t("views/buy"));n.exports=u.extend({GameID:"10002",title:"3D投注",BetDataKey:"threedDBetData",backUrl:"/3d.html"})});
define("views/allTypes",["zepto","util"],function(t){var r=t("zepto"),i=t("util"),o="鼠 牛 虎 兔 龙 蛇 马 羊 猴 鸡 狗 猪".split(" "),a={};r.each(o,function(t,e){a[i.pad(t+1)]=e});var s={t_10001:[{type:"00|01",name:"单式",total:"1",balls:"$6$1",red:"$0",blue:"$1"},{type:"00|02",name:"复式",total:"$C($0,$0-6)*$1",balls:"$",red:"$0",blue:"$1"},{type:"00|03",name:"胆拖",total:"$C($1,6-$0)*$2",balls:"$",red:"$0($1)",blue:"$2"}],t_10002:[{type:"01|01",name:"单式",total:"1",balls:"$3",red:"$0",maxTimes:99},{type:"01|02",name:"复式",total:"$0*$1*$2",balls:"$",red:"($0)($1)($2)"},{type:"02|01",name:"组3单式",total:"1",balls:"$3",red:"$0"},{type:"02|06",name:"组3复式",total:"$A($0,2)",balls:"$",red:"$0"},{type:"03|06",name:"组6",total:"$C($0,3)",balls:"$",red:"$0"}],t_90016:[{type:"00|01",name:"单式",total:"1",balls:"$6$1",red:"$0",blue:"$1",blueTextArray:a},{type:"00|02",name:"复式",total:"$0*$1*$2*$3*$4*$5*$6",balls:"$",red:"($0)($1)($2)($3)($4)($5)",blue:"$6",blueTextArray:a}],t_10003:[{type:"00|01",name:"单式",total:"1",balls:"$7",red:"$0"},{type:"00|02",name:"复式",total:"$C($0,$0-7)",balls:"$",red:"$0"},{type:"00|03",name:"胆拖",total:"$C($1,7-$0)",balls:"$",red:"($0)$1"}],t_32003:[{type:"01|01",name:"和值",total:"1",balls:"$1",red:"$0"},{type:"01|02",name:"复式和值",total:"$0",balls:"$",red:"$0"},{type:"03|01",name:"三同号单选",total:"1",balls:"$1",red:"$0"},{type:"02|01",name:"三同号通选",total:"1",balls:"$0",red:"三同号通选"},{type:"05|01",name:"二同号单选",total:"1",balls:"$3",red:"$0"},{type:"04|02",name:"二同号复选",total:"$0",balls:"$",red:"$0",textArray:{"01":"11*","02":"22*","03":"33*","04":"44*","05":"55*","06":"66*"}},{type:"06|01",name:"三不同号",total:"1",balls:"$3",red:"$0"},{type:"06|02",name:"三不同号复选",total:"$C($0,3)",balls:"$",red:"$0"},{type:"07|02",name:"二不同号",total:"$C($0,2)",balls:"$",red:"$0",getSubmitCodes:function(t){var e=[],n=i.s2i(t.substr(0,2));t=t.substr(2),console.log(n,t),t.replace(/\d{2}/g,function(t){return e.push(t),""});for(var r="",o=0;o<e.length-1;o++)for(var a=o+1;a<e.length;a++)r+=i.pad(e[o])+i.pad(e[a]);return i.pad(i.C(n,2))+r}},{type:"08|01",name:"三连号通选",total:"1",balls:"$1",red:"三连号通选"}],t_90015:[{type:"00|01",name:"单式",total:"1",balls:"$5",red:"$0",maxTimes:99},{type:"00|02",name:"复式",total:"$C($0,$0-5)",balls:"$",red:"$0"},{type:"00|03",name:"胆拖",total:"$C($1,5-$0)",balls:"$",red:"($0)$1"}]};return s});
define("views/buy",["zepto","ui/sl","util","app","views/loading","views/allTypes"],function(require,exports,module){var $=require("zepto"),sl=require("ui/sl"),app=require("app"),util=require("util"),types=require("views/allTypes"),Loading=require("views/loading");module.exports=sl.Activity.extend({template:"views/buy.html",title:"双色球投注",GameID:"10001",BetDataKey:"ssqBetData",maxTimes:99,events:{"tap .J_Back":"back","tap .J_Delete":"del","tap .J_Clear":"clear","tap .J_Random":"random","tap .J_Buy":"buy","tap .J_Select":function(){this.to(this.backUrl)},"input .J_Times":function(){var t=this.$(".J_Times"),e=t.val();if(""!=e){if(!/^\d+$/.test(e))return void t.val(this.times);if(e=util.s2i(e),0==e)return sl.tip("最小输入1"),void t.val(this.times);if(e>this.maxTimes)return sl.tip("最大输入"+this.maxTimes),void t.val(this.times);this.times=e,this._setInfo()}},"input .J_Number":function(){var t=this.$(".J_Number"),e=t.val();if(""!=e){if(!/^\d+$/.test(e))return void t.val(this.number);if(e=util.s2i(e),0==e)return sl.tip("最小输入1"),void t.val(this.number);if(e>365)return sl.tip("最大输入365"),void t.val(this.number);this.number=e,this._setInfo()}}},buy:function(){var t=this;return""==t.$(".J_Number").val()||""==t.$(".J_Times").val()?void sl.tip("期数和倍数必须填写"):t.total<=0?void sl.tip("请至少选择一注"):t.gameData?void sl.prompt("请输入您的投注密码",function(e){if("undefined"!=typeof e){var n=this;if(e=$.trim(e),!e)return sl.tip("请输入投注密码！"),!1;if(!/^\d{6}$/.test(e))return sl.tip("您的投注密码输入有误，请重新输入！"),!1;var a,o,r=localStorage[t.BetDataKey].split("#"),i=[];$.each(r,function(e,n){a=n.split("|"),$.each(t.types,function(t,e){return 0==n.indexOf(e.type)?(o=e,!1):void 0}),$.isFunction(o.getSubmitCodes)&&(a[3]=o.getSubmitCodes(a[3])),a[2]=util.pad(t.times,4),i.push(a.join("|"))});var s={GameID:t.GameID,WagerIssue:t.gameData.WagerIssue,NumIssue:t.number,RelationOrderID:"",Sequence:"",Amount:t.times*t.total*2*100,DrawWay:1,BetData:i.join("#"),BetPassword:e,BetCode:"",VIP:""};return $("body").loading("load",{url:"/api/CPService/Betting/?ct=json",type:"POST",data:s,success:function(){n.hide(),sl.tip("投注成功！"),t.clear()},error:function(e){"90026"==e.ReturnCode?(n.hide(),s.OrderID=e.OrderID,sl.prompt("请输入您的短信验证码",function(e){if("undefined"!=typeof e){if(e=$.trim(e),!e)return sl.tip("请输入短信验证码！"),!1;var n=this;return s.BetCode=e,$("body").loading("load",{url:"/api/CPService/Betting/?ct=json",type:"POST",data:s,success:function(){n.hide(),sl.tip("投注成功！"),t.clear()},error:function(t){sl.tip("90023"==t.ReturnCode?"您的短信验证码输入有误，请重新输入！":t.ReturnCode?"错误:"+t.ReturnCode:"网络错误"),this.hide()}}),!1}})):sl.tip(e.ReturnCode?"错误:"+e.ReturnCode:"网络错误"),this.hide()}}),!1}},"password"):void sl.tip("网络错误")},random:function(){this.$(".J_List").append('<li><span>1注 单式</span><i class="ssqNums">04&nbsp;&nbsp;12&nbsp;&nbsp;13&nbsp;&nbsp;14&nbsp;&nbsp;22&nbsp;&nbsp;27</i><span>16</span><em class="ico-delete J_Delete"></em></li>')},clear:function(){this.$(".J_List li").remove(),this.total=0,localStorage.removeItem(this.BetDataKey),this._setInfo(),this.to(this.backUrl)},_setInfo:function(){var e=this,n=e.$(".J_Total"),r=e.$(".J_Money"),i=n.html().replace(/\d+注/,e.total+"注");i=i.replace(/^\d+倍/,e.times+"倍"),i=i.replace(/\d+期/,e.number+"期"),n.html(i),r.html("共"+e.times*e.total*2+"元")},del:function(t){var e=this,n=$(t.currentTarget),r=n.parent(),i=localStorage[e.BetDataKey].split("#");i.splice(r.index(),1),0==i.length?e.clear():(localStorage[e.BetDataKey]=i.join("#"),e.total-=util.s2i(r.attr("data-num")),r.remove(),e._setInfo())},_loadData:function(){var that=this;that.$el.loading("load",{url:"/api/CPService/QueryGameXspar/?ct=json&gameid="+that.GameID+"&wagerissue=",success:function(res){that.gameData=res.Data[0],that.$(".js_curPhase").html(res.Data[0].WagerIssue);var dateArr=res.Data[0].DrawEndTime.replace(/T|\:/g,"-").split("-");dateArr[1]=util.s2i(dateArr[1])-1;var endTime=eval("new Date("+dateArr.join(",")+")"),leftTime=(endTime-new Date)/1e3;0>leftTime?(that.$(".js_leftTime").html("投注已结束"),that.isOver=!0):(that.$(".js_leftTime").html("投注剩余"+that.parseTime(leftTime)),that.isOver=!1,that.interval=setInterval(function(){leftTime--,0>=leftTime?(that.isOver=!0,that.$(".js_leftTime").html("投注已结束"),clearInterval(that.interval),that.interval=null):that.$(".js_leftTime").html("投注剩余"+that.parseTime(leftTime))},1e3))}})},parseTime:function(t){var e=Math.floor(t/3600);return t-=60*e*60,m=Math.floor(t/60),t=Math.floor(t-60*m),e+"时"+m+"分"+t+"秒"},onCreate:function(){var that=this,data,total=0;if(that.types=types["t_"+that.GameID],that.$(".J_Header").html(that.title),localStorage[that.BetDataKey]){var sBetData=localStorage[that.BetDataKey].split("#"),betData,data=[],opt;$.each(sBetData,function(i,item){if(betData=item.split("|"),$.each(that.types,function(t,e){return 0==item.indexOf(e.type)?(opt=e,!1):void 0}),opt){opt.maxTimes&&(this.maxTimes=opt.maxTimes);var itemData={type:betData[1],typeName:opt.name},replaceCode=function(t,e){return t.replace(/\d{2}/g,function(t){return e?"<em>"+e[t]+"</em>":"<em>"+t+"</em>"}).replace(/&nbsp;&nbsp;$/,"")},codes=betData[3],pools=[];if("$"==opt.balls)for(var num;codes.length;)num=util.s2i(codes.substr(0,2)),codes=codes.substr(2),pools.push([num,codes.substr(0,2*num)]),codes=codes.substr(2*num);else opt.balls.replace(/\$(\d+)/g,function(t,e){return e=util.s2i(e),pools.push([e,codes.substr(0,2*e)]),codes=codes.substr(2*e),""});var t=opt.total.replace(/\$(\d+)/g,function(t,e){return pools[util.s2i(e)][0]}).replace(/\$/g,function(){return"util."});itemData.num=eval(t),itemData.red=opt.red.replace(/\$(\d+)/g,function(t,e){return replaceCode(pools[util.s2i(e)][1],opt.textArray)}),itemData.blue=opt.blue&&opt.blue.replace(/\$(\d+)/g,function(t,e){var n=pools[util.s2i(e)][1];return replaceCode(n,opt.blueTextArray)}),total+=itemData.num,data.push(itemData)}})}else data=null;that.total=total,that.times=1,that.number=1,that._setInfo(),that.$(".J_Total").html(that.$(".J_Times").val()+"倍"+total+"注1期"),that.$(".J_List").html(that.tmpl("list",{data:data})),that._loadData()},onStart:function(){},onResume:function(){},onDestory:function(){$("body").loading("abort").loading("hide"),this.interval&&clearInterval(this.interval)}})});
define("views/east61",["zepto","ui/sl","app","views/loading","views/selector","util"],function(t,e,n){var l=(t("zepto"),t("ui/sl"),t("app"),t("util"),t("views/loading"),t("views/selector"));n.exports=l.extend({title:"福彩6+1选号",GameID:"90016",BetDataKey:"east61BetData",buyUrl:"/east61Buy.html",tabs:[{name:"普通投注",randomFlag:!0,repeat:!0,types:[{type:"00|01",condition:"$0==1&&$1==1&&$2==1&&$3==1&&$4==1&&$5==1&&$6==1",codes:"$codes0$codes1$codes2$codes3$codes4$codes5$codes6",single:!0},{type:"00|02",condition:"($0>1||$1>1||$2>1||$3>1||$4>1||$5>1||$6>1)&&($0>0&&$1>0&&$2>0&&$3>0&&$4>0&&$5>0&&$6>0)",codes:"$0$codes0$1$codes1$2$codes2$3$codes3$4$codes4$5$codes5$6$codes6"}],balls:[{color:"red",title:"第一位",msg:"至少选择1个",randomFlag:!0,randomNum:1,range:[0,9]},{color:"red",title:"第二位",msg:"至少选择1个",randomFlag:!0,randomNum:1,range:[0,9]},{color:"red",title:"第三位",msg:"至少选择1个",randomFlag:!0,randomNum:1,range:[0,9]},{color:"red",title:"第四位",msg:"至少选择1个",randomFlag:!0,randomNum:1,range:[0,9]},{color:"red",title:"第五位",msg:"至少选择1个",randomFlag:!0,randomNum:1,range:[0,9]},{color:"red",title:"第六位",msg:"至少选择1个",randomFlag:!0,randomNum:1,range:[0,9]},{color:"blue",title:"生肖",msg:"请至少选择1个生肖",randomFlag:!0,randomNum:1,range:[1,12],textArray:"鼠 牛 虎 兔 龙 蛇 马 羊 猴 鸡 狗 猪".split(" ")}]}]})});
define("views/east61Buy",["zepto","ui/sl","util","app","views/loading","views/buy"],function(t,e,n){var l=(t("zepto"),t("ui/sl"),t("app"),t("util"),t("views/loading"),t("views/buy"));n.exports=l.extend({GameID:"90016",title:"福彩6+1投注",BetDataKey:"east61BetData",backUrl:"/east61.html"})});
define("views/f15c5",["zepto","ui/sl","app","views/loading","views/selector","util"],function(t,e,n){var l=(t("zepto"),t("ui/sl"),t("app"),t("util"),t("views/loading"),t("views/selector"));n.exports=l.extend({title:"15选5选号",GameID:"90015",BetDataKey:"f15c5BetData",buyUrl:"/f15c5Buy.html",tabs:[{name:"普通投注",randomFlag:!0,types:[{type:"00|01",condition:"$0==5",single:!0,codes:"$codes0"},{type:"00|02",condition:"$0>=6",codes:"$0$codes0"}],balls:[{color:"red",title:"号码",msg:"请至少选择5个号码",randomFlag:!0,randomNum:5,range:[1,15]}]},{name:"胆拖投注",randomFlag:!1,errors:[["$0>=5","胆码不能超过4个"]],types:[{type:"00|03",condition:"$0>=1&&$0<=4&&($0+$1>=6)",codes:"$0$codes0$1$codes1"}],balls:[{color:"red",title:"胆码",msg:"至少选择1个，最多选择4个",randomFlag:!1,range:[1,15]},{color:"red",title:"拖码",msg:"至少选择2个",randomFlag:!1,range:[1,15]}]}]})});
define("views/f15c5Buy",["zepto","ui/sl","util","app","views/loading","views/buy"],function(t,e,n){var l=(t("zepto"),t("ui/sl"),t("app"),t("util"),t("views/loading"),t("views/buy"));n.exports=l.extend({GameID:"90015",title:"15选5投注",BetDataKey:"f15c5BetData",backUrl:"/f15c5.html"})});
define("views/index",["zepto","ui/sl","app"],function(t,e,n){{var r=t("zepto"),i=t("ui/sl");t("app")}n.exports=i.Activity.extend({template:"views/index.html",_events:{touchstart:function(t){var e=this,n=t.touches[0];e.pointX=n.pageX,e.pointY=n.pageY,e.pointX<=10&&(e.isFromEdge=!0)},touchmove:function(t){if(this.isFromEdge){t.preventDefault();var e=this,n=t.touches[0],r=e.pointX-n.pageX;e._menu?(e._menu.el.style["-webkit-transform"]="translate(-"+(.6*window.innerWidth+r)+"px,0px)",e._menu.$(".menu").css({width:"100%"})):e.application.getOrCreate("/menu/index.html",function(t){e._menu=t,t.bind("Destory",function(){e._menu=null}),t.el.style["-webkit-transition-duration"]="0ms",t.el.style.width=.6*window.innerWidth+"px",t.$(".menu").css({width:"100%"}),t.el.style["-webkit-transform"]="translate(-"+(.6*window.innerWidth+r)+"px,0px)"})}},touchend:function(t){if(this.isFromEdge){if(this._menu){var e=this,n=t.changedTouches[0],r=e.pointX-n.pageX;40>r?(e._menu.$(".menu").css({width:""}),e._menu.el.style.width="",e._menu.start(),e._menu.el.style["-webkit-transform"]="",e._menu.el.style["-webkit-transition-duration"]="",location.href="#/menu/index.html"):e._menu.finish()}e.isFromEdge=!1}}},_dfdController:r.when(),_index:0,onCreate:function(){var t=this;r.each(t._events,function(e,n){var i=e.split(" "),a=i.shift();a=a.replace(/,/g," "),n=r.isFunction(n)?n:t[n],i.length>0&&""!==i[0]?t._bind(i.join(" "),a,n):t.bind(a,n)})},onStart:function(){},onResume:function(){console.log("index onResume")},onDestory:function(){console.log("index onDestory")}})});
define("views/k3",["zepto","ui/sl","app","views/loading","views/selector","util"],function(t,e,n){var l=(t("zepto"),t("ui/sl"),t("app"),t("util"),t("views/loading"),t("views/selector"));n.exports=l.extend({title:"快3选号",GameID:"32003",BetDataKey:"k3BetData",buyUrl:"/k3Buy.html",tabs:[{name:"和值",randomFlag:!0,types:[{type:"01|01",condition:"$0==1",single:!1,codes:"$codes0"},{type:"01|02",condition:"$0>1",codes:"$0$codes0"}],balls:[{color:"red",title:"和值",msg:"至少选择1个",randomFlag:!0,randomNum:1,range:[4,17]}]},{name:"三同号单选",randomFlag:!0,types:[{type:"03|01",condition:"$0==1",codes:"$codes0"}],balls:[{color:"red",title:"选号",msg:"选择1个",randomFlag:!0,single:!0,randomNum:1,range:[1,6],textArray:["111","222","333","444","555","666"]}]},{name:"三同号通选",randomFlag:!1,types:[{type:"02|01",condition:"$0==1",codes:""}],balls:[{color:"red",className:"long_text",title:"选号",msg:"选择1个",randomFlag:!1,randomNum:1,range:[0,0],codes:[""],textArray:["三同号通选"]}]},{name:"二同号单选",randomFlag:!0,types:[{type:"05|01",condition:"$0==1&&$1==1",codes:"$codes0$codes0$codes1"}],balls:[{color:"red",title:"同号",msg:"选择1个",randomFlag:!0,single:!0,randomNum:1,range:[1,6],textArray:["11","22","33","44","55","66"]},{color:"red",title:"不同号",msg:"选择1个",single:!0,randomFlag:!0,randomNum:1,range:[1,6]}]},{name:"二同号复选",randomFlag:!1,types:[{type:"04|02",condition:"$0>=1",codes:"$0$codes0"}],balls:[{color:"red",title:"同号",msg:"至少选择1个",randomFlag:!1,single:!1,randomNum:1,range:[1,6],textArray:["11*","22*","33*","44*","55*","66*"]}]},{name:"三不同号",randomFlag:!0,types:[{type:"06|01",condition:"$0==3",codes:"$codes0"},{type:"06|02",condition:"$0>=4",codes:"$0$codes0"}],balls:[{color:"red",title:"选号",msg:"至少选择3个",randomFlag:!0,randomNum:3,range:[1,6]}]},{name:"二不同号",randomFlag:!0,types:[{type:"07|02",condition:"$0==2",codes:"$0$codes0"},{type:"07|02",condition:"$0>=3",codes:"$0$codes0"}],balls:[{color:"red",title:"选号",msg:"至少选择2个",randomFlag:!0,randomNum:3,range:[1,6]}]},{name:"三连号通选",randomFlag:!1,types:[{type:"08|01",condition:"$0==1",codes:""}],balls:[{color:"red",className:"long_text",title:"选号",msg:"选择1个",randomFlag:!1,randomNum:1,range:[0,0],codes:[""],textArray:["三同号通选"]}]}]})});
define("views/k3Buy",["zepto","ui/sl","util","app","views/loading","views/buy"],function(t,e,n){var l=(t("zepto"),t("ui/sl"),t("app"),t("util"),t("views/loading"),t("views/buy"));n.exports=l.extend({GameID:"32003",title:"快3选号",BetDataKey:"k3BetData",backUrl:"/k3.html"})});
define("views/loading",["$","ui/sl","app","ui/loading"],function(t,e,n){var i=(t("zepto"),t("ui/sl")),a=t("ui/loading"),o=a.extend({check:function(t){return!(!t||"00000"!=t.ReturnCode)},keys:["pageindex","pagelen"],dataKeys:["Index","Len","","PageNum"],hasData:function(t){return!!t}});i.zeptolize("Loading",o),n.exports=o});
define("views/login",["zepto","ui/sl","ui/tabs","app","ui/loading"],function(t,e,n){{var r=(t("zepto"),t("ui/sl")),a=t("app");t("ui/loading")}n.exports=r.Activity.extend({template:"views/login.html",events:{"tap .J_Back":"back","tap .J_Login":"login"},login:function(){var t=this;a.exec("login",function(e){localStorage.auth=JSON.stringify(e),localStorage.UserName=e.UserName,localStorage.authCookies=".ASPXCOOKIEWebApi="+e[".ASPXCOOKIEWebApi"]+"; ASP.NET_SessionId="+e["ASP.NET_SessionId"],t.to("/")})},onCreate:function(){var t=this;t.login()},onStart:function(){},onResume:function(){},onDestory:function(){}})});
define("views/menu",["zepto","ui/sl","app","views/loading"],function(t,e,n){{var i=t("zepto"),r=t("ui/sl"),o=t("app");t("views/loading")}n.exports=r.Activity.extend({className:"view transparent",template:"views/menu.html",animateInClassName:"anim-left-in",animateOutClassName:"anim-left-out",events:{tap:"toBack",swipeLeft:"back","tap .J_Index":function(){this.to("/")},"tap .J_User":function(){var t=this;localStorage.authCookies?t.to("/user.html"):o.exec("login",function(e){localStorage.auth=JSON.stringify(e),localStorage.UserName=e.UserName,localStorage.authCookies=".ASPXCOOKIEWebApi="+e[".ASPXCOOKIEWebApi"]+"; ASP.NET_SessionId="+e["ASP.NET_SessionId"],t.to("/user.html")})},"tap .J_Prize":function(){this.to("/prizeList.html")},"tap .J_News":function(){this.to("/newsList.html",{easingIn:this.animateInClassName,easingOut:this.animateOutClassName})},"tap .J_Signout":function(t){var e=this;localStorage.authCookies?e.$(".J_Signout").css({position:"relative"}).loading("load",{url:"/api/AccService/Logout",check:!1,checkData:!1,success:function(e){"0"==e.StatusCode?(localStorage.authCookies="",localStorage.auth="",localStorage.UserName="",r.tip("退出成功！"),i(t.currentTarget).html("登录")):r.tip(e.ErrorMessage)},error:function(){this.hide(),r.tip("网络错误！")}}):o.exec("login",function(t){localStorage.auth=JSON.stringify(t),localStorage.UserName=t.UserName,localStorage.authCookies=".ASPXCOOKIEWebApi="+t[".ASPXCOOKIEWebApi"]+"; ASP.NET_SessionId="+t["ASP.NET_SessionId"],e.to("/")})},"tap .J_CheckUpdate":function(){var e=this;e.$(".J_CheckUpdate").addClass("ico_loading"),r.checkUpdate().done(function(t,n){o.versionName!=n?r.confirm({title:"检查更新",content:"发现了新版本,是否更新",okText:"立即更新"},function(){o.update(t,n)},function(){}):r.tip("已是最新版本"),e.$(".J_CheckUpdate").removeClass("ico_loading")}).fail(function(t){e.$(".J_CheckUpdate").removeClass("ico_loading"),r.tip(t)})}},toBack:function(t){i(t.target).hasClass("view")&&this.back()},onCreate:function(){var t=this;t.onResume()},playUnderlayer:function(t){t.$el.addClass("stop")},onStart:function(){},onResume:function(){var t=this,e=t.$(".J_Signout").css({position:"relative"}).show().html(localStorage.authCookies?"退出":"登录");localStorage.authCookies&&e.loading("load",{url:"/api/AccService/QueryLoginStatus",check:!1,checkData:!1,success:function(e){"00000"!=e.ReturnCode&&(localStorage.authCookies="",localStorage.auth="",localStorage.UserName="",t.$(".J_Signout").html("登录"))}})},onDestory:function(){}})});
define("views/news",["zepto","ui/sl","ui/tabs","app","views/loading"],function(t,e,n){{var r=(t("zepto"),t("ui/sl"));t("app"),t("views/loading")}n.exports=r.Activity.extend({template:"views/news.html",events:{"tap .J_Back":"back"},onCreate:function(){var t=this;t.$("#main").loading("load",{url:"/api/CPService/queryCpNewsContent/?ct=json&newsid="+t.route.data.id,success:function(e){t.$("#main").html(t.tmpl("article",e))}})},onStart:function(){},onResume:function(){},onDestory:function(){}})});
define("views/newsList",["zepto","ui/sl","app"],function(t,e,n){{var i=t("zepto"),r=t("ui/sl");t("app")}n.exports=r.Activity.extend({template:"views/newsList.html",events:{"tap .J_Back":function(){this.to("/")},"tap .J_List [data-id]":"toSub"},toSub:function(t){var e=i(t.currentTarget),n=e.attr("data-id");this.to("/newsSubList/"+n+".html")},onCreate:function(){},onStart:function(){},onResume:function(){},onDestory:function(){}})});
define("views/newsSubList",["zepto","ui/sl","ui/tabs","app","views/loading"],function(t,e,n){{var i=t("zepto"),a=t("ui/sl"),o=(t("app"),t("ui/tabs"));t("views/loading")}n.exports=a.Activity.extend({template:"views/newsSubList.html",events:{"tap .J_Back":"back","tap .J_List [data-id]":"toNews"},toNews:function(t){var e=i(t.currentTarget),n=e.attr("data-id");this.to("/news/"+n+".html")},onCreate:function(){var t=this;t.$el.loading("load",{url:"/api/CPService/QueryCpNewsSmallType/?ct=json&newClass="+t.route.data.id,success:function(e){var n=[];i.each(e.Data,function(t,e){n.push({id:e.NewType,title:e.NName})}),new o(t.$("#main"),{data:n,onChange:function(e,n,i){n.prop("_has_loading")?n.loading("reload"):n.prop("_has_loading",!0).loading({keys:["currentindex","pagelen"]}).loading("load",{url:"/api/CPService/queryCpNewsList/?ct=json&r=0.6135462955571711&newsclasses="+t.route.data.id+"&newstype="+i.id+"&len=10",success:function(e){n.html(t.tmpl("list",e))},refresh:function(e){n.append(t.tmpl("list",e))}})}})}})},onStart:function(){},onResume:function(){},onDestory:function(){}})});
define("views/order",["zepto","util","ui/sl","ui/tabs","app","views/loading","views/allTypes"],function(require,exports,module){var $=require("zepto"),sl=require("ui/sl"),app=require("app"),util=require("util"),Loading=require("views/loading"),types=require("views/allTypes"),common=sl.common;module.exports=sl.Activity.extend({template:"views/order.html",events:{"tap .J_Back":"back"},onCreate:function(){var that=this,orderInfo=common.orderInfo||JSON.parse(localStorage.tmpOrderData),data=[],betData,opt,typeOpts=types["t_"+orderInfo.GameID];localStorage.tmpOrderData=JSON.stringify(orderInfo),$.each(orderInfo.BetData.split("#"),function(i,item){if(betData=item.split("|"),$.each(typeOpts,function(t,e){return 0==item.indexOf(e.type)?(opt=e,!1):void 0}),!opt)return void data.push({typeName:"接口数据有误，不存在游戏代码"+item});var itemData={type:betData[1],times:util.s2i(betData[2]),typeName:opt.name},replaceCode=function(t,e){return t.replace(/\d{2}/g,function(t){return e?"<em>"+e[t]+"</em>":"<em>"+t+"</em>"}).replace(/&nbsp;&nbsp;$/,"")},codes=betData[3],pools=[];if("$"==opt.balls)for(var num;codes.length;)num=util.s2i(codes.substr(0,2)),codes=codes.substr(2),pools.push([num,codes.substr(0,2*num)]),codes=codes.substr(2*num);else opt.balls.replace(/\$(\d+)/g,function(t,e){return e=util.s2i(e),pools.push([e,codes.substr(0,2*e)]),codes=codes.substr(2*e),""});var t=opt.total.replace(/\$(\d+)/g,function(t,e){try{return pools[util.s2i(e)][0]}catch(n){return""}}).replace(/\$/g,function(){return"util."});itemData.num=eval(t),itemData.red=opt.red.replace(/\$(\d+)/g,function(t,e){try{return replaceCode(pools[util.s2i(e)][1])}catch(n){return""}}),itemData.blue=opt.blue&&opt.blue.replace(/\$(\d+)/g,function(t,e){var n=pools[util.s2i(e)][1];return replaceCode(n,opt.blueTextArray)}),data.push(itemData)}),orderInfo.codes=data,that.$("#main").html(that.tmpl("order",orderInfo)),that.$el.loading("load",{url:"/api/CPService/QueryLotteryAnnouncement/?ct=json&gameid="+orderInfo.GameID+"&wagerissue="+orderInfo.WagerIssue+"&qsnum=1",success:function(t){console.log(t)},error:function(){this.hide()}})},onStart:function(){},onResume:function(){},onDestory:function(){}})});
define("views/prize",["zepto","ui/sl","ui/tabs","app","views/loading"],function(t,e,n){var a=(t("zepto"),t("ui/sl")),s=(t("app"),t("views/loading"),a.common);n.exports=a.Activity.extend({template:"views/prize.html",events:{"tap .J_Back":"back"},onCreate:function(){var t=this;t.$("#main").html(t.tmpl("prize",s.Prize))},onStart:function(){},onResume:function(){},onDestory:function(){}})});
define("views/prizeList",["zepto","ui/sl","app","views/loading"],function(t,e,n){{var i=t("zepto"),a=t("ui/sl"),o=t("app");t("views/loading")}n.exports=a.Activity.extend({template:"views/prizeList.html",events:{"tap .J_Back":function(){this.to("/")},"tap .J_List [data-id]":"toSub"},toSub:function(t){var e=i(t.currentTarget),n=e.attr("data-id");this.to("/prizeSubList/"+n+".html")},onCreate:function(){var t=this;t.$el.loading("load",{url:"/api/CPService/QueryLotteryAnnouncement/?ct=json&gameid=&wagerissue=&qsnum=1",success:function(e){console.log(e),i.each(e.Data,function(t,e){e.Nums=e.LotteryNum.split(",")}),t.$(".J_List").html(t.tmpl("list",e))},error:function(e){500==e.status||401==e.status?(this.msg("还未登录..."),setTimeout(function(){o.exec("login",function(e){localStorage.auth=JSON.stringify(e),localStorage.UserName=e.UserName,localStorage.authCookies=".ASPXCOOKIEWebApi="+e[".ASPXCOOKIEWebApi"]+"; ASP.NET_SessionId="+e["ASP.NET_SessionId"],t.to("/")})},1e3)):this.msg("网络错误")}})},onStart:function(){},onResume:function(){},onDestory:function(){}})});
define("views/prizeSubList",["zepto","ui/sl","ui/tabs","app","views/loading"],function(t,e,n){var i=t("zepto"),o=t("ui/sl"),l=(t("app"),t("ui/tabs"),t("views/loading"),o.common);n.exports=o.Activity.extend({template:"views/prizeSubList.html",events:{"tap .J_Back":"back","tap .J_List [data-id]":"toPrize"},toPrize:function(t){var e=i(t.currentTarget),n=e.attr("data-wid");l.Prize=this.data["data_"+n],this.to("/prize.html")},onCreate:function(){var t=this;t.id=t.route.data.id,t.data={},t.$el.loading({keys:["curindex","len"]}).loading("load",{url:"/api/CPService/QueryAnnouncementList/?ct=json&gameid="+t.id+"&wagerissue=&qsnum=10",success:function(e){i.each(e.Data,function(e,n){t.data["data_"+n.WagerIssue]=n,n.Nums=n.LotteryNum.split(",")}),e.isFirst=!0,t.$(".J_List").html(t.tmpl("list",e))},refresh:function(e){i.each(e.Data,function(e,n){t.data["data_"+n.WagerIssue]=n,n.Nums=n.LotteryNum.split(",")}),e.isFirst=!1,t.$(".J_List").append(t.tmpl("list",e))}})},onStart:function(){},onResume:function(){},onDestory:function(){}})});
define("views/qlc",["zepto","ui/sl","app","views/loading","views/selector","util"],function(t,e,n){var l=(t("zepto"),t("ui/sl"),t("app"),t("util"),t("views/loading"),t("views/selector"));n.exports=l.extend({title:"七乐彩选号",GameID:"10003",BetDataKey:"qlcBetData",buyUrl:"/qlcBuy.html",tabs:[{name:"普通投注",randomFlag:!0,types:[{type:"00|01",condition:"$0==7",single:!0,codes:"$codes0"},{type:"00|02",condition:"$0>=8",codes:"$0$codes0"}],balls:[{color:"red",title:"号码",msg:"请至少选择7个号码",randomFlag:!0,randomNum:7,range:[1,30]}]},{name:"胆拖投注",randomFlag:!1,errors:[["$0>=7","胆码不能超过6个"]],types:[{type:"00|03",condition:"$0>=1&&$0<=6&&($0+$1>=8)",codes:"$0$codes0$1$codes1"}],balls:[{color:"red",title:"胆码",msg:"至少选择1个，最多选择6个",randomFlag:!1,range:[1,30]},{color:"red",title:"拖码",msg:"至少选择2个",randomFlag:!1,range:[1,30]}]}]})});
define("views/qlcBuy",["zepto","ui/sl","util","app","views/loading","views/buy"],function(t,e,n){var l=(t("zepto"),t("ui/sl"),t("app"),t("util"),t("views/loading"),t("views/buy"));n.exports=l.extend({GameID:"10003",title:"七乐彩投注",BetDataKey:"qlcBetData",backUrl:"/qlc.html"})});
define("views/selector",["zepto","ui/sl","app","views/loading","util","ui/dropdown"],function(require,exports,module){var $=require("zepto"),sl=require("ui/sl"),app=require("app"),util=require("util"),Loading=require("views/loading"),Dropdown=require("ui/dropdown");module.exports=sl.Activity.extend({template:"views/selector.html",title:"双色球选号",GameID:"10001",BetDataKey:"ssqBetData",buyUrl:"/ssqBuy.html",tabs:[],events:{"tap .J_Back":"back","tap .js_red_ball_pool em":"selectRed","tap .js_blue_ball_pool em":"selectBlue","tap .J_Clear":"clear","tap .J_Buy":"buy","tap .J_RandomOne":function(t){var e=this;e._random($(t.currentTarget).closest(".js_ball_pool"))},"tap .J_Random":function(){this.motion()}},motion:function(){var t=this;t.currentType.randomFlag&&t.currentType.$el.find(".js_ball_pool[data-num]").each(function(){t._random($(this))})},_nextStep:function(){this.to(this.buyUrl)},buy:function(){var that=this,opt=that.currentType,$pools=$(".js_ball_pool",opt.$el),pools=[];if(that.isOver)return void sl.tip("本期销售已截止！");if(localStorage[that.BetDataKey]&&0==$pools.find("em.curr").length)return void that._nextStep();$.each(opt.balls,function(t){var e=$pools.eq(t).find("em.curr"),n=[];e.each(function(){n.push(util.pad($(this).attr("data-code"),2))}),pools.push([e.length,n.join("")])});var flag=!0,type,msg;if(opt.errors&&($.each(opt.errors,function(i,errorOpt){var condition=errorOpt[0].replace(/\$(\d+)/g,function(t,e){return pools[util.s2i(e)][0]});return eval(condition)?(flag=!1,msg=errorOpt[1],!1):void 0}),!flag))return void sl.tip(msg);if($.each(opt.types,function(i,typeOpt){var condition=typeOpt.condition.replace(/\$(\d+)/g,function(t,e){return pools[util.s2i(e)][0]});return eval(condition)?(type=typeOpt,flag=!0,!1):void(flag=!1)}),!flag)return void sl.tip("请至少选择一注");var betCodes=type.codes.replace(/\$(\d+)/g,function(t,e){return","+util.pad(pools[util.s2i(e)][0])+","}).replace(/\$codes(\d+)/g,function(t,e){return pools[util.s2i(e)][1]}).replace(/\,/g,function(){return""});if(type.sort){var arr=[];betCodes.replace(/\d{2}/g,function(t){arr.push(t)}),arr.sort(),betCodes=arr.join("")}if(betCodes=type.type+"|0001|"+betCodes,type.single)if(localStorage[that.BetDataKey]&&0!=localStorage[that.BetDataKey].indexOf(type.type))sl.confirm("一笔订单只能包含一种模式注码，是否清除之前注码？",function(){localStorage[that.BetDataKey]=betCodes,that._nextStep()});else{if(localStorage[that.BetDataKey]){if(localStorage[that.BetDataKey].split("#").length>=5)return void sl.tip("一个订单单式最多只能5注！");localStorage[that.BetDataKey]+="#"+betCodes}else localStorage[that.BetDataKey]=betCodes;that._nextStep()}else localStorage[that.BetDataKey]&&0!=localStorage[that.BetDataKey].indexOf(type.type)?sl.confirm("一笔订单只能包含一种模式注码，是否清除之前注码？",function(){localStorage[that.BetDataKey]=betCodes,that._nextStep()}):(localStorage[that.BetDataKey]=betCodes,that._nextStep())},_random:function(t){var e=t.find(".bd em"),n=t[0],i=util.s2i(t.attr("data-num")),a=e.length-1;e.removeClass("curr"),n._random_timer&&clearInterval(n._random_timer),n._random_timer=setInterval(function(){var t=Math.round(Math.random()*a);e.eq(t).hasClass("curr")||(e.eq(t).addClass("curr"),i--),0>=i&&(clearInterval(n._random_timer),n._random_timer=null)},100)},onCreate:function(){var t=this,e=[];t.$(".J_Header").html(t.title),$.each(t.tabs,function(n,i){e.push({text:i.name}),html='<div class="js_type_cont'+(i.repeat?"":" js_no_repeat")+'" style="display:'+(0==n?"block":"none")+'">',$.each(i.balls,function(t,e){html+='<div class="'+e.color+' ballPool js_ball_pool"'+(e.randomFlag?' data-num="'+e.randomNum+'"':"")+'>                        <div class="hd">'+(e.randomFlag?'<span class="J_RandomOne">随机</span>':"")+' <em class="J_MsgTitle">'+e.title+'</em>                            <i class="J_Msg">'+e.msg+'</i> </div>                        <div class="bd">                            <ul class="table redBallList js_'+e.color+"_ball_pool"+(e.single?" js_single":"")+'"><li>';for(var n=1,t=e.range[0],i=e.range[1];i>=t;t++)html+="<p><em"+(e.className?' class="'+e.className+'"':"")+" data-"+e.color+'="'+t+'" data-code="'+(e.codes?e.codes[n-1]:t)+'">'+(e.textArray?e.textArray[n-1]:t)+"</em></p>",n%8==0&&(html+="</li><li>"),n++;html+="</ul>                        </div>                    </div>"}),html+="</div>";var a=$(html).appendTo(t.$("#main"));t.tabs[n].$el=a}),t.currentType=t.tabs[0],t.$(".J_Random")[t.currentType.randomFlag?"show":"hide"](),t.tabs.length>=2?t.$(".J_Type").dropdown({data:e,onChange:function(e,n){t.currentType=t.tabs[n],t.currentType.$el.show().siblings(".js_type_cont").hide(),t.$(".J_Header").html(t.title+"-"+t.currentType.name),t.$(".J_Random")[t.currentType.randomFlag?"show":"hide"]()}}):t.$(".J_Type").hide(),t._loadData(),$(window).on("motion",$.proxy(t.motion,t))},_loadData:function(){var that=this;$("body").loading("load",{url:"/api/CPService/QueryGameXspar/?ct=json&gameid="+that.GameID+"&wagerissue=",success:function(res){that.$(".js_curPhase").html(res.Data[0].WagerIssue),console.log("new Date("+res.Data[0].DrawEndTime.replace(/T|\:/g,"-").split("-").join(",")+")");var dateArr=res.Data[0].DrawEndTime.replace(/T|\:/g,"-").split("-");dateArr[1]=util.s2i(dateArr[1])-1;var endTime=eval("new Date("+dateArr.join(",")+")"),leftTime=(endTime-new Date)/1e3;0>leftTime?(that.$(".js_leftTime").html("销售已截止！"),that.isOver=!0):(that.$(".js_leftTime").html("投注剩余"+that.parseTime(leftTime)),that.interval=setInterval(function(){leftTime--,0>=leftTime?(that.isOver=!0,that.$(".js_leftTime").html("销售已截止！"),clearInterval(that.interval),that.interval=null):that.$(".js_leftTime").html("投注剩余"+that.parseTime(leftTime))},1e3))},error:function(t){if(500==t.status||401==t.status)localStorage.authCookies="",localStorage.auth="",localStorage.UserName="",this.hide(),sl.confirm({title:"登录",content:"您还未登录,是否登录",okText:"立即登录"},function(){app.exec("login",function(t){localStorage.auth=JSON.stringify(t),localStorage.UserName=t.UserName,localStorage.authCookies=".ASPXCOOKIEWebApi="+t[".ASPXCOOKIEWebApi"]+"; ASP.NET_SessionId="+t["ASP.NET_SessionId"],that._loadData()})},function(){that.to("/")});else{var e=this;this.msg("网络错误"),this.$loading.one("tap",function(){that.to("/"),e.hide()})}}})},clear:function(){this.$(".js_ball_pool .bd em.curr").removeClass("curr")},selectRed:function(e){var $target=$(e.currentTarget);$target.hasClass("curr")||this.$('.js_no_repeat [data-red="'+$target.attr("data-red")+'"].curr').removeClass("curr"),$target.toggleClass("curr");var opt=this.currentType,$pools=$(".js_ball_pool",opt.$el),pools=[];$.each(opt.balls,function(t){var e=$pools.eq(t).find("em.curr"),n="";e.each(function(){n+=util.pad($(this).attr("data-code"),2)}),pools.push([e.length,n])});var flag=!0,type,msg;return opt.errors&&($.each(opt.errors,function(i,errorOpt){var condition=errorOpt[0].replace(/\$(\d+)/g,function(t,e){return pools[util.s2i(e)][0]});return eval(condition)?(flag=!1,msg=errorOpt[1],!1):void 0}),!flag)?(sl.tip(msg),void $target.toggleClass("curr")):void($target.closest(".redBallList").hasClass("js_single")&&$target.closest("p").siblings("p").find("em.curr").removeClass("curr"))},selectBlue:function(t){$(t.currentTarget).toggleClass("curr")},parseTime:function(t){var e=Math.floor(t/3600);return t-=60*e*60,m=Math.floor(t/60),t=Math.floor(t-60*m),e+"时"+m+"分"+t+"秒"},onStart:function(){},onResume:function(){this.clear(),$(window).on("motion",$.proxy(this.motion,this))},onDestory:function(){$("body").loading("abort").loading("hide"),this.interval&&clearInterval(this.interval),$(window).off("motion",this.motion)},onPause:function(){$(window).off("motion",this.motion)}})});
define("views/ssq",["zepto","ui/sl","app","views/loading","views/selector","util"],function(t,e,n){var l=(t("zepto"),t("ui/sl"),t("app"),t("util"),t("views/loading"),t("views/selector"));n.exports=l.extend({title:"双色球选号",GameID:"10001",BetDataKey:"ssqBetData",buyUrl:"/ssqBuy.html",tabs:[{name:"普通投注",randomFlag:!0,types:[{type:"00|01",condition:"$0==6&&$1==1",single:!0,codes:"$codes0$codes1"},{type:"00|02",condition:"($0>=7&&$1>=1)||($1>=2&&$0>=6)",codes:"$0$codes0$1$codes1"}],balls:[{color:"red",title:"红球",msg:"至少选择6个红球",randomFlag:!0,randomNum:6,range:[1,33]},{color:"blue",title:"蓝球",msg:"请至少选择1个蓝球",randomFlag:!0,randomNum:1,range:[1,16]}]},{name:"胆拖投注",randomFlag:!1,errors:[["$0>5","胆码不能超过5个"]],types:[{type:"00|03",condition:"$0>=1&&$0<=5&&($0+$1>=7)&&$2>=1",codes:"$0$codes0$1$codes1$2$codes2"}],balls:[{color:"red",title:"胆码-红球",msg:"至少选择1个，最多选择5个",randomFlag:!1,range:[1,33]},{color:"red",title:"拖码-红球",msg:"至少选择2个红球",randomFlag:!1,range:[1,33]},{color:"blue",title:"蓝球",msg:"请至少选择1个蓝球",randomFlag:!1,range:[1,16]}]}]})});
define("views/ssqBuy",["zepto","ui/sl","util","app","views/loading","views/buy"],function(t,e,n){var l=(t("zepto"),t("ui/sl"),t("app"),t("util"),t("views/loading"),t("views/buy"));n.exports=l.extend({GameID:"10001",title:"双色球投注",BetDataKey:"ssqBetData",backUrl:"/ssq.html"})});
define("views/user",["zepto","ui/sl","ui/tabs","app","views/loading"],function(t,e,n){var i=t("zepto"),a=t("ui/sl"),o=t("app"),s=(t("views/loading"),t("ui/tabs"));n.exports=a.Activity.extend({template:"views/user.html",events:{"tap .J_Back":"back","tap .J_List [data-id]":"toOrder"},toOrder:function(t){var e=i(t.currentTarget).attr("data-id");a.common.orderInfo=this.orders["order_"+e],this.to("/order/"+e+".html")},onCreate:function(){var t=this;t.orders={},new s(t.$("#main"),{data:[{title:"账户余额",url:"/api/AccService/QuerySubAccount?ct=json",tmpl:"account"},{title:"投注记录",url:"/api/CPService/QueryOrderRecords/?ct=json&gameid=&wagerissue=&begintime=&endtime=&winflag=",tmpl:"record"},{title:"中奖记录",url:"/api/CPService/QueryOrderRecords/?ct=json&gameid=&wagerissue=&begintime=&endtime=&winflag=true",tmpl:"win"}],onChange:function(e,n,r){n.prop("_has_loading")?n.loading("reload"):n.prop("_has_loading",!0).loading({check:function(t){return!(!t||"00000"!=t.ReturnCode)}}).loading("load",{url:r.url,success:function(e){e.UserName=localStorage.UserName,"account"!=r.tmpl&&i.each(e.data,function(e,n){t.orders["order_"+n.OrderID]=n}),n.html(t.tmpl(r.tmpl,e))},error:function(e){500==e.status||401==e.status?(localStorage.authCookies="",localStorage.auth="",localStorage.UserName="",a.tip("还未登录..."),this.msg("还未登录..."),setTimeout(function(){o.exec("login",function(e){localStorage.auth=JSON.stringify(e),localStorage.UserName=e.UserName,localStorage.authCookies=".ASPXCOOKIEWebApi="+e[".ASPXCOOKIEWebApi"]+"; ASP.NET_SessionId="+e["ASP.NET_SessionId"],t.to("/")})},1e3)):this.msg("网络错误")},refresh:function(e){"account"!=r.tmpl&&i.each(e.data,function(e,n){t.orders["order_"+n.OrderID]=n}),n.append(t.tmpl(r.tmpl,e))}})}})},onStart:function(){},onResume:function(){},onDestory:function(){}})});