app.controller('tabCtr' ,['$scope', function ($scope) {
    //タブバー、ヘッダーメニューのコントローラー
    this.settingTouch=function(){
        mainTab.setActiveTab(0);
        navi.pushPage("html/setting.html");
    }
    this.newsTouch=function(){
        mainTab.setActiveTab(0);
        if(navi.pages[navi.pages.length-1]["id"] == 'newsPage'){
            navi.resetToPage("html/home.html");
        }else{
            navi.pushPage("html/news.html");
            roadingModal.show();
        }
    }
    this.iconTouch=function(){
        mainTab.setActiveTab(0);
        if(navi.pages.length >= 2){
            navi.resetToPage("html/home.html");
        }
    }
    
}]);