module("Login", {
  setup : function () {
    this.a = $("<div id='a'>a</div>").appendTo($("body"));
    this.b = $("<div id='b'>b</div>").appendTo($("body"));
	},
	teardown : function () {
    this.a.remove();
    this.a = null;
    this.b.remove();
    this.b = null;
	}
});

test("Login", function () {
//  var A = new CTS.DomNode(this.a);
//  var B = new CTS.DomNode(this.b);
//  var BB = new CTS.Selection([B]);
//  A.isIncoming(BB);
//  equal(this.b.html(), "b", "should be b");
//  equal(this.a.html(), "b", "should be b");
});


