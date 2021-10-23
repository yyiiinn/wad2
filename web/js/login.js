$(document).ready(function() {
    firebase.initializeApp(firebaseConfig);
    
    $(".signin-form").on("submit", function(event) {
        event.preventDefault();

        var email = $("#email").val();
        var password = $("#pass").val();



        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(user) {
            // redirect to homepage after successful login
            // var url = "/wad2/web/homepage.html";    
            // $(location).attr('href',url);
            window.location.href = "../web/homepage.html";  
        })
        .catch(function(err) {
            if (err.code == "auth/wrong-password") {
                $('#message').html('You have entered the wrong password').css('color', 'red').show();   
            } else if (err.code == "auth/user-not-found") {
                $('#message').html('The email provided has not registered').css('color', 'red').show();   
            }
            console.log(err);
        })
    })
})