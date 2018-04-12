app.controller('homeCtr', ['$interval', '$timeout', '$q', 'page_val', 'get_img_service', 'get_permission_service', 'get_http_service', 
function($interval, $timeout, $q, page_val, get_img_service, get_permission_service, get_http_service){
    
    roadingModal.show();
    stringCount=0;  
    localStorage.setItem('ID','95');
    var id = localStorage.getItem('ID');
    var url = "";
    var page = "";

    //サービスを使うための準備
    //injectしたいサービスを記述。ngも必要。
    var injector = angular.injector(['ng','stampRallyApp']);
    //injectorからサービスを取得
    var service = injector.get('get_img_service');
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

    var login= function() {
        var deferred = $q.defer();
        $timeout(function() {
            httpService.getLogin(deferred);
        }, 0)
        return deferred.promise;
    }

    var update= function() {
        var deferred = $q.defer();
        $timeout(function() {
            httpService.checkUpdate(deferred);
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

    var stamp= function(id) {
        var deferred = $q.defer();
        $timeout(function() {
            httpService.setStamp(deferred, id);
        }, 0)
        return deferred.promise;
    }

    //通信の為の準備
    app.config(function($httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=utf-8';
    });

    document.addEventListener("deviceready", function(){
        if(device.platform == "Android"){
            versionCheck ();
        }
    }, false);

    //アクティブなタブの切り替え前の処理
    mainTab.on('postchange',function(event){
        if(event.index==0){
            roadingModal.show();
            console.log("homeタブへ切り替え前");
            homeFrame.addEventListener('load',load);
            homeFrame.src=page_val.url+"index.php";
            page="";
            page_val.header_color_code=page_val.default_color_code;
            page_val.header_title_img=page_val.default_title_img;
            page_val.header_news_img=page_val.default_news_img;
            page_val.header_setting_img=page_val.default_setting_img;
            //スタンプが押せる画面ではないので非表示にする
            stampBtn.style.visibility="hidden";
            compBtn.style.visibility="hidden";
        }
    });
    
    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(event){
        if(event.index==0){
            console.log("homeタブへ切り替え完了");
            if(device.platform == "iOS"){
                load();
            }
        }
    });

    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(navi.pages.length >= 1){
            navi.resetToPage("html/home.html");
        }else{
            homeFrame.src=page_val.url+"index.php";
        }
        //各タブ内のURLを読み込み直す
        rallyFrame.src=page_val.url+"index_list.php";
        spotFrame.src=page_val.url+"nearby/index.php";
        couponFrame.scr=page_val.url+"coupon/index.php";
        starFrame.src=page_val.url+"star/index.php";
        if(event.index==0){
            console.log("homeタブが再度押された");                                                                                                                                                                        
            roadingModal.show();

            if(page_val.rally_id!=0){
                page_val.rally_id=0;
                page_val.course_id=0;
                page_val.spot_id=0;
                page_val.header_color_code=page_val.default_color_code;
                page_val.header_title_img=page_val.default_title_img;
                page_val.header_news_img=page_val.default_news_img;
                page_val.header_setting_img=page_val.default_setting_img;
                page="";
            }
        }
    });

    if(device.platform == "iOS"){
        document.getElementById('homeFrame').addEventListener('load',load);
    }
    //iframe読み込み完了後の処理
    homeFrame.addEventListener('load',load);

    function load() {
        if(mainTab.getActiveTabIndex()==0 || mainTab.getActiveTabIndex()==1){
            console.log("homeiframe読み込み完了");
            roadingModal.show();
            if(device.platform == "iOS" && mainTab.getActiveTabIndex()==0){
                versionCheck ();
            }
            //ヘッダーのアイコンもダウンロードしてくる
            if(header.style.backgroundColor!=page_val.header_color_code){
                header.style.backgroundColor=page_val.header_color_code;
                head_icon.src=page_val.header_title_img;
                head_news.src=page_val.header_news_img;
                head_setting.src=page_val.header_setting_img;
            }
            // iframeのwindowオブジェクトを取得
            var ifrm = homeFrame.contentWindow;
            if(!ifrm){
                ifrm=document.getElementById('homeFrame').contentWindow;
            }
            // 外部サイトにメッセージを投げる
            var postMessage =
            {   "user":id,
                "course_id":page_val.course_id,
                "rally_id":page_val.rally_id,
                "page":"home"};
            switch(page){
                case "":
                case angular.isUndefined(page):
                    ifrm.postMessage(postMessage, page_val.url+"index.html");
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
                        "course_id":page_val.course_id,
                        "rally_id":page_val.rally_id,
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
                        "course_id":page_val.course_id,
                        "rally_id":page_val.rally_id,
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
        if(mainTab.getActiveTabIndex()==0 || mainTab.getActiveTabIndex()==1){
            console.log("homeiframeメッセージ受信");
            console.log(event.data);
            roadingModal.show();
            if($.type(event.data)=="string"){
                if(stringCount==0){
                    stringCount++;
                }else{
                    roadingModal.hide();
                }
            }else{
                page_val.rally_mode='';
            }
            if(!angular.isUndefined(event.data["rally_id"])){
                if(event.data["rally_id"]!=0){
                    page_val.rally_id=event.data["rally_id"];
                }
            }
            if(!angular.isUndefined(event.data["course_id"])){
                if(event.data["course_id"]!=0){
                    page_val.course_id=event.data["course_id"];
                }
            }
            if(!angular.isUndefined(event.data["spot_id"])){
                if(event.data["spot_id"]!=0){
                    page_val.spot_id=event.data["spot_id"];
                }
            }
            page_val.pages=event.data["page"];
            switch (event.data["page"]){
                case "home":
                    page="rally";
                    if(device.platform == "iOS"){
                        if(mainTab.getActiveTabIndex()==0||mainTab.getActiveTabIndex()==1){
                            // iframeのwindowオブジェクトを取得
                            var ifrm=document.getElementById('homeFrame').contentWindow;
                            // 外部サイトにメッセージを投げる
                            var postMessage =
                            {   "user":id,
                                "course_id":page_val.course_id,
                                "rally_id":page_val.rally_id,
                                "page":"home"};
                                ifrm.postMessage(postMessage, page_val.url+"rally/index.php");
                                roadingModal.hide();
                        }
                    }
                    break;
                
                case "list":
                    mainTab.setActiveTab(1);
                    roadingModal.hide();
                    break;
                
                case "stamp":
                    page_val.spot_id=event.data["spot_id"];
                    if(page_val.stamp_comp_flg==0){
                        permissionAndGps();
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
                    page="";
                    if(!angular.isUndefined(event.data["course_id"])){
                        if(event.data["course_id"]!=0){
                            page_val.course_id=event.data["course_id"];
                        }
                    }

                    if(!angular.isUndefined(event.data["spot_id"])){
                        if(event.data["spot_id"]!=0){
                            page_val.spot_id=event.data["spot_id"];
                        }
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
                            page="detail";
                            page_val.coupon_id=0;
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
                                permissionAndGps();
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
                case "maintenance":
                    page_val.maintenance=1;
                    mainTab.hide();
                    roadingModal.hide();
                    break;
                
            }
            if(event.data["rally_id"] > 0){
                page_val.rally_id=event.data["rally_id"];
                page_val.header_color_code=event.data["color_code"];

                var stampName = "stamp" + page_val.rally_id;
                var headName = "head" + page_val.rally_id;
                localStorage.removeItem(stampName);
                var stamp = localStorage.getItem(stampName);
                var head = localStorage.getItem(headName);
                if(!stamp){
                    console.log("ダウンロード済みファイルが無い");
                    // 選択ファイルの読み込み
                    var readFilePath = encodeURI(page_val.root_url+'img/' + page_val.rally_id + '/stamp' + page_val.rally_id + '.json');
                    service.leadAndSet(readFilePath).then(function(res){
                        //ダウンロード失敗
                        if(angular.isDefined(res)){
                            //ダウンロード失敗
                            setTimeout(function() {
                                ons.notification.alert({ message: "ダウンロード中にエラーが発生しました。", title: "エラー", cancelable: true });
                                }, 0);
                            homeFrame.src=page_val.url+"index.php";
                            rallyFrame.src=page_val.url+"index_list.php";
                            roadingModal.hide();
                        }else{
                            //ダウンロード成功
                            console.log("ダウンロード成功");
                            page_val.header_title_img=localStorage.getItem("head" + page_val.rally_id);
                            page_val.stamp_img_URL=localStorage.getItem("stamp" + page_val.rally_id);
                            // page_val.stamp_img_URL="img_common/stamp_anime.gif"
                            head_icon.src=page_val.header_title_img;
                            page_val.header_news_img="img_common/header/header-news.png";
                            page_val.header_setting_img="img_common/header/header-hamb-menu.png";
                        }
                    });
                }else{
                    page_val.header_title_img=localStorage.getItem("head"+ page_val.rally_id);
                    // page_val.stamp_img_URL=localStorage.getItem("stamp" + page_val.rally_id);
                    page_val.stamp_img_URL="img_common/stamp_anime.gif"
                    head_icon.src=page_val.header_title_img;
                    page_val.header_news_img="img_common/header/header-news.png";
                    page_val.header_setting_img="img_common/header/header-hamb-menu.png";
                }
            }
        } else if(mainTab.getActiveTabIndex()==2){
            //近くのスポットタブメッセージ受信
            console.log("spotframeメッセージ受信");
            console.log(event.data);
            roadingModal.show();
            if($.type(event.data)=="string"){
                roadingModal.hide();
            }
            switch (event.data["page"]){
                case "near":
                    // page_val.rally_mode=event.data["mode"];
                    // if(event.data["mode"]=="stop"){
                    //     roadingModal.hide();
                    // }
                    roadingModal.hide();
                    break;
                case "rally":
                    page_val.spot_id=0;
                    page_val.rally_mode=event.data["mode"];
                    if(!angular.isUndefined(event.data["course_id"])){
                        if(event.data["course_id"]!=0){
                            page_val.course_id=event.data["course_id"];
                        }
                    }

                    if(!angular.isUndefined(event.data["spot_id"])){
                        if(event.data["spot_id"]!=0){
                            page_val.spot_id=event.data["spot_id"];
                        }
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
                                permissionAndGps();
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
                case "maintenance":
                    page_val.maintenance=1;
                    mainTab.hide();
                    roadingModal.hide();
                    break;
                case "coupon":
                    page_val.coupon="detail";
                    page_val.spot_id=event.data["spot_id"];
                    mainTab.setActiveTab(3);
            }
        }
        if(event.data["page"]=="maintenance"){
            page_val.maintenance=1;
            mainTab.hide();
        }
    }, false);

    //スタンプアニメーション終了時のイベント
    stampImg.addEventListener("animationend", function () {
        roadingModal.show();
        switch (stampImg.className) {
            case "animated bounceInDown":
                stampImg.className = "animated fadeOut";
                break;
            case "animated fadeOut":
                //全てのアニメーションが終了したら画像を消す
                $interval(function() {
                    stampImg.src="";
                    stampImg.className = "";
                    stampImg.style.visibility="hidden";
                }, 5000,1);
                stamp(id).then(
                    function (res) {
                        // iframeのwindowオブジェクトを取得
                        var ifrm = homeFrame.contentWindow;
                        if(!ifrm){
                            ifrm=document.getElementById('homeFrame').contentWindow;
                        }
                        // 外部サイトにメッセージを投げる
                        var postMessage =
                        {   "spot_id":Number(page_val.near_spot_data[0]["id"]),
                            "course_id":page_val.course_id,
                            "mode":res["result"]
                        };
                        //送信するデータを近くのスポット配列から消す
                        page_val.near_spot_data.splice(0,1);
                        ifrm.postMessage(postMessage, page_val.url+"rally/list/index.php");
                        if(page_val.near_spot_data.length < 1){
                            //押せるスタンプが無いので非表示にする
                            stampBtn.style.visibility="hidden";
                        }
                        if(res["result"]=="comp"){
                            //コンプリートしたので応募ボタンを表示
                            compBtn.style.visibility="visible";
                        }else if(res["result"]=="true"){
                            compBtn.style.visibility="hidden";
                        }
                        roadingModal.hide();
                    },
                    // 失敗時　（deferred.reject）
                    function (res,status) {
                        setTimeout(function() {
                            ons.notification.alert({ message: "エラーが発生しました。", title: "エラー", cancelable: true });
                            }, 0);
                        console.log(res);
                });
                break;

            default:
                roadingModal.hide();
                break;
        }
    });

    //パーミッション確認
    function permissionAndGps() {
        if (device.platform == "iOS") {
            gpsCheck(id).then(
                function (msg) {
                    console.log('SuccessGps:' + msg);
                    nearSpotSearch(msg);
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
            permissionCheck(id).then(// 成功時　（deferred.resolve）
                function (msg) {
                    console.log('Success:' + msg);
                    gpsCheck(id).then(
                        function (msg) {
                        console.log('SuccessGps:' + msg);
                        nearSpotSearch(msg);
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

    //位置情報取得
    function nearSpotSearch (data){
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

    function versionCheck (){
        update().then(function (message, url) {
            if (message == "") {
                console.log("アップデートなし");
                console.log("ユーザーID"+id);
                if(id=="" || id==null){
                    login().then(
                        function (res) {
                            if (res[0] == "success") {
                                localStorage.setItem("ID", res[1]);
                                id = res[1];
                                console.log("取得したユーザーID"+id);
                            } else {
                                roadingModal.hide();
                                setTimeout(function() {
                                    ons.notification.alert({ message: "ログインできませんでした。", title: "エラー", cancelable: true });
                                    }, 0);
                                console.log(res);
                            }
                        },
                        // 失敗時　（deferred.reject）
                        function (res,status) {
                            roadingModal.hide();
                            setTimeout(function() {
                                ons.notification.alert({ message: "ログイン中にエラーが発生しました。エラー："+res+"ステータス："+status, title: "エラー", cancelable: true });
                                }, 0);
                            
                            console.log("エラー："+res);
                            console.log("ステータス："+status);
                    });
                }
            } else {
                console.log("アップデートあり");
                alart(message);
                cordova.plugins.market.open(url);
            }
        },
        // 失敗時　（deferred.reject）
        function (res,status) {
            roadingModal.hide();
            setTimeout(function() {
                ons.notification.alert({ message: "アップデートを確認中にエラーが発生しました。エラー："+res+"ステータス："+status, title: "エラー", cancelable: true });
                }, 0);
            
            console.log("エラー："+res);
            console.log("ステータス："+status);
        });
    }
}]);