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
qx.Class.define("qooxdoomynotes.page.Form",
{
  extend : qx.ui.mobile.page.NavigationPage,

  construct : function()
  {
    this.base(arguments);
    this.setTitle("New Note");
    this.setShowBackButton(true);
    this.setBackButtonText("Back");
  },


  members :
  {
  
    __save : null,
    __result : null,
    __resultPopup : null,
    __closeResultPopup : null,
    __slide : null,
    
   
    __form : null,
    __submitButton : null,
    
    __picker : null,
    __dateField: null,
    __textualNoteField:null,
    __categoryField: null,
    __categoryFieldPicker:null,


    // overridden
    _initialize : function()
    {
      this.base(arguments);
      this.__form= null;
      this.__form = this.__createForm();
      this.getContent().add(new qx.ui.mobile.form.renderer.Single(this.__form));

      this.__submitButton = new qx.ui.mobile.form.Button("Submit");
      this.__submitButton.addListener("tap", this._onButtonTap, this);
      this.__submitButton.addListener("touchstart", qx.bom.Event.preventDefault, this);
      this.__submitButton.setEnabled(true);
      this.getContent().add(this.__submitButton);

      this.__result = new qx.ui.mobile.form.Label();
      this.__result.addCssClass("registration-result");
      var popupContent = new qx.ui.mobile.container.Composite();
      this.__closeResultPopup = new qx.ui.mobile.form.Button("OK");
      this.__closeResultPopup.addListener("tap", function() {
        this.__resultPopup.hide();
      },this);

      popupContent.add(this.__result);
      popupContent.add(this.__closeResultPopup);

      this.__resultPopup = new qx.ui.mobile.dialog.Popup(popupContent);
      this.__resultPopup.setTitle("Registration Result");
    },


    /**
     * Creates the form for this showcase.
     *
     * @return {qx.ui.mobile.form.Form} the created form.
     */
    __createForm : function()
    {
      var form = new qx.ui.mobile.form.Form();
      form.addGroupHeader("Note Basic Info");
     
      //Date Field and Picker
      this.__dateField = new qx.ui.mobile.form.TextField().set({placeholder:"enter note date"});
     
      this.__dateField.setValue(moment().format("dddd, MMMM Do YYYY"));

      this.__dateField.setRequired(true);

      this.__dateField.addListener("tap", function(e) {
          this._stop();
          this.__picker.show();
      }, this);
      form.add(this.__dateField, "Note Date");

      this.__picker = new qx.ui.mobile.dialog.Picker(this.__dateField);

      var pickerSlotDay = new qx.data.Array(["01", "02", "03", "04", "05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"]);
      var pickerSlotMonth = new qx.data.Array(["01", "02", "03", "04", "05","06","07","08","09","10","11","12"]);
      var pickerSlotYear = new qx.data.Array(["2010", "2011", "2012", "2013"]);

      this.__picker.setTitle("Date Picker");
      this.__picker.addSlot(pickerSlotDay);
      this.__picker.addSlot(pickerSlotMonth);
      this.__picker.addSlot(pickerSlotYear);

      this.__picker.setSelectedIndex(0,((moment().date())%31)-1);
      this.__picker.setSelectedIndex(1,moment().month());
      this.__picker.setSelectedIndex(2,pickerSlotYear.indexOf((moment().year()).toString()));
      this.__picker.addListener("confirmSelection", this.__onPickerConfirmSelection,this);
      
      
      //Textual field 
      this.__textualNoteField = new qx.ui.mobile.form.TextArea().set({placeholder:"enter note text"});
      this.__textualNoteField.setRequired(true);
      form.add(this.__textualNoteField,"Note Text");
      
      this.__categoryField = new qx.ui.mobile.form.TextArea();

      this.__categoryFieldPicker = new qx.ui.mobile.dialog.Picker(this.__categoryField);

      this.__categoryField.addListener("tap", function(e) {
          this._stop();
          this.__categoryFieldPicker.show();
      }, this);

      var categoryPickerSlot = new qx.data.Array(["Restaurant","Wine","Cinema","Movie","Book","Dinner","Meal","Offer"]);
      this.__categoryFieldPicker.setTitle("Pick a Note Category");
      this.__categoryFieldPicker.addSlot(categoryPickerSlot);
      this.__categoryFieldPicker.addListener("confirmSelection", this.__onCategoryPickerConfirmSelection,this);

      this.__categoryField.addListener("tap", function(e) {
          this._stop();
          this.__categoryFieldPicker.show();
      }, this);
      
      form.add(this.__categoryField,"Category");     



      this.__name = new qx.ui.mobile.form.TextField().set({placeholder:"Username"});
      this.__name.setRequired(true);
      form.addGroupHeader("Note Rating");
      //form.add(this.__name, "Username");

      this.__password = new qx.ui.mobile.form.PasswordField().set({placeholder:"Password"});
      //form.add(this.__password, "Password");

      this.__rememberPass = new qx.ui.mobile.form.CheckBox();
      //form.add(this.__rememberPass, "Remember password? ");
      this.__rememberPass.setModel("password_reminder");
      this.__rememberPass.bind("model",this.__password,"value");
      this.__password.bind("value",this.__rememberPass,"model");

      // NUMBER FIELD
      this.__numberField = new qx.ui.mobile.form.NumberField();
      this.__numberField.setValue("0");
      this.__numberField.setMaximum(150);
      this.__numberField.setMinimum(0);
      //form.add(this.__numberField,"Age");

      //form.addGroupHeader("Gender");
      this.__radio1 = new qx.ui.mobile.form.RadioButton();
      this.__radio2 = new qx.ui.mobile.form.RadioButton();

      var radioGroup = new qx.ui.mobile.form.RadioGroup();
      radioGroup.setAllowEmptySelection(true);
      radioGroup.add(this.__radio1, this.__radio2);
      //form.add(this.__radio1, "Male");
      //form.add(this.__radio2, "Female");

      /*form.addGroupHeader("Feedback");
      var dd = new qx.data.Array(["Web search", "From a friend", "Offline ad","Magazine","Twitter","Other"]);
      var selQuestion = "How did you hear about us ?";

      this.__sel = new qx.ui.mobile.form.SelectBox();
      this.__sel.set({required: true});
      this.__sel.set({placeholder:"Unknown"});
      this.__sel.setClearButtonLabel("Clear");
      this.__sel.setDialogTitle(selQuestion);
      this.__sel.setModel(dd);

      form.add(this.__sel, selQuestion);

      form.addGroupHeader("License");
      this.__info = new qx.ui.mobile.form.TextArea().set({
        placeholder: "Terms of Service",
        readOnly: true
      });
      form.add(this.__info,"Terms of Service");
      this.__info.setValue("qooxdoo Licensing Information\n=============================\n\nqooxdoo is dual-licensed under the GNU Lesser General Public License (LGPL) and the Eclipse Public License (EPL). \n The above holds for any newer qooxdoo release. Only legacy versions 0.6.4 and below were licensed solely under the GNU Lesser General Public License (LGPL). For a full understanding of your rights and obligations under these licenses, please see the full text of the LGPL and/or EPL. \n \n One important aspect of both licenses (so called \"weak copyleft\" licenses) is that if you make any modification or addition to the qooxdoo code itself, you MUST put your modification under the same license, the LGPL or EPL. \n  \n \n  \n Note that it is explicitly NOT NEEDED to put any application under the LGPL or EPL, if that application is just using qooxdoo as intended by the framework (this is where the \"weak\" part comes into play - contrast this with the GPL, which would only allow using qooxdoo to create an application that is itself governed by the GPL).");
*/
      this.__slide = new qx.ui.mobile.form.Slider();
      form.add(this.__slide,"Rate this note");

      this.__save = new qx.ui.mobile.form.ToggleButton(false,"Agree","Reject",13);
      this.__save.addListener("changeValue", this._enableFormSubmitting, this);
      //form.add(this.__save, "? ");

      

      
      this._createValidationRules(form.getValidationManager());

      return form;
    },

    /**
     * Reacts on "changeSelection" event on picker, and displays the values on resultsLabel.
     */
    __onPickerChangeSelection : function(e) {
      //qx.event.type.Data data = 

    },


    /**
     * Reacts on "confirmSelection" event on picker, and displays the values on resultsLabel.
     */
    __onPickerConfirmSelection : function(e) {
      var tmp="";
      for(var i =0; i<e.getData().length;i++) {
        var data = e.getData()[i];
        tmp+=data.item;
      }
      
      this.__dateField.setValue(moment(tmp,"DDMMYYYY").format("dddd, MMMM Do YYYY"));
    },

    __onCategoryPickerConfirmSelection: function(e){
      var tmp=this.__categoryField.getValue();
      var tmpArray=null;
      /*if(!underscore.isEmpty(tmp)) {tmp=tmp+",";}
      this.__categoryField.setValue(tmp+e.getData()[0].item);*/
      if(!underscore.isEmpty(tmp)){
         tmpArray=tmp.split(",");
        
      }
      else {
        tmpArray=[];
      }
     
        tmpArray.push(e.getData()[0].item);
        tmpArray=underscore.uniq(tmpArray);
        this.__categoryField.setValue(tmpArray); 
      
    },


    /**
     * Adds all validation rules of the form.
     * @param validationManager {qx.ui.form.validation.Manager} the created form.
     */
    _createValidationRules : function(validationManager) {
      // USERNAME validation
     /* validationManager.add(this.__name, function(value, item){
        var valid = value != null && value.length>3;
        if(!valid) {
          item.setInvalidMessage("Username should have more than 3 characters!");
        }
        return valid;
      }, this);

      // PASSWORD validation
      validationManager.add(this.__password, function(value, item){
        var valid = value != null && value.length>3;
        if(!valid) {
          item.setInvalidMessage("Password should have more than 3 characters!");
        }
        return valid;
      }, this);

      // AGE validation
      validationManager.add(this.__numberField, function(value, item) {
        if(value == null || value == "0") {
          item.setInvalidMessage("Please enter your age.");
          return false;
        }

        if (value.length == 0 || value.match(/[\D]+/)) {
          item.setInvalidMessage("Please enter a valid age.");
          return false;
        }

        if(value < item.getMinimum() || value > item.getMaximum()) {
          item.setInvalidMessage("Value out of range: "+ item.getMinimum()+"-"+item.getMaximum());
          return false;
        }*/
        return true;
      
    },


    _enableFormSubmitting : function(evt) {
     
    },


    /**
     * Event handler.
     *
     * @param evt {qx.event.type.Tap} The tap event.
     */
    _onButtonTap : function()
    {
      if(this.__form.validate())
      {
        var result = [];
        result.push("Username: " +  this.__name.getValue());
        result.push("Password: " +  this.__password.getValue());
        result.push("Age: " +  this.__numberField.getValue());
        result.push("Male: " +  this.__radio1.getValue());
        result.push("Female: " +  this.__radio2.getValue());
        result.push("Agree on our terms: " +  this.__save.getValue());
        result.push("How did you hear about us : " +  this.__sel.getValue());
        result.push("Are you human? : " +  this.__slide.getValue() +"%");
        this.__result.setValue(result.join("<br>"));
        this.__resultPopup.show();
      } else {
        // Scroll to invalid field.
        var invalidItems = this.__form.getInvalidItems();

        this.scrollToWidget(invalidItems[0].getLayoutParent(), 500);
      }
    },


    // overridden
    _stop : function() {
      if(this.__resultPopup) {
        this.__resultPopup.hide();
      }
      this.base(arguments);

      if (this.__picker) {
        this.__picker.hide();
      }

    },


    // overridden
    _back : function()
    {
      qx.core.Init.getApplication().getRouting().executeGet("/", {reverse:true});
    }
  }
});
