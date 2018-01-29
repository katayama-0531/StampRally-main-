app.controller('homeCtr', ['$scope', '$http', '$timeout',function($scope, $http, $timeout){
    roadingModal.show();

    var id = localStorage.getItem('ID');
    $scope.loginClick = function() {
        login(id, $http);
    };

    $scope.loginInit = function() {
        //ログインの通信の為の準備
        app.config(function($httpProvider) {
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=utf-8';
        });
    };

    document.addEventListener("deviceready", function() {
        login(id, $http);
    });

    // homePage.addEventListener('show', function(event) {
    //     //ページが見えなくなった時
    //     navi.replacePage("html/tab-bar.html")
    // });

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
            roadingModal.hide();
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
