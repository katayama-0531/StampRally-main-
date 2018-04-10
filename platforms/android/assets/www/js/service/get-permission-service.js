angular.module('stampRallyApp').factory('get_permission_service', ['page_val', '$filter', function(page_val, $filter){

  return{
    getPermission: function(deferred){
        var permissions = cordova.plugins.permissions; 
        //permission確認
        permissions.hasPermission(permissions.ACCESS_FINE_LOCATION, permissionCallback);
  
        function permissionCallback (status) {
          var permissionStatus = false;
          if ( status.hasPermission ) {
              console.log("位置情報使用許可済み");
              deferred.resolve(true);
          } else {
              console.warn("位置情報使用未許可");
              permissions.requestPermission(permissions.ACCESS_COARSE_LOCATION, permissionSuccess, permissionError);
              function permissionSuccess (status){
                  if( !status.hasPermission ){
                      permissionError();
                  } else {
                      console.log("位置情報使用許可した");
                      deferred.resolve(true);
                  }
              };
              function permissionError (){
                  console.warn('許可されなかった...');
                  deferred.reject(false);
              };
          }
          return deferred.promise;
        }
    },
    getGps: function(deferred, id){
        //位置情報取得
        var onGpsSuccess = function (position) {
            // 小数点第n位まで残す
            var n = 6;
            page_val.lat = Math.floor(position.coords.latitude * Math.pow(10, n)) / Math.pow(10, n);
            //緯度 TODO:テスト用
            // page_val.lat = 33.2123;
            page_val.lng = Math.floor(position.coords.longitude * Math.pow(10, n)) / Math.pow(10, n);
            //経度　TODO:テスト用
            // page_val.lng = 130.444;
            //高度
            page_val.alt = Math.floor(position.coords.altitude * Math.pow(10, n)) / Math.pow(10, n);
            //位置精度
            page_val.acc = Math.floor(position.coords.accuracy * Math.pow(10, n)) / Math.pow(10, n);
            var gpsData = {
                user_id: id,
                course_id: page_val.course_id,
                spot_id: page_val.spot_id,
                lat: page_val.lat,
                lng: page_val.lng,
                alt: page_val.alt,
                acc: page_val.acc
            };
            console.log(gpsData);
            var postData =$filter('json')(gpsData);

            deferred.resolve(postData);
        };

        var onGpsError = function (message) {
            //iOSでalterを使用すると問題が発生する可能性がある為、問題回避の為setTimeoutを使用する。
            // エラーコードのメッセージを定義
            var errorMessage = {
                0: "原因不明のエラーが発生しました。",
                1: "位置情報の取得が許可されませんでした。",
                2: "電波状況などで位置情報が取得できませんでした。",
                3: "位置情報の取得に時間がかかり過ぎてタイムアウトしました。",
            };
            deferred.reject(message);
        };
        
        //位置情報取得
        navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsError,{timeout: 20000, enableHighAccuracy: true});

        return deferred.promise;
      }
  };
}]);