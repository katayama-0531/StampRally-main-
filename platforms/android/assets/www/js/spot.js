app.controller('spotCtr', ['$scope', 'page_val', function ($scope, page_val) {
    //近くのスポット画面のコントローラー
    var id = localStorage.getItem('ID');
    var page="";
    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==2){
            roadingModal.show();
            page="";
        }
    });

    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(e){
        if(event.index==2){
            page="";
        }
    });

    //アクティブなタブの切り替え前の処理
    mainTab.on('postchange',function(event){
        if(event.index!=2){
            if(compBtn.visible){
                compBtn.hide();
            }
            if(stampBtn.visible){
                stampBtn.hide();
            }
        }

        if(event.index==2){
            roadingModal.show();
            spotFrame.src=page_val.url+"nearby/index.php";
        }
    });
    
    //iframe読み込み完了後の処理(iframe内で画面遷移した場合も呼ばれる)
    spotFrame.addEventListener('load',function() {
        console.log("spotFrame読み込み完了");
        roadingModal.show();
        if(mainTab.getActiveTabIndex()==2 && page==""){
            // iframeのwindowオブジェクトを取得
            var ifrm = spotFrame.contentWindow;
            // 外部サイトにメッセージを投げる
            var postMessage =
            {   "user":id,
                "spot_id":page_val.spot_id,
                "lat":page_val.lat,
                "lng":page_val.lng,
                "page":"spot"
        };
            ifrm.postMessage(postMessage, page_val.url+"nearby/index.php");
            page="spot";
        }else{
            roadingModal.hide();
        }
    });
}]);
