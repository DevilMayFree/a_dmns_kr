jQuery(document).ready(function(e){

  if(jQuery("#strategyPage_noWork").length > 0){
    // console.log("fullpage");

    new fullpage('#strategyPage',{
      // anchors: ['section0', 'section1', 'section2', 'section3', 'section4'],
      navigation: true,
      loopBottom: false,
      // loopTop: true,
      navigationPosition: 'right',
      navigationTooltips: ['#STRATEGY', '#FUND'],
      init:function(e){
        // console.log(e);
      },
      /*
      afterLoad:function(origin,destination,direction){

  			// 마지막 섹션에 도착한 경우 버튼 숨김처리
  			var sec = destination.item;
  			var secIdx = sec.getAttribute("data-index");
  			var secCnt = document.getElementsByClassName("section").length;
  			if(secIdx == secCnt){
  				document.getElementById("toNextBtn").classList.add("disN");
  			}else{
  				document.getElementById("toNextBtn").classList.remove("disN");
  			};

        // 지난 섹션에 클래스 제거
        var oldEleCnt = origin.item.querySelectorAll(".twin").length;
        for(var i=0 ; i<oldEleCnt ; i++){
          var oldEle = origin.item.querySelectorAll(".twin")[i];
          oldEle.classList.remove("act");
        };

        // 현재 섹션에 클래스 추가
        setTimeout(function(){
          var newEleCnt = destination.item.querySelectorAll(".twin.delay_0").length;
          for(var i=0 ; i<newEleCnt ; i++){
            var newEle = destination.item.querySelectorAll(".twin.delay_0")[i];
            newEle.classList.add("act");
          };
        },1);
        setTimeout(function(){
          var newEleCnt = destination.item.querySelectorAll(".twin.delay_100").length;
          for(var i=0 ; i<newEleCnt ; i++){
            var newEle = destination.item.querySelectorAll(".twin.delay_100")[i];
            newEle.classList.add("act");
          };
        },100);
  			setTimeout(function(){
          var newEleCnt = destination.item.querySelectorAll(".twin.delay_200").length;
          for(var i=0 ; i<newEleCnt ; i++){
            var newEle = destination.item.querySelectorAll(".twin.delay_200")[i];
            newEle.classList.add("act");
          };
        },200);
  			setTimeout(function(){
          var newEleCnt = destination.item.querySelectorAll(".twin.delay_300").length;
          for(var i=0 ; i<newEleCnt ; i++){
            var newEle = destination.item.querySelectorAll(".twin.delay_300")[i];
            newEle.classList.add("act");
          };
        },300);

      }
      */
    });

  };

  if(jQuery("#rightQuick").length > 0){
    // console.log(jQuery(window).height());
    /*
    var quick = jQuery("#rightQuick");
    quick.css({
      "marginTop" : "-" + parseInt(quick.height() / 2) + "px"
    });
    */
    jQuery(".rightQuick ul").css({
      "width" : parseFloat(jQuery(window).height()) + "px"
      , "right" : (parseFloat(jQuery(window).height())/2) + "px"
    });
  };

});



// 우측 네비게이션 관련 로직
jQuery(window).scroll(function(e){
  var scrTop = parseInt(jQuery(window).scrollTop());
  // console.log(scrTop);

  // jQuery(".scrEle").each(function(index){ --- });
  for(var i=jQuery(".scrEle").length ; i>0 ; i--){
    var idx = i-1;
    var ele = jQuery(".scrEle")[idx];
    var height = parseInt(ele.clientHeight);
    var top = parseInt(ele.offsetTop);
    // if(scrTop <= (height + top)){
    if(
      scrTop >= top
      &&
      scrTop <= (top + height)
    ){
      // console.log(idx + ' : ' + scrTop + ' / ' + '(' + height + ' + ' + top + ') = ' + (height + top));
      jQuery("#rightQuick ul li a").removeClass("active");
      jQuery("#rightQuick ul li").eq(idx).find(" > a").addClass("active");
      return false;
    };
  };
});



// 숫자카운팅 관련 로직
function countUp(ele){
  // this, 목표, 간격 변수 선언
  var _this = ele[0];
  var _target = parseInt(_this.getAttribute("data-target"));
  var _length = String(_target).length;

  var _gap = parseFloat(600 / _target);

  // 인터벌 변수 및 함수 선언
  var _interval = null;
  _interval = setInterval(function(){
    var _val = parseInt(_this.innerText);
    if(_val >= _target){
      _this.innerText = _target;
      clearInterval(_interval);
    }else{
      if(_length < 2){
        var _add = 1;
      }else if(_length < 3){
        var _add = 1;
      }else if(_length < 4){
        var _add = 10;
      }else if(_length < 5){
        var _add = 100;
      }else if(_length < 6){
        var _add = 1000;
      }else{
        var _add = 10000;
      };
      _this.innerText = _val + _add;
    };
  },30);

  /*
  console.log(_this);
  console.log(_target);
  console.log(_length);
  console.log('');
  */
};
jQuery(window).scroll(function(e){
  var scrTop = parseFloat(jQuery(window).scrollTop());
  var winHeight = parseFloat(jQuery(window).height());
  // console.log(scrTop);

  jQuery(".cntup").each(function(index){
    var ele = jQuery(this);
    var top = parseFloat(ele.offset().top);
    // var height = parseFloat(ele.clientHeight);
    if(
      (scrTop + (winHeight*0.9)) > top
			&&
			!ele.hasClass("active")
    ){
      ele.addClass("active");
      countUp(ele);
    };
  });
});



function goToQuick(event){
  var thisBtn = event.target;
  if(thisBtn.tagName != "A") thisBtn = thisBtn.closest("a");
  var target = thisBtn.getAttribute("data-target");
  var targetTop = jQuery(target).offset().top;

  // 버튼 비활성화
  jQuery("#rightQuick ul li a").removeClass("active");
  thisBtn.classList.add("active");

  // 섹션으로 이동
  jQuery("html, body").animate({
    "scrollTop" : parseFloat(targetTop) + "px"
  },400);
};
