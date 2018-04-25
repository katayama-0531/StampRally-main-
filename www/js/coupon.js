app.controller('couponCtr', ['$timeout', '$q', 'page_val', 'get_permission_service', 'get_http_service', function($timeout, $q, page_val, get_permission_service, get_http_service) {

    //クーポン画面のコントローラー
    var id = localStorage.getItem('ID');
    var spotId = 0;
    var page="";

    //サービスを使うための準備
    //injectしたいサービスを記述。ngも必要。
    var injector = angular.injector(['ng','stampRallyApp']);
    //injectorからサービスを取得
    var permission = injector.get('get_permission_service');
    var httpService = injector.get('get_http_service');


    var permissionCheck= function() {
        var deferred = $q.defer();
        $timeout(function() {
            permission.getPermission(deferred);
        }, 0)
        return deferred.promise;
    }

    var gpsCheck = function(id) {
        var deferred = $q.defer();
        $timeout(function() {
            id=localStorage.getItem('ID');
            permission.getGps(deferred, id);
        }, 0)
        return deferred.promise;
    }

    var nearSpot= function(data) {
        var deferred = $q.defer();
        $timeout(function() {
            httpService.getNearStampSpot(deferred, data);
        }, 0)
        return deferred.promise;
    }

    var nearCoupon= function(data) {
        var deferred = $q.defer();
        $timeout(function() {
            httpService.getNearCoupon(deferred, data);
        }, 0)
        return deferred.promise;
    }

    var complete= function(id) {
        var deferred = $q.defer();
        $timeout(function() {
            id=localStorage.getItem('ID');
            httpService.checkComplete(deferred,id);
        }, 0)
        return deferred.promise;
    }

    //アクティブなタブの切り替え前の処理
    mainTab.on('postchange',function(event){
        if(event.index==page_val.couponTab){
            console.log("couponタブへ切り替え前");
            compBtn.style.visibility="hidden";
            stampBtn.style.visibility="hidden";
            page="";
            page_val.coupon="";
            couponFrame.src=page_val.url+"coupon/index.php";
            couponFrame.addEventListener('load',couponLoad);
            if(device.platform == "iOS"){
                document.getElementById('couponFrame').src=page_val.url+"coupon/index.php";
                document.getElementById('couponFrame').addEventListener('load',couponLoad);
            }
        }
    });

    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(e){
        if(event.index==page_val.couponTab){
            console.log("couponタブへ切り替え完了");
        }
    });

    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==page_val.couponTab){
            console.log("couponタブが再び押された");
            roadingModal.show();
            page="";
            page_val.coupon="";
            couponFrame.src=page_val.url+"coupon/index.php";
            couponFrame.addEventListener('load',couponLoad);

            if(device.platform == "iOS"){
                document.getElementById('couponFrame').src=page_val.url+"coupon/index.php";
                document.getElementById('couponFrame').addEventListener('load',couponLoad);
            }
        }
    });

    //iframe読み込み完了後の処理
    couponFrame.addEventListener('load',couponLoad);

    function couponLoad(){
        if(mainTab.getActiveTabIndex()==page_val.couponTab){
            console.log("couponFrame読み込み完了");
            // iframeのwindowオブジェクトを取得
            var ifrm = couponFrame.contentWindow;
            if(!ifrm){
                ifrm=document.getElementById('couponFrame').contentWindow;
            }
            // 外部サイトにメッセージを投げる
            var postMessage =
            {   "user":id,
                "course_id":page_val.course_id,
                "rally_id":page_val.rally_id,
                "spot_id":page_val.spot_id,
                "page":"home"};

            if(angular.isUndefined(page)){
                page="";
            }

            // 外部サイトにメッセージを投げる
            switch(page){
                case "":
                case "coupon":
                    if(page_val.coupon=="detail"){
                        roadingModal.show();
                        page="wait";
                        couponPermissionAndGps();
                    } else if(page_val.coupon=="list"){
                        postMessage={
                            "user":localStorage.getItem('ID'),
                            "rally_id":page_val.rally_id,
                            "coupon_id":page_val.coupon_id,
                            "spot_id":page_val.spot_id,
                            "page":"coupon"
                        }
                        // iframeのwindowオブジェクトを取得
                        var ifrm = couponFrame.contentWindow;
                        if(!ifrm){
                            ifrm=document.getElementById('couponFrame').contentWindow;
                        }
                        ifrm.postMessage(postMessage, page_val.url+"coupon/index.php");
                        roadingModal.hide();
                    }else{
                        postMessage={
                            "user":localStorage.getItem('ID'),
                            "coupon_id":page_val.coupon_id,
                            "rally_id":page_val.rally_id,
                            "spot_id":page_val.spot_id,
                            "page":""
                        }
                        ifrm.postMessage(postMessage, page_val.url+"coupon/index.php");
                    }
                    break;
                case "rally":
                    gpsBtn.style.visibility="visible";
                    ifrm.postMessage(postMessage, page_val.url+"rally/index.php");
                    break;
                case "stamp":
                    ifrm.postMessage(postMessage, page_val.url+"stamp/index.php");
                    break;
                case "list":
                    gpsBtn.style.visibility="visible";
                    ifrm.postMessage(postMessage, page_val.url+"rally/list/index.php");
                    roadingModal.hide();
                    break;
                case "spot":
                    postMessage={
                        "user":id,
                        "course_id":page_val.course_id,
                        "rally_id":page_val.rally_id,
                        "page":"home",
                        "lat":page_val.lat,
                        "lng":page_val.lng
                    }
                    gpsBtn.style.visibility="visible";
                    ifrm.postMessage(postMessage, page_val.url+"rally/map/index.php");
                    break;
                case "map":
                    postMessage={
                        "user":id,
                        "course_id":page_val.course_id,
                        "rally_id":page_val.rally_id,
                        "page":"home",
                        "lat":page_val.lat,
                        "lng":page_val.lng
                    }
                    gpsBtn.style.visibility="visible";
                    ifrm.postMessage(postMessage, page_val.url+"rally/map/index.php");
                    break;
                case "detail":
                    gpsBtn.style.visibility="visible";
                    ifrm.postMessage(postMessage, page_val.url+"detail/index.php");
                    roadingModal.hide();
                    break;
                case "list_detail":
                    gpsBtn.style.visibility="visible";
                    ifrm.postMessage(postMessage, page_val.url+"detail/index.php");
                    roadingModal.hide();
                    break;
                case "stop":
                    postMessage =
                    {   "user":id,
                        "course_id":page_val.course_id,
                        "rally_id":page_val.rally_id,
                        "spot_id":page_val.spot_id,
                        "page":"home",
                        "mode":"stop"};
                    ifrm.postMessage(postMessage, page_val.url+"rally/list/index.php");
                    roadingModal.hide();
                    break;
                case "wait":
                    break;
                default:
                    postMessage =
                    {   "user":id,
                        "course_id":page_val.course_id,
                        "rally_id":page_val.rally_id,
                        "spot_id":page_val.spot_id,
                        "page":"home",
                        "mode":"stop"};
                    gpsBtn.style.visibility="visible";
                    ifrm.postMessage(postMessage, page_val.url+"rally/list/index.php");
                    roadingModal.hide();
                    break;
            }
        }
    }

    // メッセージ受信イベント
    window.addEventListener('message', function(event) {
        if(mainTab.getActiveTabIndex()==page_val.couponTab){
            console.log("couponFrameメッセージ受信");
            console.log(event.data);
            if($.type(event.data)!="string"){
                roadingModal.show();
            }
            page_val.coupon=event.data["mode"];
            page=event.data["page"];
            if(event.data["coupon_id"]!=0 || event.data["coupon_id"] == ""){
                page_val.coupon_id=event.data["coupon_id"];
            }
            if(event.data["rally_id"]!=0 || event.data["rally_id"] == ""){
                page_val.rally_id=event.data["rally_id"];
            }
            if(event.data["page"]=="maintenance"){
                page_val.maintenance=1;
                mainTab.hide();
            }
            switch (event.data["page"]){
                case "coupon":
                    if(event.data["mode"]=="detail"){
                        couponLoad();
                    }else if(event.data["mode"]=="detail_disp_end"){
                        page="";
                        roadingModal.hide();
                    }else if(event.data["mode"]=="back"){
                        roadingModal.show();
                        couponFrame.src=page_val.url+"coupon/index.php";
                        if(device.platform == "iOS"){
                            document.getElementById('couponFrame').src=page_val.url+"coupon/index.php";
                            document.getElementById('couponFrame').addEventListener('load',couponLoad);
                        }
                    }
                    break;
                case "near":
                    roadingModal.hide();
                    break;
                case "rally":
                    page_val.spot_id=0;
                    page_val.rally_mode=event.data["mode"];
                    if(!angular.isUndefined(event.data["course_id"])){
                        page_val.course_id=event.data["course_id"];
                    }

                    if(!angular.isUndefined(event.data["spot_id"])){
                        if(event.data["spot_id"]!=0){
                            page_val.spot_id=event.data["spot_id"];
                        }
                    }
                    
                    if(event.data["stamp_type"]=="comp"){
                        page_val.stamp_comp_flg=1;
                    }else{
                        gpsBtn.style.visibility="visible";
                        compBtn.style.visibility="hidden";
                        page_val.stamp_comp_flg=0;
                    }
                    switch (event.data["mode"]){
                        case "stamp":
                            break;
                        case "url":
                            window.open(event.data["url"], '_blank');
                            roadingModal.hide();
                            break;
                        case "adress":
                            var url="";
                            //iOS,Androidでそれぞれ地図アプリを開く
                            if (device.platform=="Android") {
                                url="http://maps.google.com?q=" + encodeURI(event.data["adress"]);
                            }else{
                                url="maps://?q=" + encodeURI(event.data["adress"]);
                            }
                            if(url!=""){
                                window.open(url, "_system");
                            }
                            roadingModal.hide();
                            break;
                        case "list":
                            page="list";
                            break;
                        case "map":
                            roadingModal.show();
                            page="map";
                            break;
                        case "map_visible":
                            roadingModal.hide();
                            break;
                        case "course":
                            page="rally";
                            stampBtn.style.visibility="hidden";
                            break;
                        case "spot":
                            page="stamp";
                            stampBtn.style.visibility="hidden";
                            break;
                        case "stop":
                            page="stop";
                            page_val.rally_mode="stop";
                            break;
                        case "privilege":
                            gpsBtn.style.visibility="hidden";
                            stampBtn.style.visibility="hidden";
                            compBtn.style.visibility="hidden";
                            page="stop";
                            break;
                        case "detail":
                            if(page_val.rally_id != event.data["rally_id"]){
                                page_val.rally_id=event.data["rally_id"]
                            }
                            page="detail";
                        break;
                        case "list_detail":
                            page="list_detail";
                        break;
                        case "spot_touch":
                            var positionArray = event.data["position"].split(",");
                            var position ={
                                "map_lat":positionArray[0].slice(1),
                                "map_lng":positionArray[1].slice(0,-1)
                            };
                            page_val.near_spot_data[0]=position ;
                            roadingModal.hide();
                        break;
                        default:
                            page="rally";
                            // if(page_val.stamp_comp_flg==0){
                            //     couponPermissionAndGps();
                            // }
                            completeStampSearch(id);
                            break;
                    }
                    if(event.data["spot_id"]){
                        page_val.spot_id=event.data["spot_id"]
                        stampBtn.style.visibility="hidden";
                    }
                    break;
                case "near_spot":
                    mainTab.setActiveTab(2);
                    page_val.nearSpot=event.data["spot_id"];
                    page_val.spot_id=event.data["spot_id"];
                break;
            }
        }
    });

    //コンプリート状況確認
    function completeStampSearch(id){
        complete(id).then(
            function (msg) {
                console.log('comp:' + msg);
                if(msg[0]=="true" && page_val.stamp_comp_flg==1){
                    //コンプ済
                    compBtn.style.visibility="visible";
                    stampBtn.style.visibility="hidden";
                    gpsBtn.style.visibility="hidden";
                    page_val.stamp_comp_flg=1;
                    roadingModal.hide();
                }else if(msg[0]=="false" && page_val.stamp_comp_flg==1){
                    //コンプ済応募済み
                    compBtn.style.visibility="hidden";
                    stampBtn.style.visibility="hidden";
                    page_val.stamp_comp_flg=1;
                    roadingModal.hide();
                }else{
                    //未コンプ
                    compBtn.style.visibility="hidden";
                    page_val.stamp_comp_flg=0;
                    roadingModal.hide();
                    //couponPermissionAndGps();
                }
            },
            // 失敗時　（deferred.reject）
            function (msg) {
                // エラーコードに合わせたエラー内容をアラート表示
                setTimeout(function() {
                    ons.notification.alert({ message: "スタンプ情報取得中にエラーが発生しました。", title: "エラー", cancelable: true });
                    }, 0);
                roadingModal.hide();
        });
    }

    function couponPermissionAndGps() {
        if (device.platform == "iOS") {
            gpsCheck(id).then(
                function (msg) {
                console.log('SuccessGps:' + msg);
                if(page_val.coupon=="detail"){
                    couponSearch(msg);
                }else{
                    cNearSpotSearch(msg);
                }
            },
            // 失敗時　（deferred.reject）
            function (msg) {
                // エラーコードに合わせたエラー内容をアラート表示
                setTimeout(function() {
                    ons.notification.alert({ message: errorMessage[message.code], title: "エラー", cancelable: true });
                    }, 0);
                roadingModal.hide();
            });
        }
        if (device.platform == "Android") {
            permissionCheck().then(// 成功時　（deferred.resolve）
                function (msg) {
                    console.log('Success:' + msg);
                    gpsCheck(id).then(
                        function (msg) {
                        console.log('SuccessGps:' + msg);
                        if(page_val.coupon=="detail"){
                            couponSearch(msg);
                        }else{
                            cNearSpotSearch(msg);
                        }
                    },
                    // 失敗時　（deferred.reject）
                    function (msg) {
                        // エラーコードに合わせたエラー内容をアラート表示
                        setTimeout(function() {
                            ons.notification.alert({ message: "位置情報取得中にエラーが発生しました。コード："+msg.code, title: "エラー", cancelable: true });
                            }, 0);
                        roadingModal.hide();
                    },
                    // notify呼び出し時
                    function (msg) {
                        console.log('Notification:' + msg);
                    });
                },
                // 失敗時　（deferred.reject）
                function (msg) {
                    ons.notification.alert({ message: "位置情報へのアクセスが許可されなかったため、現在位置が取得できません。", title: "エラー", cancelable: true });
                roadingModal.hide();
                },
                // notify呼び出し時
                function (msg) {
                    console.log('Notification:' + msg);
                });
        }
    }
    
    function cNearSpotSearch (data){
        nearSpot(data).then(
            function (res) {
                if (res.length==0) {
                    stampBtn.style.visibility="hidden";
                } else {
                    gpsBtn.style.visibility="hidden";
                    stampBtn.style.visibility="visible";
                }
                roadingModal.hide();
            },
            // 失敗時　（deferred.reject）
            function (res,status) {
                roadingModal.hide();
                setTimeout(function() {
                    ons.notification.alert({ message: "周辺情報検索中にエラーが発生しました。", title: "エラー", cancelable: true });
                }, 0);
        });
    }

    function couponSearch (data){
        nearCoupon(data).then(
            function (res) {
                var postMessage="";
                if (res.length>=1) {
                    var postMessage={
                        "user":id,
                        "coupon_id":page_val.coupon_id,
                        "spot_id":page_val.spot_id,
                        "coupon":"true",
                        "page":"detail"
                    }
                }else{
                    var postMessage={
                        "user":id,
                        "coupon_id":page_val.coupon_id,
                        "spot_id":page_val.spot_id,
                        "coupon":"false",
                        "page":"detail"
                    }

                }
                // iframeのwindowオブジェクトを取得
                var ifrm = couponFrame.contentWindow;
                if(!ifrm){
                    ifrm=document.getElementById('couponFrame').contentWindow;
                }
                ifrm.postMessage(postMessage, page_val.url+"coupon_det/index.php");
            },
            // 失敗時　（deferred.reject）
            function (res,status) {
                roadingModal.hide();
                setTimeout(function() {
                    ons.notification.alert({ message: "周辺情報検索中にエラーが発生しました。", title: "エラー", cancelable: true });
                }, 0);
        });
    }
}]);

