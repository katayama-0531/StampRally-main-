angular.module('stampRallyApp').factory('get_gps_service', ['$timeout', '$localStorage', function($timeout, $localStorage){
  return{
    getGPS: function(){

        //位置情報取得(パーミッション周りはiOSとAndroidで異なる為処理を分ける)
    if (device.platform == "Android") {
        var permissions = cordova.plugins.permissions; 
        //permission確認
        permissions.hasPermission(permissions.ACCESS_FINE_LOCATION, function (status) {
            if ( status.hasPermission ) {
                console.log("位置情報使用許可済み");
                //Angularjs 1.6以降はエラー処理を書かないとエラーになる
                return getGps().$promise.then(function(obj) {
                    return obj;
                    }, function(reason){
                    console.log(reason);
                    var saveFile = [];
                    saveFile.push(false);
                    saveFile.push("位置情報が取得出来ませんでした");
                    saveFile.push(reason);
                    return reason; // reasonを返す
                  });
              } else {
                console.warn("位置情報使用未許可");
                permissions.requestPermission(permissions.ACCESS_COARSE_LOCATION, permissionSuccess, permissionError);
                function permissionSuccess (status){
                    if( !status.hasPermission ){
                        permissionError();
                    } else {
                        return getGps();
                    }
                };
                function permissionError (){
                    console.warn('許可されなかった...');
                    var message = "位置情報へのアクセスが許可されなかったため、現在位置が取得できません。";
                    return message;
                    //ons.notification.alert({ message: "位置情報へのアクセスが許可されなかったため、現在位置が取得できません。", title: "エラー", cancelable: true });
                };
              }
        });
    }else{
        return getGps();
    }
        
    },
    getURL: function(){
      return page_val.img_list[0].img1;
    }
  };
}]);

function getGps() {
    //位置情報取得
    var onGpsSuccess = function (position) {
        //この辺りで緯度、経度を送信する
        var id = localStorage.getItem('ID');
        var n = 6; // 小数点第n位まで残す
        //緯度
        var latitude = Math.floor(position.coords.latitude * Math.pow(10, n)) / Math.pow(10, n);
        //経度
        var longitude = Math.floor(position.coords.longitude * Math.pow(10, n)) / Math.pow(10, n);
        //高度
        var altitude = Math.floor(position.coords.altitude * Math.pow(10, n)) / Math.pow(10, n);
        //位置精度
        var accuracy = Math.floor(position.coords.accuracy * Math.pow(10, n)) / Math.pow(10, n);
        var gpsData = {
            "userId": id,
            "lat": latitude,
            "lng": longitude,
            "alt": altitude,
            "acc": accuracy
        };
        return gpsData;
    };
    var onGpsError = function (message) {
        //iOSでalterを使用すると問題が発生する可能性がある為、問題回避の為setTimeoutを使用する。
        // setTimeout(function () {
        //     // エラーコードのメッセージを定義
        //     var errorMessage = {
        //         0: "原因不明のエラーが発生しました。",
        //         1: "位置情報の取得が許可されませんでした。",
        //         2: "電波状況などで位置情報が取得できませんでした。",
        //         3: "位置情報の取得に時間がかかり過ぎてタイムアウトしました。",
        //     };

        //     // エラーコードに合わせたエラー内容をアラート表示
        //     ons.notification.alert({ message: errorMessage[message.code], title: "エラー", cancelable: true });
        // }, 0);
        var errorMessage = {
            0: "原因不明のエラーが発生しました。",
            1: "位置情報の取得が許可されませんでした。",
            2: "電波状況などで位置情報が取得できませんでした。",
            3: "位置情報の取得に時間がかかり過ぎてタイムアウトしました。",
        };
        return errorMessage;
    };
    //位置情報取得
    navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsError);
};