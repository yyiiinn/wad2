$(document).ready(function() {
    firebase.initializeApp(firebaseConfig);
    
    $(".signin-form").on("submit", function(event) {
        event.preventDefault();

        var email = $("#email").val();
        var password = $("#pass").val();

        firebase.auth().signInWithEmailAndPassword(email, password)
        // .then(function(user) {
        //     // redirect to homepage after successful login
        //     // var url = "/wad2/web/homepage.html";    
        //     // $(location).attr('href',url);
        //     console.log(user.user)
        //     window.location.href = "../web/homepage.html";  
        // })
        .then((userCred) => {

            console.log(userCred);
            
            myStorage = window.localStorage;
            myStorage = window.sessionStorage;
            localStorage.setItem('uid', userCred.user.uid);
            sessionStorage.setItem('navbar', "loginNavBar.html");

            const usersRef = firebase.firestore().collection("Users");
            usersRef.get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    if (email == doc.data().email) {
                        // console.log(doc.data().username)
                        var username = doc.data().username
                        var name = doc.data().name

                        localStorage.setItem('username',username)
                        localStorage.setItem('name',name)
                        localStorage.setItem('email',email)
                    }
                })
            })

            console.log(localStorage)
            console.log(sessionStorage)

            $('#message').html('Login is successful!').css('color', 'green').show();   
            // window.location.assign("../web/"); setTimeout(undefined, 5000);
    
            window.open("../web/");
            // window.location.href = "../web/";  


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







