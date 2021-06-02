function pre(){
    $.get("/RequireFavorite",function (data){
        $("#favorite-div").empty()
		if(data==''){
			emptyDiv = "<div style='text-align: center;margin-top: 1.5cm;margin-bottom: 1.5cm;'><p class='lead' >You have not searched yet... Have a try!</p></div>"
			  $("#upload-div").append(emptyDiv)
		}


        $.each(data,function (i,val){
            img =  "<img id='img" + i + "' src='"+val['img_name']+"' style='height: 340px;width: 100%'>\n"
            myhtml ="<div class=\"col-sm-6 col-md-4\">\n" +
                "    <div class=\"thumbnail\">\n" +
                img +
                "      <div class=\"caption\" style=\"text-align: center\">\n" +
                "        <h3>Favorite "+(i+1) +" </h3>\n" +
                "        <p class = \"lead\" id = ><i class=\"fa fa-tag\"></i> <span id='tag"+i+"'> "+val['tags']+"</span></p>\n" +
				"        <div style='text-align: center'>" +
                "         <p class='myp'><button type=\"button\" class=\"btn btn-danger\" id='"+i+"' onclick=\"remove(this.id)\"><i class=\"fa fa-trash\"></i> Remove</button></p>\n" +
				"         <p class='myp'><button type=\"button\" class=\"btn btn-primary\" id='"+i+'#'+"' onclick=\"download1(this.id)\"><i class=\"fa fa-download\"></i> Download</button></p>\n" +
				"        </div>" +
                "      </div>\n" +
                "    </div>\n" +
                "  </div>"
            $("#favorite-div").append(myhtml)


        })
    })
}

function remove(btn_id){
    img_id = "#img"+btn_id
	var img_src = $(img_id).attr("src")
    console.log(img_src)
    $.ajax({
		url:"/Remove",
		type: 'POST',
		data: {'img_src':img_src},
		dataType:'json',

		success: function (response) {
			if(response==2){
				$("#success").show()
                pre()
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


pre()