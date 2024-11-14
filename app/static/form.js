function loginForm(){
    let username = $("#username").val()
    console.log(username)
    $.ajax({
        url: '/',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            "username": username
        }),
        dataType: 'json',
            success: function (textStatus, status) {
            // console.log(textStatus);
            console.log(status);
            // Simulate an HTTP redirect:
            window.location.replace("/bingo");
           },
            error: function(xhr, textStatus, error) {
            // console.log(xhr.responseText);
            // console.log(xhr.statusText);
            // console.log(textStatus);
            console.log(error);
            window.location.replace("/bingo");
            }
    })
};
