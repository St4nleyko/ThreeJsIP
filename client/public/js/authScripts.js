// const { access } = require("fs");

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
          document.cookie="at="+data.accessToken;
          document.cookie="uid="+data.id;
          document.cookie="username="+data.username;
          document.cookie="portal="+0;
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
  let accessToken = document.cookie.substring(0, document.cookie.indexOf(';'));
  accessToken=accessToken.slice(3);
  console.log(accessToken)
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/getuser",
        headers: {'x-access-token': accessToken},
        success: function (result, status, xhr) {
            $('#userId').html('ID: '+result.id)
            $('#user_id').val(result.userID)
            $('#email').val(result.email)
            $('#username').val(result.username)
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
  }
  function checkUserData(){
    let accessToken = document.cookie.substring(0, document.cookie.indexOf(';'));
    accessToken=accessToken.slice(3);
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