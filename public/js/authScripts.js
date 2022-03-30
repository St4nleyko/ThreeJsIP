
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
    const userId = getCookie("uid");
    const accessToken = getCookie("at");
    
    function register(){
      var confirmedPass;
      if($('input[name="password"]').val() == $('input[name="confirmPassword"]').val()){
        confirmedPass = $('input[name="password"]').val();
        $.ajax({
          type: "POST",
          url: "https://individualprojectm00725540.herokuapp.com/api/auth/signup",
          contentType: "application/json",
          dataType: "json",
          data: JSON.stringify({
                "username":$('input[name="username"]').val(),
                "email":$('input[name="email"]').val(),
                "filename":$("#regfileName").val(),
                "fileData":$("#regfileData").val(),
                "password":confirmedPass,
                "roles":[$('input[name="role"]:checked').val()]
              }),
          success:  function (data, status) {
            location.href="./login.html"
          },
          error: function(errMsg) {
           alert("User with this email/username already exists");
           console.log(errMsg);
          },
        });
      }
      if($('input[name="password"]').val() != $('input[name="confirmPassword"]').val()){
        alert("password dont match");
      }
    }

    function loginAndGenerate(){

      $.ajax({
        type: "POST",
        url: "https://individualprojectm00725540.herokuapp.com/api/auth/signin",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          "username":$('input[name="username"]').val(),
          "password":$('input[name="password"]').val(),
        }),
        success:  function (data, status) {
          let path = "; path=/"
          document.cookie="at="+data.accessToken+path;
          document.cookie="uid="+data.id+path;
          document.cookie="username="+data.username+path;
          document.cookie="portal=0"+path;
          window.location.href="./myprofile.html"
        },
        error: function(errMsg) {
        alert(errMsg.responseText);
        console.log(errMsg);
        },
      });
    }


