app.controller('starCtr', ['$scope','page_val', function($scope, page_val) {
    //お気に入り画面のコントローラー
    var id = localStorage.getItem('ID');

    //アクティブなタブの切り替え前の処理
    mainTab.on('postchange',function(event){
        if(event.index==4){
            starFrame.src=page_val.url+"star/index.php";
            // iframeのwindowオブジェクトを取得
            var ifrm = starFrame.contentWindow;
            // 外部サイトにメッセージを投げる
            var postMessage =id;
            ifrm.postMessage(postMessage, page_val.url+"star/index.php");
        }
    });

    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(event){
        if(event.index==4){
        }
    });

    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==4){
            starFrame.src=page_val.url+"star/index.php";
        }
    });

    //iframe読み込み完了後のイベント
    starFrame.addEventListener('load',function() {
        console.log("starFrame読み込み完了");
        // // iframeのwindowオブジェクトを取得
        // var ifrm = starFrame.contentWindow;
        // // 外部サイトにメッセージを投げる
        // var postMessage =id;
        // ifrm.postMessage(postMessage, page_val.url+"star/index.php");
    });
}]);