app.controller('couponCtr', ['$scope', 'page_val', function($scope, page_val) {
//クーポン画面のコントローラー
var id = localStorage.getItem('ID');

mainTab.on('postchange',function(e){
    if(event.index==3){
        if(page_val.spot_id == 0){
            // iframeのwindowオブジェクトを取得
            var ifrm = couponFrame.contentWindow;
            // 外部サイトにメッセージを投げる
            var postMessage =page_val.spot_id;
            ifrm.postMessage(postMessage, "http://japan-izm.com/dat/kon/test/stamp/app_view/coupon/index.php");
        }else{
            couponFrame.scr = "http://japan-izm.com/dat/kon/test/stamp/app_view/coupon/index_detail.php";
            // iframeのwindowオブジェクトを取得
            var ifrm = couponFrame.contentWindow;
            // 外部サイトにメッセージを投げる
            var postMessage =page_val.spot_id;
            ifrm.postMessage(postMessage, "http://japan-izm.com/dat/kon/test/stamp/app_view/coupon/index_detail.php");
        }
    }
});
}]);