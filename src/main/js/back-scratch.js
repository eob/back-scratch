// Cascading Tree Sheets
// (c) Edward Benson

(function() {
  
  // Initial Setup
  // ==========================================================================
  // 
  // ==========================================================================
  
  // Save a reference to the global object. `this` is `window` in a browser.
  var root = this;

  // The top-level namespace.
  // All CTS classes and modules will be attached to this.
  // Exported for both CommonJS and the browser.
  var CTSUI;
  if (typeof exports !== 'undefined') {
    CTSUI = exports;
  } else {
    CTSUI = root.CTSUI = {};
  }

  // Current version of the library. Keep in sync with `package.json`
  CTSUI.VERSION = '0.1.0';

  // For our purposes, jQuery owns the $ variable.
  CTSUI.$ = root.jQuery;

  // For our purposes, Underscore owns the _ variable.
  // Require it if on server and not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // Events
  // ==========================================================================
  //
  // This is taken completely from Backbone.Events
  //
  //     var object = {};
  //     _.extend(object, CTSUI.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  // ==========================================================================

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
    } else if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
    } else {
      return true;
    }
  };

  // Optimized internal dispatch function for triggering events. Tries to
  // keep the usual cases speedy (most Backbone events have 3 arguments).
  var triggerEvents = function(obj, events, args) {
    var ev, i = -1, l = events.length;
    switch (args.length) {
    case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx);
    return;
    case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0]);
    return;
    case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0], args[1]);
    return;
    case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0], args[1], args[2]);
    return;
    default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
    }
  };

  var Events = CTSUI.Events = {

    // Bind one or more space separated events, or an events map,
    // to a `callback` function. Passing `"all"` will bind the callback to
    // all events fired.
    on: function(name, callback, context) {
      if (!(eventsApi(this, 'on', name, [callback, context]) && callback)) return this;
      this._events || (this._events = {});
      var list = this._events[name] || (this._events[name] = []);
      list.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind events to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!(eventsApi(this, 'once', name, [callback, context]) && callback)) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      this.on(name, once, context);
      return this;
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `events` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var list, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = {};
        return this;
      }

      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (list = this._events[name]) {
          events = [];
          if (callback || context) {
            for (j = 0, k = list.length; j < k; j++) {
              ev = list[j];
              if ((callback && callback !== (ev.callback._callback || ev.callback)) ||
                  (context && context !== ev.context)) {
                events.push(ev);
              }
            }
          }
          this._events[name] = events;
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = [];
      if (arguments.length > 1) {
        args = arguments.slice(1, arguments.length);
      }
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(this, events, args);
      if (allEvents) triggerEvents(this, allEvents, arguments);
      return this;
    },

    // An inversion-of-control version of `on`. Tell *this* object to listen to
    // an event in another object ... keeping track of what it's listening to.
    listenTo: function(object, events, callback, context) {
      context = context || this;
      var listeners = this._listeners || (this._listeners = {});
      var id = object._listenerId || (object._listenerId = _.uniqueId('l'));
      listeners[id] = object;
      object.on(events, callback || context, context);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(object, events, callback, context) {
      context = context || this;
      var listeners = this._listeners;
      if (!listeners) return;
      if (object) {
        object.off(events, callback, context);
        if (!events && !callback) delete listeners[object._listenerId];
      } else {
        for (var id in listeners) {
          listeners[id].off(null, null, context);
        }
        this._listeners = {};
      }
      return this;
    }
  };

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // StateMachine
  // ==========================================================================
  //
  //     var object = {};
  //     _.extend(object, CTSUI.StateMachine);
  //
  // ==========================================================================

  var StateMachine = CTSUI.StateMachine = {
    /*
     * [{from: _, to: _, name: _}]
     */
    fsmInitialize: function(initialState, arcs, opts) {
      this._fsmCurrent = initialState;
      this._fsmArcs = {};
      _.each(arcs, function(arc) {
        if (! _.contains(this._fsmArcs, arc['from'])) {
          this._fsmArcs[arc['from']] = {};
        }
        this._fsmArcs[arc['from']][arc['to']] = arc['name'];
      }, this);
    },

    fsmCurrentState: function() {
      return this._fsmCurrent;
    },

    fsmCanTransition: function(toState) {
      if ((this._fsmArcs[this._fsmCurrent]) &&
          (this._fsmArcs[this._fsmCurrent][toState])) {
        return true;
      } else {
        return false;
      }
    },

    fsmTransition: function(newState) {
      // Check to make sure it's possible
      if (this.fsmCanTransition) {
        var from = this._fsmCurrent;
        var to = newState;
        var name = this._fsmArcs[from][to];
        this.trigger('FsmLeft:' + from);
        this._fsmCurrent = to;
        console.log("Transitioning to", to);
        this.trigger('FsmEdge:' + name);
        this.trigger('FsmEntered:' + to);
      } else {
        throw new Error(
            "Can not make transition " + this._fsmCurrent + " -> " + newState);
      }
    },
  };

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
        opts.data["auth_token"] = this.token;
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
      r["name"] = name;
      r["params"] = params;
      r["localTime"] = date.getTime();
      r["localTimeZoneOffset"] = date.getTimezoneOffset();
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

}).call(this);
