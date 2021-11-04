function logout() {
    firebase.auth().signOut()
    .then(function() {
        console.log('Signed Out');
        localStorage.clear()
        sessionStorage.removeItem('navbar');

        window.location.href = "index.html";  

      }, function(error) {
        console.error('Sign Out Error', error);
    });

    console.log(sessionStorage)
}