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
            permission.getGps(deferred, id);
        }, 0)
        return deferred.promise;
    }

    var nearSpot= function(data) {
        var deferred = $q.defer();
        $timeout(function() {
            httpService.getNearSpot(deferred, data);
        }, 0)
        return deferred.promise;
    }

    //アクティブなタブの切り替え前の処理
    mainTab.on('postchange',function(event){
        if(event.index==4){
            starFrame.src=page_val.url+"star/index.php";
            // iframeのwindowオブジェクトを取得
            var ifrm = starFrame.contentWindow;
            if(!ifrm){
                ifrm=document.getElementById('starFrame').contentWindow;
            }
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
        // iframeのwindowオブジェクトを取得
        var ifrm = starFrame.contentWindow;
        if(!ifrm){
            ifrm=document.getElementById('starFrame').contentWindow;
        }
        // // 外部サイトにメッセージを投げる
        // var postMessage =id;
        // ifrm.postMessage(postMessage, page_val.url+"star/index.php");
        if(mainTab.getActiveTabIndex()==4){
            // 外部サイトにメッセージを投げる
            var postMessage =
            {   "user":id,
                "rally_id":page_val.rally_id,
                "course_id":page_val.course_id,
                "page":"home"};
            switch(page){
                case "":
                case angular.isUndefined(page):
                    ifrm.postMessage(postMessage, page_val.url+"star/index.html");
                    roadingModal.hide();
                    break;
                case "rally":
                    ifrm.postMessage(postMessage, page_val.url+"rally/index.php");
                    roadingModal.hide();
                    break;
                case "stamp":
                    ifrm.postMessage(postMessage, page_val.url+"stamp/index.php");
                    break;
                case "list":
                    ifrm.postMessage(postMessage, page_val.url+"rally/list/index.php");
                    roadingModal.hide();
                    break;
                case "spot":
                    ifrm.postMessage(postMessage, page_val.url+"rally/list/index.php");
                    roadingModal.hide();
                    break;
                case "map":
                    postMessage={
                        "user":id,
                        "rally_id":page_val.rally_id,
                        "course_id":page_val.course_id,
                        "page":"home",
                        "lat":page_val.lat,
                        "lng":page_val.lng
                    }
                    ifrm.postMessage(postMessage, page_val.url+"rally/map/index.php");
                    break;
                case "detail":
                    ifrm.postMessage(postMessage, page_val.url+"detail/index.php");
                    roadingModal.hide();
                    break;
                case "list_detail":
                    ifrm.postMessage(postMessage, page_val.url+"detail/index.php");
                    roadingModal.hide();
                    break;
                default:
                    var postMessage =
                    {   "user":id,
                        "rally_id":page_val.rally_id,
                        "course_id":page_val.course_id,
                        "page":"home",
                        "mode":"stop"};
                    ifrm.postMessage(postMessage, page_val.url+"rally/list/index.php");
                    roadingModal.hide();
                    break;
            }
        }
    });

    // メッセージ受信イベント
    window.addEventListener('message', function(event) {
        if(mainTab.getActiveTabIndex()==4){
            console.log("stariframeメッセージ受信");
            console.log(event.data);
            roadingModal.show();
            if($.type(event.data)=="string"){
                roadingModal.hide();
            }else{
                page_val.rally_mode='';
            }
            switch (event.data["page"]){
                case "home":
                    page="rally";
                    break;
                
                case "list":
                    mainTab.setActiveTab(1);
                    roadingModal.hide();
                    break;
                
                case "stamp":
                    page_val.spot_id=event.data["spot_id"];
                    if(page_val.stamp_comp_flg==0){
                        sPermissionAndGps();
                    }
                    break;

                case "coupon":
                    page_val.coupon="detail";
                    page_val.spot_id=event.data["spot_id"];
                    mainTab.setActiveTab(3);
                    break;
                
                case "rally":
                    page_val.spot_id=0;
                    page_val.rally_mode=event.data["mode"];
                    if(!angular.isUndefined(event.data["course_id"])){
                        page_val.course_id=event.data["course_id"];
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
                        case "list":
                            page="list";
                            roadingModal.hide();
                            break;
                        case "map":
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
                        case "back":
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
                    page_val.spot_id=event.data["spot_id"]
                    break;
                case "maintenance":
                    page_val.maintenance=1;
                    $scope.tab=false;
                    roadingModal.hide();
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
}]);