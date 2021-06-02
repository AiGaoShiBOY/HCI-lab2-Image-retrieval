$.fn.fileinputBsVersion = '3.3.7';


//初始化fileinput控件（第一次初始化）
function initFileInput(ctrlName) {
    var control = $('#' + ctrlName);
    control.fileinput({
        allowedFileExtensions : ['jpg', 'png','jpeg'],//接收的文件后缀
        showUpload: false, //是否显示上传按钮
        browseClass: "btn btn-primary", //按钮样式
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
    });
}

initFileInput("input-1")

function fun(){

		var input = document.getElementById("input-1")
		if(!input.value){
			return
		}
		$('#load').show();

   		$("form").submit(function(evt){
		//$('#loader-icon').show();

		evt.preventDefault();

                //$('#loader-icon').show();
     		var formData = new FormData($(this)[0])

   		$.ajax({
      		 url: 'imgUpload',
       		 type: 'POST',
      		 data: formData,
      		 //async: false,
      		 cache: false,
      		 contentType: false,
      		 enctype: 'multipart/form-data',
      		 processData: false,


      		 success: function (response) {
				 $('#load').hide();
				 //$('#row1').show();
				  //$('#clear').show();
						  //console.log(response[1]);
					  //document.getElementById("predictedResult").innerHTML= response;
						  document.getElementById("img0").src = response.image0;
				 document.getElementById("img1").src = response.image1;
						 document.getElementById("img2").src = response.image2;
						 document.getElementById("img3").src = response.image3;
						  document.getElementById("img4").src = response.image4;
						  document.getElementById("img5").src = response.image5;
						   document.getElementById("img6").src = response.image6;
						    document.getElementById("img7").src = response.image7;
						    document.getElementById("img8").src = response.image8;
						    document.getElementById("tag0").innerHTML = response.tag0;
						    document.getElementById("tag1").innerHTML = response.tag1;
						    document.getElementById("tag2").innerHTML = response.tag2;
						    document.getElementById("tag3").innerHTML = response.tag3;
						    document.getElementById("tag4").innerHTML = response.tag4;
						    document.getElementById("tag5").innerHTML = response.tag5;
						    document.getElementById("tag6").innerHTML = response.tag6;
						    document.getElementById("tag7").innerHTML = response.tag7
						    document.getElementById("tag8").innerHTML = response.tag8;

						  $('#result-div').show();
						  requireHistory()
				          show_all()
      		 }
   		});
   return false;
 })};

function addFavorite(btn_id){
	img_id = "#img"+btn_id
	var img_src = $(img_id).attr("src")
	$.ajax({
		url:"/Add",
		type: 'POST',
		data: {'img_src':img_src},
		dataType:'json',

		success: function (response) {
			if(response==2){
				$("#success").show()
				setTimeout(function (){
					$("#success").hide()
				},1500)
			}
			if(response==1){
				$("#fail").show()
				setTimeout(function (){
					$("#fail").hide()
				},1500)
			}

		}
	})

}

function requireHistory(){
    $.get("/RequireHistory",function (data){
        $("#upload-div").empty()
		if(data==''){
			emptyDiv = "<div style='text-align: center;margin-top: 1.5cm;margin-bottom: 1.5cm;'><p class='lead' >You have not searched yet... Have a try!</p></div>"
			  $("#upload-div").append(emptyDiv)
		}


        $.each(data,function (i,val){
            img =  "<img id='down"+i+"' src='"+val+"' style='height: 340px;width: 100%'>\n"
            myhtml ="<div class=\"col-sm-6 col-md-4\">\n" +
                "    <div class=\"thumbnail\">\n" +
                img +
                "      <div class=\"caption\" style=\"text-align: center\">\n" +
                "        <p><button type=\"button\" class=\"btn btn-primary\"  id='"+i+"d' onclick=\"download(this.id)\" style = 'margin-top:0.4cm' ><i class=\"fa fa-download\"></i> Download </button></p>\n" +
                "      </div>\n" +
                "    </div>\n" +
                "  </div>"
            $("#upload-div").append(myhtml)
			$('#clear_contain').show()


        })
    })
}

function download(id){
	num = id[0];
	img_num = 'down'+num;
	var img = document.getElementById(img_num);
	var url = img.src;
	var a = document.createElement('a');
	var event = new MouseEvent('click')
	a.download = '';
	a.href = url;
	a.dispatchEvent(event);
}

function download1(id){
	num = id[0];
	img_num = 'img'+num;
	var img = document.getElementById(img_num);
	var url = img.src;
	var a = document.createElement('a');
	var event = new MouseEvent('click')
	a.download = '';
	a.href = url;
	a.dispatchEvent(event);
}

function clear_his(){
	$.post("/Clear",function (data){
		if(data==2){
			$("#success-clear").show()
			setTimeout(function (){
				$("#success-clear").hide()
			},1500)
			requireHistory()
		}
		else{
			alert("I can't do that...There is something wrong!")
		}
	})
}

function my_filter(tag){
	show_all()
	for(i=0;i<9;i++){
		j = 'tag'+i;
		var target = document.getElementById(j).innerText;
		if(target.indexOf(tag)==-1){
			aim_div = "#div"+i;
			$(aim_div).hide()
		}
	}
}

function show_all(){
	for(i=0;i<9;i++){
		aim_div = "#div"+i;
		$(aim_div).show()
	}
}

requireHistory()

