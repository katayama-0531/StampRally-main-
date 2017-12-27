app.controller('slideMenuCtr', ['$scope', function($scope) {
    var move = false;
    //バッジ数
    this.menuCount = 100;

    this.topClick = function(event) {
        if (!move) {
            console.log("1つめクリック" + navi.pages);
            //content.load("html/top.html");
            isMenu();
        };
    };
    this.secondClick = function(event) {
        if (!move) {
            console.log("2つ目クリック");
            //content.load("html/menu1.html");
            isMenu();
        };
    };
    this.thirdClick = function(event) {
        if (!move) {
            console.log("3つ目(canvas5枚)クリック");
            //content.load("html/menu2.html");
            isMenu();
        };
    };
    this.third1Click = function(event) {
        if (!move) {
            console.log("3つ目(canvas1枚)クリック");
            //content.load("html/menu2-5.html");
            isMenu();
        };
    };
    $scope.fourthClick = function(event) {
        if (!move) {
            console.log("4つ目クリック");
            //content.load("html/menu3.html");
            isMenu();
        };
    };
}]);

function isMenu() {
    menu.toggle();
};