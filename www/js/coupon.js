app.controller('couponCtr', ['$scope', 'page_val', '$timeout', function($scope, page_val, $timeout) {

    //クーポン画面のコントローラー
    var id = localStorage.getItem('ID');
    var spotId = 0;

    //アクティブなタブの切り替え前の処理
    mainTab.on('postchange',function(event){
        if(event.index==3){
            console.log("couponタブへ切り替え前");
            couponFrame.scr=page_val.url+"coupon/index.php";
        }
    });

    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(e){
        if(event.index==3){
            console.log("couponタブへ切り替え完了");
            // 外部サイトにメッセージを投げる
            if(page_val.coupon=="detail"){
                var postMessage={
                    "user_id":id,
                    "spot_id":page_val.spot_id,
                    "page":"detail"
                }
                // iframeのwindowオブジェクトを取得
                var ifrm = couponFrame.contentWindow;
                ifrm.postMessage(postMessage, page_val.url+"coupon/index.php");
                page_val.coupon="";
            }else{
                var postMessage={
                    "user_id":id,
                    "spot_id":page_val.spot_id,
                    "page":""
                }
                // iframeのwindowオブジェクトを取得
                var ifrm = couponFrame.contentWindow;
                ifrm.postMessage(postMessage, page_val.url+"coupon/index.php");
            }
        }
    });

    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==3){
            console.log("couponタブが再び押された");
            couponFrame.scr=page_val.url+"coupon/index.php";
            page="";
        }
    });

    couponFrame.addEventListener('load',function() {
        console.log("couponFrame読み込み完了");
    });
}]);