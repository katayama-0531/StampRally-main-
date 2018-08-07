app.controller('inendCtr' ,['$scope','$timeout', '$q','get_http_service', function ($scope,$timeout, $q, get_http_service) {
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

    inendPage.addEventListener('init', function(event) {
        roadingModal.show();
        var page = event.target;

        if (page.id == 'inendPage') {
           var param = page.data.param;
           document.getElementById('endcord').innerHTML=param.cord;
            if(param.pass_word!=""){
                document.getElementById('endpass').innerHTML="* * * *";
            }else{
                document.getElementById('endpass').innerHTML="";
            }
        }
        roadingModal.hide();
      }, false);

    this.end=function(){
        roadingModal.show();
        //アプリ再起動
        window.location = "index.html";
    }
}]);