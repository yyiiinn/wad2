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

            $('#message').html('Login is successful!').css('color', 'green').show();   

            console.log(userCred);
            
            myStorage = window.sessionStorage;
            sessionStorage.setItem('email', email)
            sessionStorage.setItem('uid', userCred.user.uid);
            sessionStorage.setItem('navbar', "loginNavBar.html");
            // console.log(sessionStorage)

            const spotifyRefs = firebase.firestore().collection("Spotify");
            spotifyRefs.get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    if (email == doc.data().email) {
                        console.log(doc.data().song)
                        var song = doc.data().song

                        document.cookie = 'song=' + song

                        console.log(document.cookie)
                    }
                })
            })

            const usersRef = firebase.firestore().collection("Users");
            usersRef.get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    if (email == doc.data().email) {
                        // console.log(doc.data().username)
                        var username = doc.data().username
                        var name = doc.data().name

                        document.cookie = "username=" + username
                        document.cookie = "name=" + name
                        document.cookie = "email=" + email

                        console.log(document.cookie)

                        window.location.href = "index.html";  
                    }
                })
            })
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

