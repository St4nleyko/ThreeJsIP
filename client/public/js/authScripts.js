
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
        console.log(data);
        document.cookie=data.accessToken;
        console.log(document.cookie);

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
        headers: {'x-access-token': document.cookie},
        success: function (result, status, xhr) {
            console.log(result[0]);
            $('#userId').html('ID: '+result[0].id)
            $('#email').val(result[0].email)
            $('#username').val(result[0].username)
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
        headers: {'x-access-token': document.cookie},
        success: function (result, status, xhr) {
            console.log(result[0]);
            $("#loginLink").hide()
            $("#registerLink").hide()
            $("#profileLink").show()
        },
        error: function (xhr, status, error) {
            console.log(error);
            return status; 
        }
    });
  }