app.controller('starCtr', ['$timeout', '$q', 'page_val', 'get_permission_service', 'get_http_service', function($timeout, $q, page_val, get_permission_service, get_http_service) {
    //お気に入り画面のコントローラー
    var id = localStorage.getItem('ID');
    var page = "";

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

    var nCoupon= function(data) {
        var deferred = $q.defer();
        $timeout(function() {
            httpService.getNearCoupon(deferred, data);
        }, 0)
        return deferred.promise;
    }

    //アクティブなタブの切り替え前の処理
    mainTab.on('postchange',function(event){
        if(event.index==page_val.starTab){
            compBtn.style.visibility="hidden";
            stampBtn.style.visibility="hidden";
            page="";
            starFrame.src=page_val.url+"star/index.php";
            starFrame.addEventListener('load',starLoad);
            if (device.platform == "iOS") {
                document.getElementById('starFrame').src=page_val.url+"star/index.php";
                document.getElementById('starFrame').addEventListener('load',starLoad);
            }
        }
    });

    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(event){
        if(event.index==page_val.starTab){
        }
    });

    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==page_val.starTab){
            console.log("starタブが再び押された");
            roadingModal.show();
            page="";
            starFrame.src=page_val.url+"star/index.php";
            starFrame.addEventListener('load',starLoad);
            if (device.platform == "iOS") {
                document.getElementById('starFrame').src=page_val.url+"star/index.php";
                document.getElementById('starFrame').addEventListener('load',starLoad);
            }
        }
    });

    //iframe読み込み完了後の処理
    starFrame.addEventListener('load',starLoad);

    //iframe読み込み完了後のイベント
    function starLoad() {
        if(mainTab.getActiveTabIndex()==page_val.starTab){
            console.log("starFrame読み込み完了");
            // iframeのwindowオブジェクトを取得
            var ifrm = starFrame.contentWindow;
            if(!ifrm){
                ifrm=document.getElementById('starFrame').contentWindow;
            }
            // 外部サイトにメッセージを投げる
            var postMessage =
            {   "user":id,
                "rally_id":page_val.rally_id,
                "course_id":page_val.course_id,
                "spot_id":page_val.spot_id,
                "page":"star"};

            if(angular.isUndefined(page)){
                page="";
            }

            // 外部サイトにメッセージを投げる
            switch(page){
                case "":
                    ifrm.postMessage(postMessage, page_val.url+"star/index.php");
                    break;
                case "star":
                    postMessage =
                    {   "user":id,
                        "rally_id":page_val.rally_id,
                        "course_id":page_val.course_id,
                        "spot_id":page_val.spot_id,
                        "page":""};
                    ifrm.postMessage(postMessage, page_val.url+"star/index.php");
                    roadingModal.hide();
                    break;
                case "rally":
                    // gpsBtn.style.visibility="visible";
                    ifrm.postMessage(postMessage, page_val.url+"rally/index.php");
                    break;
                case "stamp":
                    // gpsBtn.style.visibility="visible";
                    ifrm.postMessage(postMessage, page_val.url+"stamp/index.php");
                    break;
                case "list":
                    // gpsBtn.style.visibility="visible";
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
                    // gpsBtn.style.visibility="visible";
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
                    // gpsBtn.style.visibility="visible";
                    ifrm.postMessage(postMessage, page_val.url+"rally/map/index.php");
                    break;
                case "detail":
                    // gpsBtn.style.visibility="visible";
                    ifrm.postMessage(postMessage, page_val.url+"detail/index.php");
                    roadingModal.hide();
                    break;
                case "list_detail":
                    // gpsBtn.style.visibility="visible";
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
                    // gpsBtn.style.visibility="visible";
                    ifrm.postMessage(postMessage, page_val.url+"rally/list/index.php");
                    roadingModal.hide();
                    break;
                case "coupon":
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
                    ifrm.postMessage(postMessage, page_val.url+"rally/list/index.php");
                    roadingModal.hide();
                    break;
            }
        }
    }

    // メッセージ受信イベント
    window.addEventListener('message', function(event) {
        if(mainTab.getActiveTabIndex()==page_val.starTab){
            console.log("stariframeメッセージ受信");
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
                        roadingModal.show();
                        cPermissionAndGps();
                    }else if(event.data["mode"]=="detail_disp_end"){
                        page="";
                        roadingModal.hide();
                    }else if(event.data["mode"]=="back"){
                        roadingModal.show();
                        couponFrame.src=page_val.url+"coupon/index.php";
                        if(device.platform == "iOS"){
                            document.getElementById('starFrame').src=page_val.url+"star/index.php";
                            document.getElementById('starFrame').addEventListener('load',starLoad);
                        }
                    }else if(event.data["mode"]=="list"){
                        var postMessage={
                            "user":id,
                            "rally_id":page_val.rally_id,
                            "coupon_id":page_val.coupon_id,
                            "spot_id":page_val.spot_id,
                            "coupon":"false",
                            "mode":"coupon"
                        }
                        // iframeのwindowオブジェクトを取得
                        var ifrm = starFrame.contentWindow;
                        if(!ifrm){
                            ifrm=document.getElementById('starFrame').contentWindow;
                        }
                        ifrm.postMessage(postMessage, page_val.url+"star/index.php");
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
                    }else{
                        page_val.course_id=0;
                    }

                    if(!angular.isUndefined(event.data["spot_id"])){
                        if(event.data["spot_id"]!=0){
                            page_val.spot_id=event.data["spot_id"];
                        }
                    }else{
                        page_val.spot_id=0;
                    }
                    
                    if(event.data["stamp_type"]=="comp"){
                        compBtn.style.visibility="visible";
                        stampBtn.style.visibility="hidden";
                        page_val.stamp_comp_flg=1;
                        if(roadingModal.visible){
                            roadingModal.hide();
                        }
                    }else{
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
                            if(page_val.stamp_comp_flg==0){
                                sPermissionAndGps();
                            }
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
    }, false);

    function sPermissionAndGps() {
        if (device.platform == "iOS") {
            gpsCheck(id).then(
                function (msg) {
                    console.log('SuccessGps:' + msg);
                    sNearSpotSearch(msg);
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
                        sNearSpotSearch(msg);
                        },
                        // 失敗時　（deferred.reject）
                        function (msg) {
                            // エラーコードに合わせたエラー内容をアラート表示
                            setTimeout(function() {
                                ons.notification.alert({ message: errorMessage[message.code], title: "エラー", cancelable: true });
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

    function sNearSpotSearch (data){
        nearSpot(data).then(
            function (res) {
                if (res.length==0) {
                    stampBtn.style.visibility="hidden";
                } else {
                    stampBtn.style.visibility="visible";
                }
                page="";
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

    function cPermissionAndGps() {
        if (device.platform == "iOS") {
            gpsCheck(id).then(
                function (msg) {
                console.log('SuccessGps:' + msg);
                cSearch(msg);
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
                        cSearch(msg);
                    },
                    // 失敗時　（deferred.reject）
                    function (msg) {
                        // エラーコードに合わせたエラー内容をアラート表示
                        setTimeout(function() {
                            ons.notification.alert({ message: "位置情報取得中にエラーが発生しました。コード："+message.code, title: "エラー", cancelable: true });
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

    function cSearch (data){
        nCoupon(data).then(
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
                var ifrm = starFrame.contentWindow;
                if(!ifrm){
                    ifrm=document.getElementById('starFrame').contentWindow;
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