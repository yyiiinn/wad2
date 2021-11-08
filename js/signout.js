function logout() {
    firebase.auth().signOut()
    .then(function() {
        // console.log(document.cookie)
        deleteAllCookies();
        // console.log('Signed Out');

        sessionStorage.removeItem('navbar');
        sessionStorage.removeItem('uid');
        sessionStorage.removeItem('email');

        window.location.href = "index.html";  

      }, function(error) {
        console.error('Sign Out Error', error);
    });

    console.log(sessionStorage)
}

function deleteAllCookies() {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}
