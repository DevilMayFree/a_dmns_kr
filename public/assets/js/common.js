// const DOMAIN = 'MY DOMAIN';



// https 로 넘기는 로직
/*
var locationProtocol = location.protocol;
if(locationProtocol.indexOf("https") == -1){
	var refreshUrl = "https://"+location.host+location.pathname+location.search;
	location.href = refreshUrl;
};
*/



// 모바일 환경 input 태그 글입력시 함수 선언
/*
function addEvent(elem,event,fn){
	if(elem.addEventListener){
		elem.addEventListener(event,fn,false);
	}else{
		elem.attachEvent("on" + event,function(){
			return(fn.call(elem, window.event));
		});
	}
};
addEvent(element,'focus',function(){
	var that = this;
	setTimeout(function(){
		that.selectionStart = that.selectionEnd = 10000;
	},0);
});
*/



// 현재 클라이언트가 PC 인지 Mobile 인지 확인하는 함수 선언
function getUserAgent(){
	var filter_pc = "win16|win32|win64|mac";

	if(navigator.platform){
		if(filter_pc.indexOf(navigator.platform.toLowerCase()) < 0){
			return "mobile";
		}else{
			return "pc";
		};
	}else{
		return false;
	};
};



/* @@@@@ closest 대체 함수 선언 @@@@@::START */

/*
function closestFunc(obj,target){
	// 태그, 클래스명, 아이디 값으로 찾기
	var var_i = 0;
	while(obj.tagName != target){
		obj = obj.parentNode;
		var_i++;

		if(!obj){
			return null;
		};
		return obj;
	};
};
*/
if (!Element.prototype.matches)
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
                                Element.prototype.webkitMatchesSelector;
if (!Element.prototype.closest)
    Element.prototype.closest = function(s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement;
        } while (el !== null);
        return null;
    };

/* @@@@@ closest 대체 함수 선언 @@@@@::CLEAR */



/* @@@@@ trigger 대체 함수 선언 @@@@@::START */

function fireEvent(node,eventName){
	// Make sure we use the ownerDocument from the provided node to avoid cross-window problems
	var doc;
	if(node.ownerDocument){
		doc = node.ownerDocument;
	}else if(node.nodeType == 9){
	// the node may be the document itself, nodeType 9 = DOCUMENT_NODE
		doc = node;
	}else{
		throw new Error("Invalid node passed to fireEvent: " + node.id);
	};

	if(node.dispatchEvent){
		// Gecko-style approach (now the standard) takes more work
		var eventClass = "";

		// Different events have different event classes.
		// If this switch statement can't map an eventName to an eventClass,
		// the event firing is going to fail.
		switch(eventName){
			case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
			case "mousedown":
			case "mouseup":
				eventClass = "MouseEvents";
			break;

			case "focus":
			case "change":
			case "blur":
			case "select":
				eventClass = "HTMLEvents";
			break;

			default:
				throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
			break;
		};
		var event = doc.createEvent(eventClass);
		event.initEvent(eventName,true,true); // All events created as bubbling and cancelable.

		event.synthetic = true; // allow detection of synthetic events
		// The second parameter says go ahead with the default action
		node.dispatchEvent(event,true);
	}else if(node.fireEvent){
		// IE-old school style, you can drop this if you don't need to support IE8 and lower
		var event = doc.createEventObject();
		event.synthetic = true; // allow detection of synthetic events
		node.fireEvent("on" + eventName, event);
	};
};

/* @@@@@ trigger 대체 함수 선언 @@@@@::CLEAR */



/* @@@@@ jQuery > index() 대체 함수 선언 @@@@@::START */

function getElementIndex(node,num){
    var index = 0;
    while((node = node.previousElementSibling)){
        index++;
    };
    return Number(index) + num;
}

/* @@@@@ jQuery > index() 대체 함수 선언 @@@@@::CLEAR */



/* @@@@@ URL - Query String 반환 함수 @@@@@::START */

function getQueryString(param){
	if(location.search != ''){

		var urlSep = location.search.split("?");
		urlSep = urlSep[1].split("&");
		for(var i in urlSep){
			var attr = urlSep[i];
			if(attr.indexOf(param + "=") != -1){
				var attrSep = attr.split("=");
				return attrSep[1];
			};
		};

	}else{

		return false;

	};
}

