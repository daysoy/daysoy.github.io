
// Utilize the required API for verifying that the VizController has been loaded before registration
pen.require(["common-ui/vizapi/VizController"], function(){ 

// Register the visualization metadata with the Visualization API
  pentaho.visualizations.push({ 
    id: 'pentaho_sample_KPI',      // unique identifier 
    type: 'kpi',                   // generic type id 
    source: 'Example',             // id of the source library 
    name: 'Example KPI',           // visible name, this will come from a properties 
                                   // file eventually 
    'class': 'pentaho.sample.KPI', // type of the Javascript object to instantiate 
    args: {                        // arguments to provide to the Javascript object 
                                   // this allows a single class to act as multiple visualizations
    aggregate: 'AVG'
    }, 
    propMap: [], 
    dataReqs: [                    // dataReqs describes the data requirements of 
                                   // this visualization 
      { 
        name: 'Default', 
        reqs : 
          [ 
            { 
              id: 'rows',               // ID of the data element 
              dataType: 'string',       // data type - 'string', 'number', 'date', 
                                        // 'boolean', 'any' or a comma separated list 
              dataStructure: 'column',  // 'column' or 'row' - only 'column' supported
                                        // so far 
              caption: 'Level',         // visible name 
              required: true,           // true or false 
              allowMultiple: false, 
              ui: { 
                group: 'data' 
              } 
            }, 
            {
              id: 'measures', 
              dataType: 'number', 
              dataStructure: 'column', 
              caption: 'Measure', 
              required: true, 
              allowMultiple: false, 
              ui: { 
                group: "data" 
              } 
            }, 
            { 
              id: 'aggregate', 
              dataType: 'string', 
              values: ['MIN', 'MAX', 'AVG'], 
              ui: { 
                labels: ['Minimum', 'Maximum', 'Average'], 
                group: 'options', 
                type: 'combo',  // combo, checkbox, slider, textbox, gem, 
                                // gemBar, and button are valid ui types
                caption: 'Aggregation' 
              }
            }
          ]
      }
        ],
        menuOrdinal: 10001,
        menuSeparator: true,
        maxValues: [1000, 2000, 3000]
  });

  /* define a namespace for this sample to live in */
pentaho.sample = {};
/* define the KPI Class, which renders a single KPI */
pentaho.sample.KPI = function(canvasElement) {
  this.canvasElement = canvasElement;
  this.numSpan = document.createElement("span"); 
  this.numSpan.style.fontSize = "42px"; 
  this.numSpan.style.position = "relative"; 
  this.canvasElement.appendChild(this.numSpan);
};

/* Calculate the location of the KPI relative to the canvas */
pentaho.sample.KPI.prototype.resize = function(width, height){ 
  this.numSpan.style.left = ((this.canvasElement.offsetWidth - this.numSpan.offsetWidth) / 2) + 'px'; 
  this.numSpan.style.top = ((this.canvasElement.offsetHeight - this.numSpan.offsetHeight) / 2) + 'px'; 
};

/* Render the KPI */
pentaho.sample.KPI.prototype.draw = function(datView, vizOptions) { 
  // extract the values from the result set
  var rows = datView.dataTable.jsonTable.rows; 
  var dataArray = []; 
  for(var i=0; i<rows.length; i++){ 
    dataArray.push(rows[i].c[1].v); 
  } 

  // calculate the KPI to display
  var value = 0; 

  // note that the vizOptions contains an aggregate option,
  // this is a custom property specific for this visualization type.
  switch(vizOptions.aggregate){ 
    case "MAX": 
      value = Number.MIN_VALUE;
      for(var i=0; i< dataArray.length; i++){ 
        value = Math.max(value, dataArray[i]); 
      } 
      break; 
    case "MIN": 
      value = Number.MAX_VALUE;
      for(var i=0; i< dataArray.length; i++){ 
        value = Math.min(value, dataArray[i]); 
      } 
      break; 
    case "AVG": 
      var total = 0; 
      for(var i=0; i< dataArray.length; i++){ 
        total += dataArray[i]; 
      } 
      value = total / dataArray.length; 
      break; 
    default: 
  }   // Update the background color
  this.canvasElement.style.backgroundColor = vizOptions['myBackgroundColor'];
  this.canvasElement.style.color = 'magenta';
  // write the KPI value to the screen
  this.numSpan.innerHTML = value; 
  this.resize(); 
} 
       
	     });
