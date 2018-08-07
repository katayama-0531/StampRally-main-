app.controller('outendCtr',[ '$scope','$timeout', '$q','get_http_service', function ($scope, $timeout, $q, get_http_service) {
    //サービスを使うための準備
    //injectしたいサービスを記述。ngも必要。
    var injector = angular.injector(['ng','stampRallyApp']);
    //injectorからサービスを取得
    var httpService = injector.get('get_http_service');

    var getCord= function() {
        var deferred = $q.defer();
        $timeout(function() {
            id=localStorage.getItem('ID');
            httpService.getCord(deferred,id);
        }, 0)
        return deferred.promise;
    }

    outendPage.addEventListener('init', function(event) {
        roadingModal.show();
        var page = event.target;

        getCord().then(// 成功時　（deferred.resolve）
            function (msg) {
                console.log(msg);
                $scope.name=msg[0].cord;
                document.getElementById('end_pw').innerHTML="* * * *";
                roadingModal.hide();
            },
            // 失敗時　（deferred.reject）
            function (msg) {
                roadingModal.hide();
            },
            // notify呼び出し時
            function (msg) {
                roadingModal.hide();
                console.log('Notification:' + msg);
            });
        

      }, false);

    this.end=function(){
        roadingModal.show();
        //アプリ再起動
        window.location = "index.html";
    }
}]);