/* @@@@@ URL - Query String 반환 함수 @@@@@::CLEAR */



/* @@@@@ 특정 쿼리변수를 포함하는 URL 반환 함수 @@@@@::START */

function getTargetURL(keys,values,rem,state){
	// 목표 URL 변수
	var targetUrl = '';
	var targetArr = [];
	var targetKey = [];
	var targetValue = [];

	// 쿼리변수가 존재한다면,
	if(location.search != ""){
		var urlQuery = location.search.split("?");
		urlQuery = urlQuery[1];

		// 쿼리변수가 복수개수라면,
		if(urlQuery.indexOf("&")){
			var queryArr = urlQuery.split("&");

		// 쿼리변수가 한개라면,
		}else{
			var queryArr = [urlQuery];
		};


		// URL 교체형식이 업데이트라면,
		if(state == "update"){

			for(var j=0 ; j<queryArr.length ; j++){
				var queryAttr = queryArr[j].split("=");

				var delState = false;
				for(var r=0 ; r<rem.length ; r++){
					if(queryAttr[0] == rem[r]) delState = true;
				};

				if(delState == false){
					targetArr[queryAttr[0]] = queryAttr[1];
					targetKey.push(queryAttr[0]);
					targetValue.push(queryAttr[1]);

					for(var i=0 ; i<keys.length ; i++){
						if(queryAttr[0] == keys[i]){
							targetArr[queryAttr[0]] = values[i];
							targetValue[j] = values[i];
						};
					};
				};
			};

			for(var i=0 ; i<keys.length ; i++){
				if(!targetArr[keys[i]]){
					targetArr[keys[i]] = values[i];
					targetKey.push(keys[i]);
					targetValue.push(values[i]);
				};
			};

		// URL 교체형식이 변경이라면,
		}else if(state == "change"){

			for(var i=0 ; i<keys.length ; i++){
				if(!targetArr[keys[i]]){
					targetArr[keys[i]] = values[i];
					targetKey.push(keys[i]);
					targetValue.push(values[i]);
				};
			};

		};

	// 쿼리변수가 존재하지 않는다면,
	}else{
		for(var i=0 ; i<keys.length ; i++){
			targetArr[keys[i]] = values[i];
			targetKey.push(keys[i]);
			targetValue.push(values[i]);
		};
	};

	for(var key in targetArr){
		if(key == "page"){
			targetUrl += key + "=1&";
		}else{
			targetUrl += key + "=" + targetArr[key] + "&";
		};
	};

	// 마지막 & 제거 로직
	var targetUrl_new = '';
	var targetUrlSep = targetUrl.split("&");
	for(var i=0 ; i<targetUrlSep.length ; i++){
		targetUrl_new += targetUrlSep[i];
		if(i < (targetUrlSep.length-2)) targetUrl_new += "&";
	};

	return targetUrl_new;
};

/* @@@@@ 특정 쿼리변수를 포함하는 URL 반환 함수 @@@@@::CLEAR */



/* @@@@@ focus 및 click 초기화용 어그로 함수 선언 @@@@@::START */

function callUgro(){
	fireEvent(document.getElementById('ugroEle'),'click');
};

/* @@@@@ focus 및 click 초기화용 어그로 함수 선언 @@@@@::CLEAR */



/* @@@@@ 업로드 파일의 확장자 얻는 함수 선언 @@@@@::START */

function getFileExtension(fileName){
	var parts = fileName.split(".");
	return parts[parts.length-1];
}

/* @@@@@ 업로드 파일의 확장자 얻는 함수 선언 @@@@@::CLEAR */



/* @@@@@ A 라는 접속사 여부에 따라 A or B 접속사 추가 함수 선언 @@@@@::START */

function setConjunction(txt,a,b){
	if(txt.indexOf(a) == -1){
		txt += a;
	}else{
		txt += b;
	};

	return txt;
};

/* @@@@@ A 라는 접속사 여부에 따라 A or B 접속사 추가 함수 선언 @@@@@::CLEAR */



/* @@@@@ 세자리 콤마(,) 삽입하거나 제외하는 함수 @@@@@::START */

function number_format(num){
	var nArr = String(num).split('').join(',').split('');
	for( var i=nArr.length-1, j=1; i>=0; i--, j++)  if( j%6 != 0 && j%2 == 0) nArr[i] = '';
	return nArr.join('');
};

