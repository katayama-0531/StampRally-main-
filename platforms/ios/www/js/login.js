ons.bootstrap(['stampRallyApp']);
var app = angular.module('stampRallyApp',['ngResource', 'ngStorage']);
//画像表示の際に使用する共通変数
app.constant('img_num', {
      'num': 0,
      'img_list':[]
    });
app.controller('AppController',  ['$scope', '$http', '$timeout',function($scope, $http, $timeout) {
    //bootstrap使いたいときに入れる
    //angular.bootstrap(app, ['app']);
    //ログイン画面のコントローラー
    // メンバ
    this.menu = null;
    var id = localStorage.getItem('ID');
    $scope.loginClick = function() {
        //login(id, $http);
    };

    // $scope.loginInit = function() {
    //     //ログインの通信の為の準備
    //     app.config(function($httpProvider) {
    //         $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=utf-8';
    //     });
    // };

    document.addEventListener("deviceready", function() {
        navi.replacePage("html/tab-bar.html");
        //login(id, $http);
    });
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
    var url = "http://153.127.242.178/dat/kon/test/stamp/api/login.php",
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
            navi.replacePage("html/tab-bar.html");
        } else {
            ons.notification.alert({ message: "ログインできませんでした。", title: "エラー", cancelable: true });
            console.log(data);
            retry();
        }
    }, function onError(data, status) {
        ons.notification.alert({ message: "ログイン中にエラーが発生しました。", title: "エラー", cancelable: true });
        console.log("エラー："+data.data);
        console.log("ステータス："+status);
        retry();
    });
}

function retry() {
    document.getElementsByTagName("h3")[0].innerHTML = "ログイン画面";
    loginBtn.disabled = false;
}