app.controller('tabCtr', ['$scope', '$http', 'page_val', 'get_img_service', function ($scope, $http, page_val, get_img_service) {
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
    this.compTouch=function(){
        console.log("応募ボタンタッチ");
        navi.pushPage("html/entry.html");
    }
    this.stampTouch=function(){
        console.log("スタンプを押すボタンタッチ");
        //スタンプ画像表示、アニメーション開始。
        var stampName = "stamp" + page_val.rally_id;
        var stamp = localStorage.getItem(stampName);
        stampImg.src=stamp;
        stampImg.className = "animated bounceInDown";
        stampImg.style.visibility="";
    }

    //スタンプアニメーション終了時のイベント
    stampImg.addEventListener("animationend", function () {
        switch (stampImg.className) {
            case "animated bounceInDown":
                stampImg.className = "animated fadeOut";
                break;
            case "animated fadeOut":
                //全てのアニメーションが終了したら画像を消す
                stampImg.src="";
                stampImg.className = "";
                stampImg.style.visibility="hidden";
                break;
        }
    });
}]);