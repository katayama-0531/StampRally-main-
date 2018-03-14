app.controller('couponCtr', ['$scope','$http', '$filter', 'page_val', '$timeout', function($scope,$http, $filter, page_val, $timeout) {

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
        // 外部サイトにメッセージを投げる
        if(page_val.coupon=="detail"){
            roadingModal.show();
            checkCouponGps();
            page="";
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
    });

    // メッセージ受信イベント
    window.addEventListener('message', function(event) {
        if(mainTab.getActiveTabIndex()==3){
            console.log("couponFrameメッセージ受信");
            console.log(event.data);
            page_val.coupon=event.data["mode"];
            page_val.spot_id=event.data["spot_id"];
        }
    });

    function checkCouponGps(){
        //位置情報取得(パーミッション周りはiOSとAndroidで異なる為処理を分ける)
        if (device.platform == "Android") {
            var permissions = cordova.plugins.permissions; 
            //permission確認
            permissions.hasPermission(permissions.ACCESS_FINE_LOCATION, function (status) {
                if ( status.hasPermission ) {
                    console.log("位置情報使用許可済み");
                    this.getCouponGps($filter,$http,page_val);
                } else {
                    console.warn("位置情報使用未許可");
                    permissions.requestPermission(permissions.ACCESS_COARSE_LOCATION, permissionSuccess, permissionError);
                    function permissionSuccess (status){
                        if( !status.hasPermission ){
                            permissionError();
                        } else {
                            console.log("位置情報使用許可した");
                            this.getCouponGps($filter,$http,page_val);
                        }
                    };
                    function permissionError (){
                        console.warn('許可されなかった...');
                        stampPageReset();
                        ons.notification.alert({ message: "位置情報へのアクセスが許可されなかったため、現在位置が取得できません。", title: "エラー", cancelable: true });
                        roadingModal.hide();
                    };
                }
            });
        }else{
            this.getCouponGps($filter,$http,page_val);
        }
    }
}]);

function getCouponGps($filter,$http,page_val) {
    //位置情報取得
    var onGpsSuccess = function (position) {
        //この辺りで緯度、経度を送信する
        var id = localStorage.getItem('ID');
        // 小数点第n位まで残す
        var n = 6;
        page_val.lat = Math.floor(position.coords.latitude * Math.pow(10, n)) / Math.pow(10, n);
        //緯度 TODO:テスト用
        //page_val.lat = 33.5872;
        page_val.lng = Math.floor(position.coords.longitude * Math.pow(10, n)) / Math.pow(10, n);
        //経度　TODO:テスト用
        //page_val.lng = 130.416;
        //高度
        page_val.alt = Math.floor(position.coords.altitude * Math.pow(10, n)) / Math.pow(10, n);
        //位置精度
        page_val.acc = Math.floor(position.coords.accuracy * Math.pow(10, n)) / Math.pow(10, n);
        var postMessage={
            "user_id":localStorage.getItem('ID'),
            "spot_id":page_val.spot_id,
            "lat":page_val.lat,
            "lng":page_val.lng,
            "page":"detail"
        }
        // iframeのwindowオブジェクトを取得
        var ifrm = couponFrame.contentWindow;
        ifrm.postMessage(postMessage, page_val.url+"coupon/index.php");
        page_val.coupon="";
        roadingModal.hide();
    };

    var onGpsError = function (message) {
        //iOSでalterを使用すると問題が発生する可能性がある為、問題回避の為setTimeoutを使用する。
     
   setTimeout(function () {
            // エラーコードのメッセージを定義
            var errorMessage = {
                0: "原因不明のエラーが発生しました。",
                1: "位置情報の取得が許可されませんでした。",
                2: "電波状況などで位置情報が取得できませんでした。",
                3: "位置情報の取得に時間がかかり過ぎてタイムアウトしました。",
            };
            // エラーコードに合わせたエラー内容をアラート表示
            ons.notification.alert({ message: errorMessage[message.code], title: "エラー", cancelable: true });
        }, 0);
        roadingModal.hide();
    };
    //位置情報取得
    navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsError,{timeout: 20000, enableHighAccuracy: true});
}