app.controller('spotCtr', ['$scope', '$http','page_val', function ($scope, $http, page_val) {
    //近くのスポット画面のコントローラー
    var id = localStorage.getItem('ID');
    
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
    
    // メッセージ受信イベント
    window.addEventListener('message', function(event) {
        if(event.data["page"]=="coupon"){
            page_val.spot_id = event.data["spot_id"];
            var index = mainTab.getActiveTabIndex();
        }
    }, false);
}]);
