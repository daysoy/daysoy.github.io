var analyzerPlugins = analyzerPlugins || []; 
analyzerPlugins.push( 
{ 
  init:function () { 

	// Register visualizations to display in Analyzer 
    cv.pentahoVisualizations.push(pentaho.visualizations.getById(
      'pentaho_sample_KPI')); 

    /* 
     Helpers contain code that knows about the Analyzer specific context. The one 
     function that's required "generateOptionsFromAnalyzerState" is called so the 
     visualization can set its own options based on Analyzer's current report. 
     */ 
    cv.pentahoVisualizationHelpers['pentaho_sample_KPI'] = { 
    // Use one of Analyzer's stock placeholder images. 
    placeholderImageSrc: CONTEXT_PATH 
      + 'content/analyzer/images/viz/VERTICAL_BAR.png', 

    /*
     This method allows a visualization to generate visualization specific 
     options based on Analyzer’s report definition. In the following example, 
     this visualisation is setting a background color using the same background 
     color setting in Chart Options. You can figure out the existing chart 
     options by looking at the report XML by clicking the XML link in Analyzer.    
     @return a hash object containing the custom state of your visualization.
     */
    generateOptionsFromAnalyzerState:function (report) { 
      return {myBackgroundColor: 
      report.reportDoc.getChartOption("backgroundColor")}; 
    }
  };

    /*
     LayoutConfig objects manage the interaction between Analyzer's Layout Panel
     and the visualization's settings.
     */

    // Declare a new class which extends the built-in version from Analyzer. 
    dojo.declare("SampleConfig", [analyzer.LayoutConfig], { 

    /** 
     * @param config    The parse Configuration object which serves 
     *                  as the model of the Panel. 
     * @param item      The item in the panel which originated the event. 
     * @param eventName The name of the event (clicked, value, etc). 
     * @param args      A Hash Object containing relevent values (prevVal, 
     *                  newVal, etc). 
     */ 
    onModelEvent: function(config, item, eventName, args) {

    if (eventName == "value") {
    // This component has a single argument, so we assume if this event is 
    // fired it is for the aggregate option.
    // This will update the visualization args with the new value for 
    // aggregate. Also note that when the Analyser report is saved, a 
    // snapshot of the visualization args will be saved to the report XML.

    this.report.visualization.args['aggregate'] = 
      config.byId('aggregate').value; 

    //Add a report state item to the undo/redo history stack. 

    this.report.history.add(new cv.ReportState("Update KPI Aggregation"));

    //Trigger a report refresh so that the visualization is updated with the
    //change.
    this.report.refreshReport();
    }
    this.inherited(arguments); 
    // Let super class handle the insertAt and removedGem events. 
    }
  });


    // Register the Layout Panel Configuration Manager. 
    // Note that the string entry matches 'JSON_' plus the visualization id 
    // defined earlier.
    analyzer.LayoutPanel.configurationManagers['JSON_pentaho_sample_KPI'] = 
      SampleConfig; 
    }
  }
);