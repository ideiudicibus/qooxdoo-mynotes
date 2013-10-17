/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "qooxdoomynotes"
 *
 * @asset(qooxdoomynotes/*)
 */
qx.Class.define("qooxdoomynotes.Application",
{
  extend : qx.application.Mobile,

  /** Holds the application routing */
  properties : {
    routing : {
      init: null
    }
  },

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * This method contains the initial application code and gets called
     * during startup of the application
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */

      // Create the pages
      var startPage =new qooxdoomynotes.page.StartPage();
      var form = new qooxdoomynotes.page.Form();
      

/*
      // Add the pages to the page manager
      var manager = new qx.ui.mobile.page.Manager();
      manager.addMaster(overview);
      manager.addDetail([
        basic,
        events,
        carousel,
        drawer,
        list,
        tab,
        toolbar,
        form,
        animation,
        animationLanding,
        atoms,
        dialogs,
        dataBinding,
        maps,
        canvas,
        themeSwitcher
      ]);*/

// Add the pages to the page manager.
      var manager = new qx.ui.mobile.page.Manager(false);
      manager.addDetail([
        startPage,
        form
      ]);

      // Initialize the navigation
      var nm = new qx.application.Routing();
      this.setRouting(nm);

      var isTablet = (qx.core.Environment.get("device.type") == "tablet");
      var isDesktop = (qx.core.Environment.get("device.type") == "desktop");

     

      nm.onGet("/", function(data) {
        startPage.show();
      },this);
      nm.onGet("/newNote", function(data) {
        form.show();
      },this);

     

      // start the navigation handling
      nm.init();
  }
}
});
