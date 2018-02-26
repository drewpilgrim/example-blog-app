/* global Vue, VueRouter, axios */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Welcome to Vue.js!"
    };
  },
  created: function() {},
  methods: {},
  computed: {}
};

var SignupPage = {
  template: "#signup-page",
  data: function() {
    return {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.passwordConfirmation
      };
      axios
        .post("/v1/users", params)
        .then(function(response) {
          router.push("/v1/login");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  }
};

var LoginPage = {
  template: "#login-page",
  data: function() {
    return {
      email: "",
      password: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        auth: { email: this.email, password: this.password }
      };
      axios
        .post("/user_token", params)
        .then(function(response) {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.jwt;
          localStorage.setItem("jwt", response.data.jwt);
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = ["Invalid email or password."];
            this.email = "";
            this.password = "";
          }.bind(this)
        );
    }
  }
};


var postsPage = {
  template: "#posts-page",
  data: function() {
    return {
      message: "All the posts",
      posts: [],
      errors: [],
      currentpost: {},
      currentpostID: 0
    };
  },
  created: function() {
    axios.get("http://localhost:3000/v1/posts").then(function(response){
       this.posts = response.data;
       console.log(this.posts);

      }.bind(this)).catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
function data(){ 
}
  },
  methods: {
    setCurrentPost: function(post, id) {
      this.currentpost = post;
      this.currentpostID = id;
      console.log(this.currentpost);
    },
    update: function(post) {
      console.log(this.currentpostID);

      var params = {
        first_name: this.currentpost.first_name,
        last_name: this.currentpost.last_name
      };
      axios
        .patch("/v1/posts/" + this.currentpostID, params)
        .then(function(response) {
           console.log("Updated!");
        }.bind(this)
        ).catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }

  },
  computed: {}
};


var postsShowPage = {
  template: "#postss-show-page",
  data: function() {
    return {
      message: "All the posts",
      post: {},
      errors: []
    };
  },
  created: function() {
    axios.get("/v1/posts/" + this.$route.params.id).then(function(response) {
      console.log(response.data);
      this.post = response.data;
    }.bind(this)
      ).catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
function data(){ 
}
  },
  methods: {},
  computed: {}
};

var postsNewPage = {
  template: "#posts-new-page",
  data: function() {
    return {
      user_id: 1,
      title: "",
      body: "",
      image: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        user_id: this.user_id,
        title: this.title,
        body: this.body,
        image: this.image
        };
      axios
        .post("/v1/posts", params)
        .then(function(response) {
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  }
};



var LogoutPage = {
  created: function() {
    axios.defaults.headers.common["Authorization"] = undefined;
    localStorage.removeItem("jwt");
    router.push("/");
  }
};



var router = new VueRouter({
  routes: [
  { path: "/", component: HomePage },
  { path: "/signup", component: SignupPage },
  { path: "/login", component: LoginPage },
  { path: "/logout", component: LogoutPage },
  { path: "/posts", component: postsPage },
  { path: "/posts/new", component: postsNewPage }

  ],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: "#vue-app",
  router: router,
  created: function() {
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  }
});