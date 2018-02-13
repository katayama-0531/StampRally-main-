var spotFrameLoad = false;
app.controller('spotCtr', ['$scope', 'page_val', function ($scope, page_val) {
    //近くのスポット画面のコントローラー
    var id = localStorage.getItem('ID');
    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==2){
            spotFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/rally/list/index.php";
        }
    });

    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(e){
        if(event.index==2){
            //checkPermission($filter);
            spotFrameLoad=true;
        }
    });

    //アクティブなタブの切り替え前の処理
    mainTab.on('postchange',function(event){
        if(event.index!=2){
            if(compBtn.style.visibility==""){
                compBtn.style.visibility="hidden";
            }
            if(stampBtn.style.visibility==""){
                stampBtn.style.visibility="hidden";
            }
        }

        if(event.index==2){
            roadingModal.show();
            spotFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/rally/list/index.php";
        }
    });
    
    //iframe読み込み完了後の処理(iframe内で画面遷移した場合も呼ばれる)
    spotFrame.addEventListener('load',function() {
        console.log("spotFrame読み込み完了");
        if(spotFrameLoad){
            roadingModal.hide();
            spotFrameLoad=false;
        }
    });

    // メッセージ受信イベント
    window.addEventListener('message', function(event) {
        if(event.data["page"]=="coupon"){
            page_val.spot_id = event.data["spot_id"];
            mainTab.setActiveTab(3);
        }
    }, false);
}]);
