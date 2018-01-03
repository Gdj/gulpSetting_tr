/*
 * Base			: jQuery JavaScript Library v1.11.1 
 * trPackage	: 
 * trpForm  	: v0.7
 * release date : 2016.12.19
 * author		: http://turfrain.tistory.com/
 * Copyright 2016. turfrain all rights reserved.
 *
 */

$(document).ready(function(){ 
	/*
		placeholder 
		ie7 에서도 사용가능한 placeholder 입니다.
		아래코드는 "placeholder" 인식 안하는 경우에만 작동합니다.
	*/
	/*  placeholder 유효한지 체크	*/ 
	   if ((isInputSupported = 'placeholder' in document.createElement('input')) !== true) {
		   
		$('input[placeholder]').each(function () {			
			if ($(this).val() == ''){ 							// 값이없을때는 "placeholder"로대체 	
				var l_h = $(this).css('line-height');
 				var _add_style = "style='position:absolute; display:inline-block; width:"+$(this).width()+"px; height:"+$(this).height()+"px;  font-size:"+$(this).css('font-size')+"; color:"+$(this).css('color')+"; line-height:"+$(this).css('line-height')+"; z-index:1; '"  ;
				var _inputWarp = "style='position:relative; display:inline-block; width:"+$(this).width()+"px; height:"+$(this).height()+"px;  top:"+$(this).css("top")+"px; left:"+$(this).css("left")+"px; margin-top:"+$(this).css('margin-top')+"; margin-right:"+$(this).css('margin-right')+"; margin-bottom:"+$(this).css('margin-bottom')+"; margin-left:"+$(this).css('margin-left')+"; padding-top:"+$(this).css('padding-top')+"; padding-right:"+$(this).css('padding-right')+"; padding-bottom:"+$(this).css('padding-bottom')+"; padding-left:"+$(this).css('padding-left')+"; vertical-align:" +$(this).css('vertical-align') +";'"  ;
				var _input = { top:0, left:0, margin:0 };
				$(this).css(_input);

				var _add_html = "<span class='trp_placeholder' "+ _add_style +" >"+ $(this).attr('placeholder') +"</span>";
				
				$(this).css({ "position":"absolute", "z-index":2 , "background-color":"transparent" });
				
				$(this).wrap("<span class='trp_inputWarp' "+ _inputWarp +" ></span>");
				$(this).before(_add_html);
				
			}
		});
	
		$('input[placeholder]').focus(function () {				
			if (  $(this).val() == ""  )	$(this).parent().find(".trp_placeholder").hide();	
		});

		$('input[placeholder]').blur(function () {
			if (  $(this).val() == ""  )	$(this).parent().find(".trp_placeholder").show();
		});	
		
			
	} ;
	/* //placeholder */
	

	/* textarea placeholder 유효한지 체크	*/ 
	   if ((isTextareaSupported = 'placeholder' in document.createElement('textarea')) !== true) {
		
		$('textarea[placeholder]').each(function () {
			
			if ($(this).val() == ''){ 							// 값이없을때는 "placeholder"로대체 	
				
				var l_h = $(this).css('line-height');
 				var _add_style = "style='position:absolute; width:"+$(this).width() +"; height:"+$(this).height() +";display:block; top:"+$(this).css("top") +"; left:"+$(this).css("left") +"; margin:5px; font-size:12px; line-height: "+$(this).css('line-height')+"; color:#a9a9a9'; z-index:1;"  ;

				var _add_html = "<span class='trp_placeholder' "+ _add_style +" >"+ $(this).attr('placeholder') +"</span>";

				$(this).css({ "position":"absolute", "z-index":2 , "background-color":"transparent" });
				$(this).wrap("<div class='trp_inputWarp' style='position:relative ;height:25px; '></div>");
				$(this).before(_add_html);
			}
		});
	
		$('textarea[placeholder]').focus(function () {				
			if (  $(this).val() == ""  )	$(this).parent().find(".trp_placeholder").hide();	
		});

		$('textarea[placeholder]').blur(function () {
			if (  $(this).val() == ""  )	$(this).parent().find(".trp_placeholder").show();
		});	
	
	} ;
	/* //placeholder */
	
	
	/* trpCheckbox 이미지 체크 박스 .trp.checkbox-box input:checkbox */
	$(".trp.checkbox-box input:checkbox").change(function() {
		if($(this).is( ":checked" )){
			$(this).closest(".trp.checkbox-box").addClass("on");
		}else{
			$(this).closest(".trp.checkbox-box").removeClass("on");
		}
	});
	
	/* trpRadio 이미지 라디오버튼 .trp.radio-box input:radio */
	$(".trp.radio-box input").change(function() {
		var _names = $(this).attr("name");
		if($(".trp.radio-box input[name="+_names+"]").is( ":checked" )){
			$(".trp.radio-box input[name="+_names+"]").parent().removeClass("on");
			$(this).closest(".trp.radio-box").addClass("on");
		}
	});
	
});

