// Vue.Js    
var storage = localStorage
console.log(storage);

const app = Vue.createApp (
            // parse in argument (Object)
            {
                data() {
                    return {
                        email: storage.email,
                        username: storage.username,
                        fullname: storage.name,
                        aboutme: ''
                    }
                },
                methods: {
                }
            }
        )
        
        // mounting to div to "print"
    const vm = app.mount('#app');