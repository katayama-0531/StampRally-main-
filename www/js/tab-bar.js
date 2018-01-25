app.controller('tabCtr' ,function ($scope) {
    //タブバー、ヘッダーメニューのコントローラー
    this.settingTouch=function(){
        navi.replacePage("html/setting.html");
    }
});