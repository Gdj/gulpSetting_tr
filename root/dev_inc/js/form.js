(function(){
    $(document).ready(function () {  
        console.log("form.js");
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
        
        
        // https://select2.github.io/examples.html#themes-templating-responsive-design
        $(".select2Basic").select2({            
            minimumResultsForSearch: Infinity,
            /*theme: "basic"*/
        });
        
                

    });
    
})()