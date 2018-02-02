app.controller('spotCtr', ['$scope', '$http','page_val', function ($scope, $http, page_val) {
    //近くのスポット画面のコントローラー
    var id = localStorage.getItem('ID');
    
    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==2){
            homeFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/stamp/index.php";
        }
    });

    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(e){
        if(event.index==2){
            // iframeのwindowオブジェクトを取得
            var ifrm = spotFrame.contentWindow;
            // 外部サイトにメッセージを投げる
            var postMessage =id;
            ifrm.postMessage(postMessage, "http://japan-izm.com/dat/kon/test/stamp/app_view/stamp/index.php");
            roadingModal.hide();
        }
    });
    
    //iframe読み込み完了後の処理(iframe内で画面遷移した場合も呼ばれる)
    spotFrame.addEventListener('load',function() {
        // iframeのwindowオブジェクトを取得
        var ifrm = spotFrame.contentWindow;
        // 外部サイトにメッセージを投げる
        var postMessage =id;
        //ifrm.postMessage(postMessage, "http://japan-izm.com/dat/kon/test/stamp/app_view/stamp/index.php");
    });

    // メッセージ受信イベント
    window.addEventListener('message', function(event) {
        if(event.data["page"]=="coupon"){
            page_val.spot_id = event.data["spot_id"];
            mainTab.setActiveTab(3);
        }
    }, false);
}]);
