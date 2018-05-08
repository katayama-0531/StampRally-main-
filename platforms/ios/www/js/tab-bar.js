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
        if(mainTab.getActiveTabIndex()!=page_val.homeTab){
            mainTab.setActiveTab(page_val.homeTab);
        }
    }

    this.accountOpen=function(){
        menu.close();
        navi.pushPage("html/account.html");
        if(mainTab.getActiveTabIndex()!=page_val.homeTab){
            mainTab.setActiveTab(page_val.homeTab);
        }
    }
    
    this.howtoOpen=function(){
        menu.close();
        navi.pushPage("html/howto.html");
        if(mainTab.getActiveTabIndex()!=page_val.homeTab){
            mainTab.setActiveTab(page_val.homeTab);
        }
    }
    
    this.contractOpen=function(){
        menu.close();
        navi.pushPage("html/contract.html");
        if(mainTab.getActiveTabIndex()!=page_val.homeTab){
            mainTab.setActiveTab(page_val.homeTab);
        }
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
            window.open('mailto:jafstamprally@gmail.com?subject=スタンプラリーについてのお問い合わせ', '_system', 'location=yes');
        }
        menu.close();
    }
    
    menu.addEventListener('preopen',function(event){
        gpsBtn.style.visibility="hidden";
        if(page_val.rally_mode=="map_visible" || page_val.rally_mode=="spot_touch"){
            mapapp.modifier="tappble";
            mapapp.click="tab.mapOpen()";
            mapapp.style="background-color: #ffffff;"
        }else{
            mapapp.click="";
            mapapp.style="background-color: #bcbcbc;"
        }
    });

    menu.addEventListener('postclose',function(event){
        if(page_val.rally_mode!="" && mainTab.getActiveTabIndex()!=page_val.nearTab && navi.pages.length == 1){
            gpsBtn.style.visibility="visible";
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
            if(navi.topPage.id=="newsPage"){
                newsFrame.src=page_val.url+"news/index.php";
                if(device.platform == "iOS"){
                    document.getElementById('newsFrame').src=age_val.url+"news/index.php";
                }
            }else{
                navi.pushPage("html/news.html");
            }
            // roadingModal.show();
            if(mainTab.getActiveTabIndex()!=page_val.homeTab){
                mainTab.setActiveTab(page_val.homeTab);
            }
        }            
    }
    this.iconTouch=function(){
        if(page_val.maintenance==0){
            roadingModal.show();
            menu.close();
            if(mainTab.getActiveTabIndex()==page_val.homeTab){
                homeFrame.src=page_val.url+"index.php";
                if(device.platform == "iOS"){
                    document.getElementById('homeFrame').src=page_val.url+"index.php";
                }
            }else{
                mainTab.setActiveTab(page_val.homeTab);
            }
            if(navi.pages.length >= 2){
                navi.resetToPage("html/home.html");
            }
        }
        
    }
}]);