//get user data and fill them
function getUserDataMyProfile(){
    $.ajax({
        type: "GET",
        url: "https://individualprojectm00725540.herokuapp.com/api/getuser",
        headers: {'x-access-token': accessToken},
        success: function (result, status, xhr) {
            $('#email').val(result.email)
            console.log(result)
            $('#username').val(result.username)
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
  }

  function checkUserData(){
    $.ajax({
        type: "GET",
        url: "https://individualprojectm00725540.herokuapp.com/api/getuser",
        headers: {'x-access-token':accessToken},
        success: function (result, status, xhr) {
            console.log(result);
            $("#loginLink").hide()
            $("#registerLink").hide()
            $("#profileLink").show()
            $("#logout").show()
        },
        error: function (xhr, status, error) {
          if(error){
            console.log(error);
            $("#logout").hide()
            $("#portals").hide()
            // return status; 
          }
        }
    });
  }
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const userProfileId = urlParams.get('id')

  function getUserProfile(){
    if(userProfileId == userId){
      window.location.href="./myprofile.html"
    }
    $.ajax({
      type: "GET",
      url: "https://individualprojectm00725540.herokuapp.com/api/getuserprofile/"+userProfileId,
      headers: {'x-access-token':accessToken},
      success: function (result, status, xhr) {
        console.log(result)
        let usersFriendlist = result.userFriends
        let friendList = result.friends
        let portalList = result.portals
        $('.profileUserName').html(result.username)
          $.each(usersFriendlist, function (i, friend) {
            if(friend.UsersFriends.user_id == userId && friend.UsersFriends.accepted == 1){
              $('#profileButtonDiv').append(
                '<p>Already Friends </p><button id="removeFriendBtn" onclick="removeFriend('+userProfileId+')" class="btn btn-danger">Remove Friend</button>'
              )
              $(".profile-table-portals").show()
              $.each(portalList, function (i, portal) {
                $("#profilePortals").append(
                  '<tr>'+
                    '<td>'+portal.id+' </td>'+
                    '<td>'+portal.portal_name+'</td>'+
                    '<td>'+portal.description+'</td>'+
                    '<td><a href="../public/upload/'+portal.user_id+'/'+portal.id+'/portal.html"><button class="btn btn-info">Join Portal</button></a></td>'+
                  '</tr>'
                )
              })
            }
            else if(friend.UsersFriends.user_id == userId && friend.UsersFriends.accepted == 0){
              $('#profileButtonDiv').append(
                '<button id="cancelFriendBtn" onclick="cancelFriendRequest('+userProfileId+')" class="btn btn-warning">Cancel Friend Request</button>'
              )
            }
            else if((friend.UsersFriends.friend_id == userId && friend.UsersFriends.accepted == 0)){
              $('#profileButtonDiv').append(
                '<button id="acceptFriendBtn" onclick="acceptFriendRequest('+userProfileId+')" class="btn btn-info">Accept Friend Request</button>'+
                '<button id="declineFriendBtn" onclick="declineFriendRequest('+userProfileId+')" class="btn btn-danger">Decline Friend Request</button>'
              )
            }
          })

          $.each(friendList, function (i, friend) {            
            if(friend.UsersFriends.user_id == userProfileId && friend.UsersFriends.accepted == 0){
              $('#profileButtonDiv').append(
                '<button id="acceptFriendBtn"  onclick="acceptFriendRequest('+userProfileId+')" class="btn btn-info">Accept Friend Request</button>'+
                '<button id="declineFriendBtn" onclick="declineFriendRequest('+userProfileId+')" class="btn btn-danger">Decline Friend Request</button>'

              )
            }
            else if(friend.UsersFriends.friend_id == userId && friend.UsersFriends.accepted == 0){
              $('#profileButtonDiv').append(
                '<button id="acceptFriendBtn"  onclick="acceptFriendRequest('+userProfileId+')" class="btn btn-info">Accept Friend Request</button>'+
                '<button id="declineFriendBtn" onclick="declineFriendRequest('+userProfileId+')" class="btn btn-danger">Decline Friend Request</button>'

              )
            }
          })
          if(!$("#profileButtonDiv").html()){
            $('#profileButtonDiv').append(
              '<button id="addFriendBtn" onclick="sendFriendRequest('+userProfileId+')" class="btn btn-success">Add Friend</button>'
            )
          }
          if(result.profile_picture!=''){
            $('#profilePic').attr('src','../public/upload//profilepics/'+result.id+'/'+result.profile_picture);
          }
          else{
            $('#profilePic').attr('src','https://www.valiance.gg/images/49e4325.png');
          }

      },
      error: function (xhr, status, error) {
        return status; 
      }
    });

  }
  function updateUserData(){
    var confirmedPass;
    if($('input[name="password"]').val()!= '' && ($('input[name="password"]').val() == $('input[name="confirmPassword"]').val())){
      confirmedPass = $('input[name="password"]').val();
      $.ajax({
        type: "PUT",
        headers: {'x-access-token':accessToken},
        url: "http://localhost:8080/api/updateuserdata/"+userId,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
              "filename":$("#userProfileFileName").val(),
              "fileData":$("#userProfileFileData").val(),
              "password":confirmedPass,
            }),
        success:  function (data, status) {
          updateUserPublicData()
          location.reload();

          console.log(data);
        },
        error: function(errMsg) {
         console.log(errMsg);
        },
      });
    }
    if($('input[name="password"]').val()== ''  || ($('input[name="password"]').val() != $('input[name="confirmPassword"]').val())){
      alert("password dont match / empty");
    }
  }
  function updateUserPublicData(){
    var confirmedPass;
    if($('input[name="password"]').val()!= '' && ($('input[name="password"]').val() == $('input[name="confirmPassword"]').val())){
      confirmedPass = $('input[name="password"]').val();
      $.ajax({
        type: "PUT",
        headers: {'x-access-token':accessToken},
        url: "https://individualprojectm00725540.herokuapp.com/api/updateuserdata/"+userId,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
              "filename":$("#userProfileFileName").val(),
              "fileData":$("#userProfileFileData").val(),
              "password":confirmedPass,
            }),
        success:  function (data, status) {
          location.reload();

          console.log(data);
          // location.href="http://127.0.0.1:5500/client/views/login.html"
        },
        error: function(errMsg) {
         console.log(errMsg);
        },
      });
    }
    if($('input[name="password"]').val()== ''  || ($('input[name="password"]').val() != $('input[name="confirmPassword"]').val())){
      alert("password dont match / empty");
    }
  }

