function submitForm() {
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
            console.log(status);
            window.location = "/bingo";
           },
            error: function(xhr, textStatus, error) {
            console.log(error);
            window.location = "/bingo";
            }
    })
};

// Get the input field
var input = document.getElementById("username");

// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("loginForm").click();
  }
}); 