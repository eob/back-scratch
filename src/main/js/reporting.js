var Reporting = CTSUI.Reporting = function(presence, opts, args) {
  this.opts = opts || {};
  this.pesence = presence;
  this.initialize.apply(this, args);
  this.queue = [];
  // TODO(eob): Add tick, tock, inc methods.
};

_.extend(Reporting.prototype, {
  report: function(name, params) {
    var r = {};
    var date = new Date();
    r.name = name;
    r.params = params;
    r.localTime = date.getTime();
    r.localTimeZoneOffset = date.getTimezoneOffset();
    this.queue[this.queue.length] = r;
    this.maybeFlushQueue();
  },

  maybeFlushQueue: function() {
    this.flushQueue();
  },

  flushQueue: function() {
    CTSUI.$.ajax({
      dataType:"json",
      type:'POST',
      url:this.opts.server + this.opts.path + "/report",
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

  _flushQueueSuccess: function(data) {
  },

  _flushQueueFailed: function(data) {
  }
});
