$(document).ready(function() {
    firebase.initializeApp(firebaseConfig);
    
    const usersRef = firebase.firestore().collection("Users");

    $(".signup-form").on("submit", function(event) {
        event.preventDefault();

        var username = $('#username').val();
        var name = $('#name').val();
        var email = $("#email").val();
        var password = $("#pass").val();
        var re_pass = $("#re_pass").val();

        usersRef.where("username", "==", username).get().then((doc) => {
            if(!doc.empty) {
                $('#message').html('Username is already taken!').css('color', 'red').show(); 
            }
            else{
                //sign up the user     
                if (re_pass === password) {
                    firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(function(user) {
                        let data = {
                            email: email,
                            username: username,
                            name: name
                        };
        
                        usersRef.doc(email).set(data);
        
                        $('#message').html('<p style="color:green;">You have successfully registered. Click <a href="login.html">here</a> to login </p>').show();    
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
            }
        })
               
        
    })
})