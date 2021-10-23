$(document).ready(function() {
    firebase.initializeApp(firebaseConfig);
    
    $(".signup-form").on("submit", function(event) {
        event.preventDefault();

        var name = $('#name').val();
        var email = $("#email").val();
        var password = $("#pass").val();
        var re_pass = $("#re_pass").val();

        if (re_pass === password) {
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function(user) {
                // find out how to do crud with firebase and create a database with user info
                // user info includes name and email 
                console.log(user);
                // var uid = firebase.database().ref().child('users').push().key;

                // var data = {
                //     name: name,
                //     email: email
                // }

                // var updates = {};
                // updates['/users/'] = data;
                // firebase.database().ref().update(updates);

                // alert('the user is created successfully');

                // redirect to homepage after successful registration
                // var url = "/wad2/web/homepage.html";    
                // $(location).attr('href',url);  
                window.location.href = "../web/homepage.html";  
            })
            .catch(function(err) {
                if (err.code == "auth/invalid-email") {
                    $('#message').html('You have entered an invalid email').css('color', 'red').show();   
                } else if (err.code == "auth/email-already-in-use") {
                    $('#message').html('The email provided has already registered').css('color', 'red').show();   
                }
            })
        } else {
            // error message for mismatch password and re_pass
            $('#message').html('Password entered does not match').css('color', 'red').show();   
        }

        
    })
})