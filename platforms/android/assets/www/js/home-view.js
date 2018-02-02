app.controller('homeCtr', ['$scope', '$http', '$timeout',function($scope, $http, $timeout){
    roadingModal.show();

    var id = localStorage.getItem('ID');
    var url = "";
    $scope.loginClick = function() {
        login(id, $http);
    };

    $scope.loginInit = function() {
        //ログインの通信の為の準備
        app.config(function($httpProvider) {
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=utf-8';
        });
    };

    //JavaScriptからネイティブ機能へアクセスが可能になった時の処理
    document.addEventListener("deviceready", function() {
        if(id==""){
            var data = login(id, $http);
            id = data[1];
        }
    });
    
    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(event){
        if(event.index==0){
            homeFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/index.php";
        }
    });

    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==0){
            homeFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/index.php";
        }
    });

    if(mainTab.getActiveTabIndex()==0){
        //homeFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/index.php";
    }

    //iframe読み込み完了後の処理
    homeFrame.addEventListener('load',function() {
        // iframeのwindowオブジェクトを取得
        var ifrm = homeFrame.contentWindow;
        // 外部サイトにメッセージを投げる
        var postMessage =id;
        ifrm.postMessage(postMessage, "http://japan-izm.com/dat/kon/test/stamp/app_view/index.php");
        roadingModal.hide();
    });
    

    // メッセージ受信イベント
    window.addEventListener('message', function(event) {
        if(event.data["page"]=="list"){
            mainTab.setActiveTab(1);
        }
    }, false);

}]);

function login(id, $http) {
    //ログイン処理
    var postData = null;
    if (id) {
        postData = {
            userId: id
        };
    }
    //Ajax通信でphpにアクセス
    var url = "http://japan-izm.com/dat/kon/test/stamp/api/login.php",
        config = {
            timeout: 5000
        };
    
    var req = {
        method: 'POST',
        url: url,
        data: postData
    };

    $http(req).then(function onSuccess(data, status) {
        if (data.data[0] == "success") {
            localStorage.setItem("ID", data.data[1]);
            return data.data;
        } else {
            roadingModal.hide();
            ons.notification.alert({ message: "ログインできませんでした。", title: "エラー", cancelable: true });
            console.log(data);
        }
    }, function onError(data, status) {
        roadingModal.hide();
        ons.notification.alert({ message: "ログイン中にエラーが発生しました。", title: "エラー", cancelable: true });
        console.log("エラー："+data.data);
        console.log("ステータス："+status);
    });
}