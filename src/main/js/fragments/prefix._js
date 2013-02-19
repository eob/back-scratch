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
  // StateMachine
  // ==========================================================================
  //
  //     var object = {};
  //     _.extend(object, CTSUI.StateMachine);
  //
  // ==========================================================================