function format_numbering(num){
	return num.replace(/,/ig,"");
};

jQuery(document).ready(function(e){
	jQuery(".numberingInput").on("focus",function(e){
		jQuery(this).val(format_numbering(jQuery(this).val()));
	});
	jQuery(".numberingInput").on("focusout",function(e){
		var prcNumber = number_format(jQuery(this).val());
		jQuery(this).val(prcNumber);
	});
});

/* @@@@@ 세자리 콤마(,) 삽입하거나 제외하는 함수 @@@@@::CLEAR */



/* @@@@@ 특수문자 입력 방지 함수 @@@@@::START */

function preventSpecialCharacter(event){
	//정규식 구문
	var RegExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;

	// var obj = document.getElementsByName("cmtTxt")[0];
	var obj = event.target;

	// 특수문자를 지우는 구문
	if (RegExp.test(obj.value)) {
		alert("특수문자는 입력하실 수 없습니다.");
		obj.value = obj.value.substring(0, obj.value.length - 1);
	}
};

/* @@@@@ 특수문자 입력 방지 함수 @@@@@::CLEAR */



/* @@@@@ 상위 엘리먼트 삭제 버튼 클릭 함수 @@@@@::START */

function delParentObj(event,obj){
	var thisEle = event.target;
	var delTarget = thisEle.closest(obj);

	delTarget.parentNode.removeChild(delTarget);
};

/* @@@@@ 상위 엘리먼트 삭제 버튼 클릭 함수 @@@@@::CLEAR */



/* @@@ 카테고리 탭 영역 @@@::START */

jQuery(document).ready(function(e){
	jQuery(".category-wrap .category-tab a").click(function(e){
	  var thisBtn = jQuery(this);
	  var wrapper = thisBtn.closest(".category-wrap");
	  wrapper.find(".category-tab a").removeClass("active");
	  thisBtn.addClass("active");

	  wrapper.find(".category-cons .category-con").each(function(index){
	    jQuery(this).removeClass("active");
	    if(jQuery(this).attr("data-index") == thisBtn.attr("data-index")) jQuery(this).addClass("active");
	  });
	});
});

/* @@@ 카테고리 탭 영역 @@@::CLEAR */



/* @@@@@ 컨텐츠 검색 관련 함수 @@@@@::START */

// 검색타입 변경 시 함수 선언
function searchTypeChange(event){
	var thisSel = event.target;
	var thisVal = thisSel.value;

	var typeCount = document.querySelectorAll('.searchType').length;
	for(var i=0 ; i<typeCount ; i++){
		var type = document.querySelectorAll('.searchType')[i];
		type.classList.remove('active');
	}

	var optCount = thisSel.querySelectorAll('option').length;
	for(var i=0 ; i<optCount ; i++){
		var opt = thisSel.querySelectorAll('option')[i];
		if(opt.value == thisVal){
			for(var j=0 ; j<typeCount ; j++){
				var type = document.querySelectorAll('.searchType')[j];
				if(type.getAttribute('data-type') == opt.getAttribute('data-type')){
					type.classList.add('active');
				}
			}
		}
	}
}

// 검색버튼 클릭시 함수 선언
function searchFunc(){
	// 카테고리
	var category = document.getElementById('searchCategory');

	// 카테고리가 예약일자 or 관람일자 인 경우,
	if(
		category.value == 'date'
	){
		var word = '';
		var dateCount = document.querySelectorAll('.searchType.active .statsCalendar').length;
		for(var i=0 ; i<dateCount ; i++){
			var date = document.querySelectorAll('.searchType.active .statsCalendar')[i];
			word += date.value;
			if(i < (dateCount-1)) word += '|';
		}
	}else{
		var inp = document.querySelector('.searchType.active');
		var word = encodeURIComponent(inp.value);
	}

	var keyArr = ['c','w'];
	var valueArr = [category.value,word];
	var rem = [];

	var targetUrl = getTargetURL(keyArr,valueArr,rem,"update");

	searchUrl = location.pathname + "?" + targetUrl;

	// console.log(searchUrl);
	location.href = searchUrl;
}

// 정렬콤보박스 변경시 함수 선언
function sortFunc(){
	// 정렬값 콤보박스
	var sort = document.getElementById('sortSel');

	var keyArr = ['s'];
	var valueArr = [sort.value];
	var rem = [];

	var targetUrl = getTargetURL(keyArr,valueArr,rem,"update");

	searchUrl = location.pathname + "?" + targetUrl;

	// console.log(searchUrl);
	location.href = searchUrl;
}

