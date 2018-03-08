app.controller('tabCtr', ['$scope', '$http', 'page_val', 'get_img_service', function ($scope, $http, page_val, get_img_service) {
    //タブバー、ヘッダーメニューの　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　コントローラー
    this.settingTouch=function(){
        menu.toggle();
    }

    this.info=function(){
        menu.close();
        navi.resetToPage("html/info.html");
    }

    this.accountOpen=function(){
        menu.close();
        navi.pushPage("html/account.html");
    }
    
    this.howtoOpen=function(){
        menu.close();
        navi.pushPage("html/howto.html");
    }
    
    this.contractOpen=function(){
        menu.close();
        navi.pushPage("html/contract.html");
    }
    
    this.contactOpen=function(){
        menu.close();
        navi.pushPage("html/contact.html");
    }
    
    menu.addEventListener('preopen',function(event){
        if(page_val.rally_mode=="map"){
            mapapp.modifier="tappble";
            mapapp.click="tab.mapOpen()";
            mapapp.style="background-color: #ffffff;"
        }else{
            mapapp.click="";
            mapapp.style="background-color: #bcbcbc;"
        }
    });

    this.mapOpen=function(){
        if(page_val.rally_mode=="map"){
            var position=page_val.near_spot_data[0]["map_lat"]+","+page_val.near_spot_data[0]["map_lng"];
            var url="";
            //iOS,Androidでそれぞれ地図アプリを開く
            if (device.platform=="Android") {
                url="http://maps.google.com?q="+position;
            }else{
                url="maps:q="+position;
            }
            if(url!=""){
                window.open(url, "_system");
            }
        }else{
            mapapp.style="background-color: #bcbcbc;"
        }
    }

    this.newsTouch=function(){
        //mainTab.setActiveTab(0);
        // if(navi.pages[navi.pages.length-1]["id"] == 'newsPage'){
        //     navi.resetToPage("html/home.html");
        // }else{
            menu.close();
            compBtn.hide();
            stampBtn.hide();
            navi.pushPage("html/news.html");
            roadingModal.show();
        // }
    }
    this.iconTouch=function(){
        menu.close();
        mainTab.setActiveTab(0);
        if(navi.pages.length >= 2){
            navi.resetToPage("html/home.html");
        }
    }
    this.compTouch=function(){
        console.log("応募ボタンタッチ");
        compBtn.hide();
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
}]);