/* input type="file" 이미지로 변경 */
(function($) {    
    $.fn.trpFilestyle = function(options) {
        var self = this;       
        /* TODO: override CSS. */
        var settings = {            
            textClass: 'trp_fileName',
			textWidth: "auto",
			textHeight: "auto",
			buttonClass: "trp_fileButton",
			buttonText: '파일선택',
			buttonImage: "",			
			buttonWidth: "auto",
			buttonHeight: "auto"
        };

        // 옵녓값 합침        
        if(options) {
            $.extend(settings, options);
        };
                        
        return this.each(function() {
		   		var self = this;
				var browser = navigator.userAgent;		// 브라우저

				// 생성되는 input type="text"
				var _text_html = $("<input type='text' title='file name' readonly='readonly' />").addClass(settings.textClass);	
				_text_html.css({
					   "width": settings.textWidth ,
					   "height": settings.textHeight ,
					   "margin":"2px",
					   "display":"inline"
				})
				
				// 생성되는 div 버튼 wrap
				var _button_html = $("<div>").addClass(settings.buttonClass);
				_button_html.css({
				  "position": "absolute",
				  "display": "inline",		
				  "width" :			settings.buttonWidth ,
				  "height" :		settings.buttonHeight ,
				  "background" :	(settings.buttonImage != "")? "url("+settings.buttonImage+") 0 0 no-repeat" : "none" ,
				  "overflow": "hidden"				  
				});
				// 이미지가 없을때 글자로 변경	 "buttonText"속성 사용
				if(settings.buttonImage == ""){ 
					_button_html.prepend(settings.buttonText)
				}
			
				// 속성 적용
				$(self).before(_text_html);
				$(self).wrap(_button_html);
				$(self).css({
					"position": "absolute",
					"top": "0",
					"left": "0",
					opacity: 0, 
					height:	 settings.buttonHeight,
					"margin-left": (/chrome/i.test(browser))? "-75px" : "-160px",		// 크롬일때 / 크롬이 아닐때
					"overflow":"hidden", 
					"cursor": "pointer" 
				});
				// 파일 경로 값넣기
				$(self).on("change", function(){ 
					var _val = $(self).val();
					$(self).parent().siblings(".trp_fileName").attr("value" , _val);
				});

			    // 접근성 아웃라인 넣기				
				$(self).on("focus",function(){
					if (/chrome/i.test(browser))
					{	// 크롬
							$(self).parent(".trp_fileButton").css( {"outline" : " 2px auto #4d90fe"  });
					}else{	$(self).parent(".trp_fileButton").css( {"outline" : "1px dotted #000" });
					}
				});
				$(self).on("blur",function(){
					$(self).parent(".trp_fileButton").css( {"outline" : "none" });
				});
		
      
        });	// return
        
		 
    };
    
})(jQuery);