var WidgetView = CTSUI.WidgetView = function(opts, args) {
};

_.extend(WidgetView.prototype, {
});

var WidgetController = CTSUI.WidgetController = function(opts, args) {
  this.opts = opts || {};
  this.initialize.apply(this, args);
  this.desiredFutureState = null;
};

_.extend(WidgetController.prototype, Events, StateMachine, {
  initialize: function(args) {
    this.initializeStateMachine();
    this.reporting = new CTSUI.Reporting();
    this.presence = new CTSUI.Presence();
    this.view = new CTSUI.WidgetView();

    this.presence.on('LoginSucceeded', this._loginSuccess, this);
    this.presence.on('LoginFailed', this._loginFailure, this);
  },

  initializeStateMachine: function() {
    this.fsmInitialize(
      'Loaded', [
      { 'from':'Loaded', 'to':'Idle', 'name':'Startup' },
      { 'from':'Idle', 'to':'Copying', 'name':'Copying' },
      { 'from':'Idle', 'to':'Pasting', 'name':'Pasting' },
      { 'from':'Copying', 'to':'Idle', 'name':'DoneCopying' },
      { 'from':'Pasting', 'to':'Idle', 'name':'DonePasting' }
    ]);

  },

  _loginSuccess: function() {
  },

  _loginFailure: function() {
  }

});
