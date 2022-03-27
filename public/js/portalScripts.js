
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
                "portalFile":$('#portalFileData').val(),
                "filename":$('#fileName').val(),
                "name":$('input[name="name"]').val(),
                "description":$('input[name="description"]').val(),
                "user_id":userId
                }),
                success:  function (data, status) {
                console.log(data);
                savePortalToPublicDb()
                },
                error: function(errMsg) {
                console.log(errMsg);
                },
            });
        }
        else
        {
            alert("Empty Fields")
        }

}
function savePortalToPublicDb(){
    if ($('#fileData').val() && $('#name').val() && $('#description').val() )
        {
            $.ajax({    
                type: "POST",
                url: "https://individualprojectm00725540.herokuapp.com/api/saveportal/",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                "file":$('#fileData').val(),
                "portalFile":$('#portalFileData').val(),
                "filename":$('#fileName').val(),
                "name":$('input[name="name"]').val(),
                "description":$('input[name="description"]').val(),
                "user_id":userId
                }),
                success:  function (data, status) {
                console.log(data);
                
                },
                error: function(errMsg) {
                console.log(errMsg);
                },
            });
        }
        else
        {
            alert("Empty Fields")
        }

}

function removePortalFromDb(portalId){
        
    $.ajax({    
        type: "POST",
        url: "https://individualprojectm00725540.herokuapp.com/api/deleteportal/",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "portal_id":portalId,
        }),
        success:  function (data, status) {
            location.reload();
        },
        error: function(errMsg) {
        console.log(errMsg);
        },
    });

}
function removePortalFile(portalId){
        
        $.ajax({    
            type: "POST",
            url: "http://localhost:8080/api/removeportalfile/",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "portal_id":portalId,
                "user_id":userId
            }),
            success:  function (data, status) {
            console.log(data);
            removePortalFile(portalId)
            },
            error: function(errMsg) {
            console.log(errMsg);
            },
        });
}


function showPortals(){
    $.ajax({
        type: "GET",
        url: "https://individualprojectm00725540.herokuapp.com/api/getallportals/"+userId,
        headers: {'x-access-token': accessToken},
        success: function (result, status, xhr) {
            console.log(result)

            $.each(result, function (i, portalObj) {
                $('#portalsList').append
                (
                    '<div class="col-lg-3 card portal">'+
                        '<div class="card-body">'+
                            '<h5 class="card-title">'+portalObj.id+': <a href="../public/upload/'+portalObj.user_id+'/'+portalObj.id+'/portal.html"> ' +portalObj.portal_name+'</a></h5>'+
                            '<h6 class="card-subtitle mb-2 text-muted">Created by user with ID: '+portalObj.user_id+'</h6>'+
                            '<p class="card-text">'+portalObj.description+'</p>'+
                            '<input id="portalScript" type="hidden" value="'+blob2file(portalObj.portal_file)+'">'+
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
function getUsersPortals(){

    $.ajax({
        type: "GET",
        url: "https://individualprojectm00725540.herokuapp.com/api/getuserportal/"+userId,
        headers: {'x-access-token': accessToken},
        success: function (result, status, xhr) {

            $.each(result, function (i, portal) {
                console.log(portal.id)
                console.log(portal.portal_name)
                console.log(portal.description)
                console.log(portal.user_id)
                $("#myPortalsTable").append(
                    '<tr>'+
                      '<td>'+portal.id+' </td>'+
                      '<td>'+portal.portal_name+'</td>'+
                      '<td>'+portal.description+'</td>'+
                      '<td><a href="../public/upload/'+portal.user_id+'/'+portal.id+'/portal.html"><button class="btn btn-info">Join Portal</button></a></td>'+
                      '<td><button onclick="removePortal('+portal.id+')" class="btn btn-danger">Remove Portal</button></td>'+
                    '</tr>'
                  )
            })

        },
        error: function (xhr, status, error) {
            console.log(error);
        }
     });
    }
