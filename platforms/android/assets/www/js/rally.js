app.controller('rallyCtr', ['$scope', function($scope) {
    //ラリー帳画面のコントローラー
    var id = localStorage.getItem('ID');

    
    rallyFrame.addEventListener('load',function() {
        // iframeのwindowオブジェクトを取得
        var ifrm = rallyFrame.contentWindow;
        // 外部サイトにメッセージを投げる
        var postMessage =id;
        ifrm.postMessage(postMessage, "http://japan-izm.com/dat/kon/test/stamp/app_view/rally/index.php");
    });

}]);