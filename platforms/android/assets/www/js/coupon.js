app.controller('couponCtr', ['$scope', 'page_val', '$timeout', function($scope, page_val, $timeout) {

    //クーポン画面のコントローラー
    var id = localStorage.getItem('ID');
    var spotId = 0;

    //アクティブなタブの切り替え前の処理
    mainTab.on('postchange',function(event){
        if(event.index==3){
            console.log("couponタブへ切り替え前");
            couponFrame.scr="http://japan-izm.com/dat/kon/test/stamp/app_view/coupon/index.php";
        }
    });

    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(e){
        if(event.index==3){
            console.log("couponタブへ切り替え完了");
            // 外部サイトにメッセージを投げる
            spotId =page_val.spot_id;
            // iframeのwindowオブジェクトを取得
            var ifrm = couponFrame.contentWindow;
            ifrm.postMessage(spotId, "http://japan-izm.com/dat/kon/test/stamp/app_view/coupon/index.php");
        }
    });

    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==3){
            console.log("couponタブが再び押された");
            // 外部サイトにメッセージを投げる
            spotId =page_val.spot_id;
            // iframeのwindowオブジェクトを取得
            var ifrm = couponFrame.contentWindow;
            ifrm.postMessage(spotId, "http://japan-izm.com/dat/kon/test/stamp/app_view/coupon/index.php");
        }
    });
}]);