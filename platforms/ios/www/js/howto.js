app.controller('howtoCtr', [function(){

    this.closeTouch=function(){
        navi.resetToPage("html/home.html");
    }

    this.carouselChange=function(event){
        if(event.activeIndex==0){
            left.style.visibility="hidden";
            right.style.visibility="visible";
        }else if((carousel.itemCount-1)==event.activeIndex){
            left.style.visibility="visible";
            right.style.visibility="hidden";
        }else{
            left.style.visibility="visible";
            right.style.visibility="visible";
        }
    }
}]);