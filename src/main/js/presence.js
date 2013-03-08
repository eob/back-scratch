var Presence = CTSUI.Presence = function(opts, args) {
  this.opts = opts || {
    "server":"http://localhost:3000",
    "path":"/api/v1"
  };
  this.token = null;
  this.initialize.apply(this, args);
};

_.extend(Presence.prototype, Events, {

  initialize: function(args) {
  },

  login: function(callback) {
    var url = this.opts.server + this.opts.path + "/user/login";
    CTSUI.$.ajax({
        type:"POST",
        dataType:"json",
        url: url,
        crossDomain: true,
        success: this._loginAsAnonymousSucceeded,
        error: this._loginAsAnonymousFailed,
        context: this
      }
    );
  },

  logout: function(callback) {
    CTSUI.$.ajax({
      dataType:"json",
      type:'POST',
      url:this.opts.server + this.opts.path + "/user/logout",
      success:callback,
      headers:{
        'X-CSRF-Token': this.token
      },
      crossDomain: true,
      beforeSend: function(xhr) {
        xhr.withCredentials = true;
      }
    });
  },

  request: function(opts) {
    if (this.token !== null) {
      if (typeof opts.data == "undefined") {
        opts.data = {};
      }
      opts.data.auth_token = this.token;
    }
    CTSUI.$.ajax(opts);
  },

  isLoggedInAnonymously: function() {
    return false;
  },

  isLoggedIn: function(callback) {
    this.request({
      dataType:"json",
      url:this.opts.server + this.opts.path + "/user/is_logged_in?callback=?",
      success:_.bind(function(resp) {
        this.token = resp.token;
        callback(resp);
      }, this) 
    });
  },


  signup: function() {
  },

  /**
   * @param jqXHR jqXHR
   * @param textStatus String
   * @param errorThrown String
   */
  _loginAsAnonymousFailed: function(jqXHR, textStatus, errorThrown) {
    this.trigger("LoginAsAnonymousFailed");
    callback();
  },

  /**
   *
   */
  _loginAsAnonymousSucceeded: function(data) {
    this.token = data.token;
    this.trigger("LoginAsAnonymousSucceeded");
  },

  _loginFailed: function() {
    this.trigger("LoginFailed");
  },

  _loginSucceeded: function() {
    this.trigger("LoginSucceeded");
  },

  _logoutFailed: function() {
    this.trigger("LogoutFailed");
  },

  _logoutSucceeded: function() {
    this.trigger("LogoutSucceeded");
  },

  _signupFailed: function() {
    this.trigger("SignupFailed");
  },

  _signupSucceeded: function() {
    this.trigger("SignupSucceeded");
  }
});
