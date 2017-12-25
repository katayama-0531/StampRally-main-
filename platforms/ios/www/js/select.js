app.controller('select', function($scope) {
    console.log("select呼ばれた");
    $scope.selectInit = function() {
        var listItem = [{name: 'スタンプラリー1', package: 200},{name: 'スタンプラリー2', package: 200}];
        console.log("配列中身"+listItem);
        angular.forEach(listItem, function(item, i) {
            console.log("中身"+item);
            $scope.name = [item.name];
        });
    };
});