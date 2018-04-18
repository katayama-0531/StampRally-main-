app.controller('tabCtr', ['$scope', '$http', 'page_val', 'get_img_service', function ($scope, $http, page_val, get_img_service) {
    //タブバー、ヘッダーメニューのボタン制御
    //ハンバーガーメニュー　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　コントローラー
    this.settingTouch=function(){
        if(page_val.maintenance==0){
            menu.toggle();
        }
    }

    this.info=function(){
        menu.close();
        navi.resetToPage("html/info.html");
        mainTab.setActiveTab(0);
    }

    this.accountOpen=function(){
        menu.close();
        navi.pushPage("html/account.html");
        mainTab.setActiveTab(0);
    }
    
    this.howtoOpen=function(){
        menu.close();
        navi.pushPage("html/howto.html");
        mainTab.setActiveTab(0);
    }
    
    this.contractOpen=function(){
        menu.close();
        navi.pushPage("html/contract.html");
        mainTab.setActiveTab(0);
    }
    
    this.contactOpen=function(){
        if(device.platform == "Android"){
            window.plugins.webintent.startActivity (
                {
                    action: window.plugins.webintent.ACTION_VIEW,
                    url: 'mailto:jafstamprally@gmail.com?subject=スタンプラリーについてのお問い合わせ'
                },
                function () {},
                function () {alert ('Failed to open URL via Android Intent');}
            );
        }
        if(device.platform == "iOS"){
            window.open('mailto:jafstamprally@gmail.com?subject=スタンプラリーについてのお問い合わせ', '_blank', 'location=yes');
        }
        menu.close();
    }
    
    menu.addEventListener('preopen',function(event){
        if(page_val.rally_mode=="map_visible" || page_val.rally_mode=="spot_touch"){
            mapapp.modifier="tappble";
            mapapp.click="tab.mapOpen()";
            mapapp.style="background-color: #ffffff;"
        }else{
            mapapp.click="";
            mapapp.style="background-color: #bcbcbc;"
        }
    });

    this.mapOpen=function(){
        if(page_val.rally_mode=="map_visible" || page_val.rally_mode=="spot_touch"){
            if(page_val.near_spot_data[0]){
                var position=page_val.near_spot_data[0]["map_lat"]+","+page_val.near_spot_data[0]["map_lng"];
            }
            var url="";
            //iOS,Androidでそれぞれ地図アプリを開く
            if (device.platform=="Android") {
                if(position==null||position=="undefined"){
                    url="http://maps.google.com";
                }else{
                    url="http://maps.google.com?q="+position+"(" + encodeURI(page_val.spot_name) + ")";
                }
            }else{
                if(position==null||position=="undefined"){
                    url="maps:q=";
                }else{
                    url="maps://?q=" + encodeURI(page_val.spot_name)+"&ll="+position;
                }
            }
            if(url!=""){
                window.open(url, "_system");
                menu.close();
            }
        }else{
            mapapp.style="background-color: #bcbcbc;"
        }
    }

    this.newsTouch=function(){
        if(page_val.maintenance==0){
            menu.close();
            compBtn.style.visibility="hidden";
            stampBtn.style.visibility="hidden";
            navi.pushPage("html/news.html");
            roadingModal.show();
            mainTab.setActiveTab(0);
        }            
    }
    this.iconTouch=function(){
        if(page_val.maintenance==0){
            menu.close();
            mainTab.setActiveTab(0);
            if(navi.pages.length >= 2){
                navi.resetToPage("html/home.html");
            }
        }
        
    }
}]);