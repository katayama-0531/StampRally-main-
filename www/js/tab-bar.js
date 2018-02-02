app.controller('tabCtr' ,['$scope',function ($scope) {
    //タブバー、ヘッダーメニューのコントローラー
    this.settingTouch=function(){
        mainTab.setActiveTab(0);
        navi.pushPage("html/setting.html");
    }
    this.newsTouch=function(){
        mainTab.setActiveTab(0);
        navi.pushPage("html/news.html");
    }
    this.iconTouch=function(){
        mainTab.setActiveTab(0);
    }
}]);