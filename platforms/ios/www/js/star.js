app.controller('starCtr', ['$scope', function($scope) {
    //お気に入り画面のコントローラー
    var id = localStorage.getItem('ID');

    starFrame.addEventListener('load',function() {
        // iframeのwindowオブジェクトを取得
        var ifrm = starFrame.contentWindow;
        // 外部サイトにメッセージを投げる
        var postMessage =id;
        ifrm.postMessage(postMessage, "http://japan-izm.com/dat/kon/test/stamp/app_view/star/index.php");
    });
    
    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==4){
            starFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/star/index.php";
        }
    });
}]);