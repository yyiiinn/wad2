// Vue.Js    
// console.log(getCookie('username'))
// console.log(getCookie('email'))
// console.log(getCookie('name'))
const app = Vue.createApp (
    // parse in argument (Object)
    {
        data() {
            return {
                email: getCookie('email'),
                username: getCookie('username'),
                fullname: getCookie('name'),
                aboutme: '',
                playlist: getCookie('song')
            }
        },
        methods: {
        }
    }
)    
// mounting to div to "print"
const vm = app.mount('#app');


// Get cookie
function getCookie(name) {
var cname = name + "=";
var decodedCookie = decodeURIComponent(document.cookie);
var ca = decodedCookie.split(';');
for(var i = 0; i < ca.length; i++){
var c = ca[i];
while(c.charAt(0) == ' '){
    c = c.substring(1);
}
if(c.indexOf(cname) == 0){
    return c.substring(cname.length, c.length);
}
}
return "";
}