/* @@@@@ 컨텐츠 검색 관련 함수 @@@@@::CLEAR */



/* @@@@@ 회원정보 입력시 이메일 선택관련 함수 @@@@@::START */

function chkPortal(event){
	var thisSel = event.target;
	var thisWrapper = thisSel.closest(".emailWrapper");

	// 직접입력인 경우,
	if(thisSel.value == "direct"){
		thisWrapper.classList.add("direct");

	// 직접입력이 아닌 경우,
	}else{
		thisWrapper.classList.remove("direct");
	}
}

/* @@@@@ 회원정보 입력시 이메일 선택관련 함수 @@@@@::CLEAR */



/* @@@@@ 페이지 URL 뒤로가기 함수 @@@@@::START */

function goToPrevURL(){
	var refer = document.referrer;

	if(refer == ''){
		location.href = DOMAIN;
	}else{
		location.href = refer;
	}
}

function goBackURL(referrer){
	var refer = document.referrer;

	if(refer == ''){
		var targetUrl = DOMAIN + referrer;
	}else{
		var targetUrl = refer;
	}

	location.href = targetUrl;
}

/* @@@@@ 페이지 URL 뒤로가기 함수 @@@@@::CLEAR */



// 정규표현식 선언
// [정규표현식 변수].test([테스트할 변수]) ==> 형태로 사용
var regTest_cname = /^[가-힇A-Za-z0-9]+$/;
var regTest_name = /^[가-힇A-Za-z]+$/;
var regTest_id = /^[a-zA-Z0-9_]*$/;
var regTest_pw = /^[a-z0-9_]{8,20}$/;
var regTest_email = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
var regTest_Daddr = /^[A-Za-z가-힇ㄱ-ㅎㅏ-ㅣ0-9\s-_\._]*$/;
var regTest_num = /^[0-9]{0,100}$/;
var regTest_numLimit6 = /^[0-9]{6}$/;
var regTest_numLimit7 = /^[0-9]{7}$/;
var regTest_numLimit8 = /^[0-9]{8}$/;
var regTest_numUnlimit = /^[0-9]{0,15}$/;
var regTest_allStr = /[가-힇A-Za-z0-9\[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"\\\'\\]/g;



/* @@@@@ 다음 우편번호 검색 API 함수 @@@@@::START */
function sample4_execDaumPostcode() {
	new daum.Postcode({
		oncomplete: function(data) {
			// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

			// 도로명 주소의 노출 규칙에 따라 주소를 조합한다.
			// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
			var fullRoadAddr = data.roadAddress; // 도로명 주소 변수
			var extraRoadAddr = ''; // 도로명 조합형 주소 변수

			// 법정동명이 있을 경우 추가한다. (법정리는 제외)
			// 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
			if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
				extraRoadAddr += data.bname;
			}
			// 건물명이 있고, 공동주택일 경우 추가한다.
			if(data.buildingName !== '' && data.apartment === 'Y'){
			   extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
			}
			// 도로명, 지번 조합형 주소가 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
			if(extraRoadAddr !== ''){
				extraRoadAddr = ' (' + extraRoadAddr + ')';
			}
			// 도로명, 지번 주소의 유무에 따라 해당 조합형 주소를 추가한다.
			if(fullRoadAddr !== ''){
				fullRoadAddr += extraRoadAddr;
			}

			// 우편번호와 주소 정보를 해당 필드에 넣는다.
			document.getElementById('sample4_postcode').value = data.zonecode; //5자리 새우편번호 사용
			document.getElementById('sample4_roadAddress').value = fullRoadAddr;
			document.getElementById('sample4_jibunAddress').value = data.jibunAddress;

			// 사용자가 '선택 안함'을 클릭한 경우, 예상 주소라는 표시를 해준다.
			if(data.autoRoadAddress) {
				//예상되는 도로명 주소에 조합형 주소를 추가한다.
				var expRoadAddr = data.autoRoadAddress + extraRoadAddr;
				document.getElementById('guide').innerHTML = '(예상 도로명 주소 : ' + expRoadAddr + ')';

			} else if(data.autoJibunAddress) {
				var expJibunAddr = data.autoJibunAddress;
				document.getElementById('guide').innerHTML = '(예상 지번 주소 : ' + expJibunAddr + ')';

			} else {
				document.getElementById('guide').innerHTML = '';
			}
		}
	}).open();
};
/* @@@@@ 다음 우편번호 검색 API 함수 @@@@@::CLEAR */



/* @@@@@ 중복검사하는 함수 선언 @@@@@::START */
// 매개변수 : 중복검사 대상 객체 , 검사필드명 , 검사값 Element ID
function checkDuplication(cls,field,inp){
	var thisBtn = event.target;
	var dup_txt = document.getElementById("duplication_txt_"+inp);
	var dup_inp = document.getElementById("duplication_chk_"+inp);

	var inpValue = encodeURIComponent(document.getElementById(inp).value);

	// 입력값이 없는 경우
	if(inpValue == ''){

		dup_txt.innerText = '값을 입력해주세요.';
		dup_txt.classList.add("active");
		dup_txt.classList.add("r");
		dup_txt.classList.remove("b");
		dup_txt.focus();
		dup_inp.value = '';

	}else{

		jQuery.ajax({
			url:"/admin/checkDuplication/index/" + cls + "/" + field + "/" + inpValue,
			method:"GET",
			cache:false,
			success:function(data){
				// console.log(data);
				var data_var = data.replace(/\s/gi,"");

				// 등록된 중복값이 없는 경우,
				if(data_var == 0){

					dup_txt.innerText = '사용하실 수 있습니다.';
					dup_txt.classList.add("active");
					dup_txt.classList.remove("r");
					dup_txt.classList.add("b");
					dup_txt.focus();
					dup_inp.value = 'Y';

				// 등록된 중복값이 있는 경우,
				}else{

					dup_txt.innerText = '중복된 값이 존재합니다.';
					dup_txt.classList.add("active");
					dup_txt.classList.add("r");
					dup_txt.classList.remove("b");
					dup_txt.focus();
					dup_inp.value = '';

				};

			},
			error:function(error){
				console.log(error);
			}
		});

	};
};

/* @@@@@ 중복검사하는 함수 선언 @@@@@::CLEAR */



/* @@@@@ 상태(활성/비활성) 변경하는 함수 선언 :: select 태그 @@@@@::START */

function changeStatus(type,event){
	var thisSel = event.target;
	var thisId = thisSel.getAttribute('data-id');

	jQuery.ajax({
		url:"/admin/changeStatus/index/" + type + "/" + thisId + "/" + thisSel.value,
		method:"GET",
		cache:false,
		success:function(data){
			// console.log(data);
			var data_var = data.replace(/\s/gi,"");

			if(data_var){
				alert("상태 변경완료");
			};

		},
		error:function(error){
			console.log(error);
		}
	});
};

/* @@@@@ 상태(활성/비활성) 변경하는 함수 선언 :: select 태그 @@@@@::CLEAR */



/* @@@@@ 각종 임의의 난수코드 얻는 함수 선언 @@@@@::START */

function checkRandomCode(type,id){
	jQuery.ajax({
		url:"/check/randomCode/" + type,
		method:"GET",
		cache:false,
		success:function(data){
			// console.log(data);
			var data_var = data.replace(/\s/gi,"");

			document.getElementById(id).value = data_var;
			makeQRcode('QRimg',data_var);
		},
		error:function(error){
			console.log(error);
		}
	});
};

/* @@@@@ 각종 임의의 난수코드 얻는 함수 선언 @@@@@::CLEAR */



/* @@@@@ 주어진 값에 따라 QR 이미지 생성하는 함수 선언 @@@@@::START */

function makeQRcode(id,value){
	// 뒤에 코드가 길어지니까 그냥 한번 변수에 주소를 저장
	var qrUrl = "https://chart.googleapis.com/chart?chs=134x134&cht=qr&chl=" + value;
	document.getElementById(id).setAttribute("src",qrUrl);
}

/* @@@@@ 주어진 값에 따라 QR 이미지 생성하는 함수 선언 @@@@@::CLEAR */



/* @@@@@ 커스텀팝업 열기&닫기 함수 선언 @@@@@::START */

function callCustomPop(type,name){
	if(type == "class"){
		var popName = "." + name;
	}else if(type == "id"){
		var popName = "#" + name;
	};

	document.querySelector(".customPopWrap" + popName).classList.add("active");
}
function closeCustomPop(event){
	var thisBtn = event.target;
	thisBtn.closest(".customPopWrap").classList.remove("active");

	uploadDate = undefined;
}

/* @@@@@ 커스텀팝업 열기&닫기 함수 선언 @@@@@::CLEAR */



/* @@@@@ 체크박스 전체 토글 함수 선언 @@@@@::START */

// 상위 체크박스 클릭 시 토글 함수
function toggleAllChk(event){
	var thisChk = event.target;
	var parentWrap = thisChk.closest(".chkWrap");
	var chkCount = parentWrap.querySelectorAll('input[type="checkbox"]').length;

	for(var i=0 ; i<chkCount ; i++){
		var chk = parentWrap.querySelectorAll('input[type="checkbox"]')[i];

		if(thisChk.checked == true){
			chk.checked = true;
		}else{
			chk.checked = false;
		}
	};
}
// 하위 체크박스 클릭 시 토글 함수
function toggleParentChk(event){
	var thisChk = event.target;
	var chkWrap = thisChk.closest(".chkWrap");
	var parentChk = chkWrap.querySelector(".chkAll");

	// 체크 여부 변수 선언
	var chkState = false;

	// 체크박스 중 하나라도 체크되어 있는지 확인
	var chkCount = chkWrap.querySelectorAll(".authChk").length;
	for(var i=0 ; i<chkCount ; i++){
		var chk = chkWrap.querySelectorAll(".authChk")[i];
		if(chk.checked == true) chkState = true;
	};

	// 체크 여부에 따라서 처리
	if(chkState == true){
		parentChk.checked = true;

	}else{
		parentChk.checked = false;

	};
}

/* @@@@@ 체크박스 전체 토글 함수 선언 @@@@@::CLEAR */



/* @@@@@ 라디오 버튼 토글 함수 선언 @@@@@::START */

function toggleRadio(event){
	var thisBtn = event.target;
  var wrapper = thisBtn.closest(".radio-wrap");


  // 카테고리 컨텐츠 비활성 처리
  var conWrap = wrapper.querySelector(":scope > .radio-contents");
  var conCount = conWrap.querySelectorAll(":scope > .radio-content").length;
  for(var i=0 ; i<conCount ; i++){
    var con = conWrap.querySelectorAll(":scope > .radio-content")[i];

    // data-category 가 같은 경우,
    if(thisBtn.getAttribute('data-radio') == con.getAttribute('data-radio')){
      con.classList.add('active');
    }else{
      con.classList.remove('active');
    }

  }
};

/* @@@@@ 라디오 버튼 토글 함수 선언 @@@@@::CLEAR */



/* 복합 검색 영역 관련 :: S */

// 복합 검색하기 함수 선언
function multiSearch(){
	// 복합 검색 영역
	var searchWrap = document.getElementById("multiSearchWrap");


	// URL 업데이트 관련 변수 선언
	var keyArr = [];
	var valueArr = [];
	var rem = [];


	// 복합 검색 엘리먼트 루프
	var sEleCount = searchWrap.querySelectorAll(".s-ele.active").length;
	for(var i=0 ; i<sEleCount ; i++){
		var sEle = searchWrap.querySelectorAll(".s-ele.active")[i];
		if(sEle.value != ""){
			keyArr.push(sEle.getAttribute("data-name"));
			valueArr.push(encodeURIComponent(sEle.value));
		}
	}


	// 검색 URL 구성 :: 검색하면서 페이지는 초기화된다.
	var targetUrl = location.pathname + "?" + getTargetURL(keyArr,valueArr,rem,"change");

	// console.log(targetUrl);
	location.href = targetUrl;
}

// 검색타입 변경시 함수 선언
function setSearchType(event){
	var thisSel = event.target;

	if(thisSel.value != ''){

		// 검색타입 구하기
		var optType;
		var optCount = thisSel.querySelectorAll("option").length;
		for(var i=0 ; i<optCount ; i++){
			var opt = thisSel.querySelectorAll("option")[i];
			if(thisSel.value == opt.value) optType = opt.getAttribute("data-type");
		};

		// 타입에 맞는 input 노출
		var typeCount = document.querySelectorAll(".s-type.s-ele").length;
		for(var i=0 ; i<typeCount ; i++){
			var type = document.querySelectorAll(".s-type.s-ele")[i];
			type.classList.remove("active");
			if(optType == type.getAttribute("data-type")) type.classList.add("active");
		};

	};

}

/* 복합 검색 영역 관련 :: E */



/* 리스트 칼럼별 정렬 함수 관련 :: S */

function toggleSort(event,sort){
	var thisBtn = event.target;
	if(thisBtn.tagName != "A") thisBtn = thisBtn.closest("a");

	// 정렬값이 있는 경우만 실행
	if(thisBtn.getAttribute("data-sorttype") != ''){

		// URL 업데이트 관련 변수 선언
		var keyArr = ['s1','s2'];
		var valueArr = [thisBtn.getAttribute("data-sorttype"),sort];
		var rem = [];

		// 검색 URL 구성
		var targetUrl = location.pathname + "?" + getTargetURL(keyArr,valueArr,rem,"update");

		// console.log(targetUrl);
		location.href = targetUrl;

	};
}

/* 리스트 칼럼별 정렬 함수 관련 :: E */



/* 관련 파일정보 삭제처리 함수 관련 :: S */
function delUploadFile(event,name,type){
	var delConfirm = confirm("관련 파일을 삭제하시겠습니까?");
	if(delConfirm == true){

		jQuery.ajax({
			url:"/admin/file/deleteFile/" + encodeURIComponent(name),
			method:"GET",
			cache:false,
			success:function(data){
				console.log(data);
				var data_var = data.replace(/\s/gi,"");

				if(data_var == "Y"){
					// alert("삭제되었습니다.");

					var thisBtn = event.target;
					var wrap = thisBtn.closest(".uploadWrap");
					var rect = thisBtn.closest(".fileRect");
					rect.parentNode.removeChild(rect);

					// 썸네일, 첨부파일 인 경우
					if(
						type == 'thumbnail'
						||
						type == 'attach'
						||
						type == 'image'
					){
						wrap.querySelector(".uploadInp").classList.remove("disN");
					};

				}else{
					alert("삭제 도중 에러가 발생했습니다. 재시도바랍니다.");
				};

			},
			error:function(error){
				console.log(error);
			}
		});

	};
};
/* 관련 파일정보 삭제처리 함수 관련 :: E */



/* 각종 컨텐츠 삭제 함수 관련 :: S */
function delContent(type,page,id){
	var delConfirm = confirm(type + "을(를) 삭제하시겠습니까?");

	if(delConfirm == true){
		// console.log(page + '/delete/' + id);
		location.href = page + '/delete/' + id;
	};
};
/* 각종 컨텐츠 삭제 함수 관련 :: E */



/* 제품 즐겨찾기 함수 관련 :: S */
function toggleFavorite(event,id){
	var thisBtn = event.target;
	if(thisBtn.tagName != "A") thisBtn = thisBtn.closest("a");

	jQuery.ajax({
		url:"/front/product/toggle_favorite/" + id + "/",
		method:"GET",
		cache:false,
		success:function(data){
			// console.log(data);
			var data_var = data.replace(/\s/gi,"");
			var json_data = JSON.parse(data);
			// console.log(json_data);

			if(json_data.result == 'insert'){
				thisBtn.children[0].setAttribute("src","/public/images/cm_icon_thumbnail_favorite_on.png");

			}else if(json_data.result == 'delete'){
				thisBtn.children[0].setAttribute("src","/public/images/cm_icon_thumbnail_favorite_off.png");

			};

		},
		error:function(error){
			console.log(error);
		}
	});

};
/* 제품 즐겨찾기 함수 관련 :: E */



// 패밀리사이트 이동함수 선
function goToFamilySite(event){
  var thisSel = event.target;
  if(thisSel.value != ""){
    window.open(thisSel.value);
    thisSel.value = "";
  };
};



/* 헤더 영역 :: S */

jQuery(window).scroll(function(e){
	scrTop = jQuery(window).scrollTop();

	if(scrTop > 151){
		if(!jQuery(".headerWrap").hasClass("fixed")){
			jQuery(".headerWrap").addClass("fixed");
		};

	}else{
		if(jQuery(".headerWrap").hasClass("fixed")){
			jQuery(".headerWrap").removeClass("fixed");
		};

	};
});

// 다국어 관련 함수 선언
function changeLanguage(lang,url){
	location.href = "/index/chnLang/" + lang + "?url=" + url;
};

/* 헤더 영역 :: E */
