/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * Mobile page responsible for showing the "form" showcase.
 */
qx.Class.define("qooxdoomynotes.page.StartPage",
{
  extend : qx.ui.mobile.page.NavigationPage,

  construct : function()
  {
    this.base(arguments);
    this.setTitle("My Notes");
    this.setShowButton(true);
    this.setButtonText("New Note");
    
   
  }
  ,
  members:
  {
    __newNoteButton:null,
    
    _initialize: function(){
   __newNoteButton= this.getRightContainer().getChildren()[0];
   __newNoteButton.action="newNote";
   __newNoteButton.addListener("tap", function() {
    this.routeTo(__newNoteButton.action);
    }, this);

  }
  ,
  routeTo:function(path){
        return qx.core.Init.getApplication().getRouting().executeGet("/"+path);

  }
  }
 


  
  }); 
