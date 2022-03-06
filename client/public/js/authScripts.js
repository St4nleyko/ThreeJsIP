
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
          url: "http://localhost:8080/api/auth/signup",
          contentType: "application/json",
          dataType: "json",
          data: JSON.stringify({
                "username":$('input[name="username"]').val(),
                "email":$('input[name="email"]').val(),
                "password":confirmedPass,
                "roles":[$('input[name="role"]:checked').val()]
              }),
          success:  function (data, status) {
            console.log(data);
            location.href="http://127.0.0.1:5500/client/views/login.html"
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
        url: "http://localhost:8080/api/auth/signin",
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
          window.location.href="http://127.0.0.1:5500/client/views/myprofile.html"
        },
        error: function(errMsg) {
        alert("Wrong credentials");
        console.log(errMsg);
        },
      });
    }


//get user data and fill them
function getUserDataMyProfile(){

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/getuser",
        headers: {'x-access-token': accessToken},
        success: function (result, status, xhr) {
            $('#email').val(result.email)
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
        url: "http://localhost:8080/api/getuser",
        headers: {'x-access-token':accessToken},
        success: function (result, status, xhr) {
            console.log(result);
            $("#loginLink").hide()
            $("#registerLink").hide()
            $("#profileLink").show()
            $("#logout").show()

        },
        error: function (xhr, status, error) {
            console.log(error);
            $("#logout").hide()
            $("#portals").hide()
            return status; 
        }
    });
  }
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const userProfileId = urlParams.get('id')

  function getUserProfile(){
    if(userProfileId == userId){
      window.location.href="http://127.0.0.1:5500/client/views/myprofile.html"

    }
    $.ajax({
      type: "GET",
      url: "http://localhost:8080/api/getuserprofile/"+userProfileId,
      headers: {'x-access-token':accessToken},
      success: function (result, status, xhr) {
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

      },
      error: function (xhr, status, error) {
        return status; 
      }
    });

  }

