app.controller('couponCtr', ['$scope', 'page_val', '$timeout', function($scope, page_val, $timeout) {

    //クーポン画面のコントローラー
    var id = localStorage.getItem('ID');
    var spotId = 0;
    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(e){
        if(event.index==3){
            // 外部サイトにメッセージを投げる
            spotId =page_val.spot_id;
            // if(spotId > 0){
            //     $timeout(function () {
            //         this.list=false;
            //         this.ditail=true;
            //       });
            // }else{
            //     $timeout(function () {
            //         this.list=true;
            //         this.ditail=false;
            //       });
            // }
            // iframeのwindowオブジェクトを取得
            var ifrm = couponFrame.contentWindow;
            ifrm.postMessage(spotId, "http://153.127.242.178/dat/kon/test/stamp/app_view/coupon/index.php");
        }
    });

    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==3){
            // 外部サイトにメッセージを投げる
            spotId =page_val.spot_id;
            // if(spotId > 0){
            //     $timeout(function () {
            //         this.list=false;
            //         this.ditail=true;
            //       });
            // }else{
            //     $timeout(function () {
            //         this.list=true;
            //         this.ditail=false;
            //       });
            // }
            // iframeのwindowオブジェクトを取得
            var ifrm = couponFrame.contentWindow;
            ifrm.postMessage(spotId, "http://153.127.242.178/dat/kon/test/stamp/app_view/coupon/index.php");
        }
    });
}]);