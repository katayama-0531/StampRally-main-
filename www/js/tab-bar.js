app.controller('tabCtr' ,function ($scope) {
    //タブバー、ヘッダーメニューのコントローラー
    this.settingTouch=function(){
        navi.pushPage("html/setting.html");
    }
    this.newsTouch=function(){
        navi.pushPage("html/news.html");
    }
    this.iconTouch=function(){
        mainTab.setActiveTab(0);
    }
});