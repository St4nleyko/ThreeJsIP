
function savePortalToDb(){
    if ($('#fileData').val() && $('#name').val() && $('#description').val() )
    {
    $.ajax({    
        type: "POST",
        url: "http://localhost:8080/api/saveportal/",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          "file":$('#fileData').val(),
          "filename":$('#fileName').val(),
          "name":$('input[name="name"]').val(),
          "description":$('input[name="description"]').val(),
          "user_id":$('input[name="user_id"]').val()
        }),
        success:  function (data, status) {
          console.log(data);
        },
        error: function(errMsg) {
          console.log(errMsg);
        },
      });
    }
    else{
        alert("Fill all")
    }
}


function showPortals(){
    let accessToken = document.cookie.substring(0, document.cookie.indexOf(';'));
    accessToken=accessToken.slice(3);
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/getallportals",
        headers: {'x-access-token': accessToken},
        success: function (result, status, xhr) {
            $.each(result, function (i, portalObj) {
                // console.log(portalObj.portal_script)
                $('#portalsList').append
                (
                    '<div class="col-lg-3 card portal">'+
                        '<div class="card-body">'+
                            '<h5 class="card-title">'+portalObj.id+': <a href="./portal.html?owner='+portalObj.user_id+'&id='+portalObj.id+'"> ' +portalObj.portal_name+'</a></h5>'+
                            // '<h5 class="card-title">'+portalObj.id+': <a href="../public/upload/'+portalObj.user_id+'/'+portalObj.id+'"> ' +portalObj.portal_name+'</a></h5>'+
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
    var file = new File([blobData], "portal.js",{ type: "text/javascript", }); 
    return file;
}
function getUsersPortals(userId){
    let accessToken = document.cookie.substring(0, document.cookie.indexOf(';'));
    accessToken=accessToken.slice(3);
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/getuserportal/"+userId,
        headers: {'x-access-token': accessToken},
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