module("Login", {
  setup : function () {
    window.presence = new CTSUI.Presence();
	},
	teardown : function () {
    window.presence = null;
	}
});

asyncTest("Login and Logout as Anon", function () {
  window.presence.on("LoginAsAnonymousSucceeded", function() {
    ok(true, "Login as anonymous succeeded");
    presence.isLoggedIn(function(res1) {
      ok(res1.logged_in, "Presence resports logged in status");
      presence.logout(function(res2) {
        ok(true, "Logout callback hit");
        presence.isLoggedIn(function(res3) {
          ok((! res3.loged_in), "Logout succeeded");
          start();
        });
      });
    });
  });

  window.presence.on("LoginAsAnonymousFailed", function() {
    ok(false, "Login as anonymous failed");
    start();
  });

  presence.isLoggedIn(function(res) {
    if (res.logged_in) {
      presence.logout(function(r) {
        presence.login();
      });
    } else {
      presence.login();
    }
  });
});

