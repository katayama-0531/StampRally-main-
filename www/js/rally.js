app.controller('rallyCtr', ['$scope', function($scope) {
    //ラリー帳画面のコントローラー
    var id = localStorage.getItem('ID');

    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==1){
            rallyFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/index_list.php";
        }
    });
    
    //iframe読み込み完了後の処理
    rallyFrame.addEventListener('load',function() {
        // iframeのwindowオブジェクトを取得
        var ifrm = rallyFrame.contentWindow;
        // 外部サイトにメッセージを投げる
        var postMessage =id;
        ifrm.postMessage(postMessage, "http://japan-izm.com/dat/kon/test/stamp/app_view/index_list.php");
    });

}]);