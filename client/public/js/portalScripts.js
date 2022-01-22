function savePortal(){
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/saveportal/",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          "file":$('#fileData').val(),
          "name":$('input[name="name"]').val(),
          "description":$('input[name="description"]').val(),
          "user_id":$('input[name="user_id"]').val()
        }),
        success:  function (data, status) {
          console.log(data);
        },
        error: function(errMsg) {
          alert("Portal exists");
          console.log(errMsg);
        },
      });
}

function showPortals(){
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/getallportals",
        headers: {'x-access-token': document.cookie},
        success: function (result, status, xhr) {
            $.each(result, function (i, portalObj) {
                // console.log(portalObj.portal_script)
                $('#portalsList').append
                (
                    '<div class="col-lg-3 card portal">'+
                        '<div class="card-body">'+
                            '<h5 class="card-title">'+portalObj.id+': <a href="#"> ' +portalObj.portal_name+'</a></h5>'+
                            '<h6 class="card-subtitle mb-2 text-muted">Created by user with ID: '+portalObj.user_id+'</h6>'+
                            '<p class="card-text">'+portalObj.description+'</p>'+
                            '<input id="portalScript" type="hidden" value="'+blob2file(portalObj.portal_script)+'">'+
                        '</div>'+
                    '</div>'
                )
            });
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
     });
}
function blob2file(blobData) {
    //url dam ako idcko potom z url zavolam konkretny portal a nahram ho do canvasu
    //treba doriesit resources a filename k tomu
    //potom websockety groupy
    var file = new File([blobData], "portal.js",{ type: "text/javascript", }); 
    return file;
}
function getUsersPortals(userId){
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/getuserportal/"+userId,
        headers: {'x-access-token': document.cookie},
        success: function (result, status, xhr) {
            console.log(result)
            // $.each(result, function (i, portalObj) {
            //     // console.log(portalObj.portal_script)
            //     $('#portalsList').append
            //     (
            //         '<div class="col-lg-3 card portal">'+
            //             '<div class="card-body">'+
            //                 '<h5 class="card-title">'+portalObj.id+': <a href="#"> ' +portalObj.portal_name+'</a></h5>'+
            //                 '<h6 class="card-subtitle mb-2 text-muted">Created by user with ID: '+portalObj.user_id+'</h6>'+
            //                 '<p class="card-text">'+portalObj.description+'</p>'+
            //                 '<input id="portalScript" type="hidden" value="'+blob2file(portalObj.portal_script)+'">'+
            //             '</div>'+
            //         '</div>'
            //     )
            // });
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
     });
    }