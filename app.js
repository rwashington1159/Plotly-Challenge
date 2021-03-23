function retrievePlot(name) {

    // getting data from json file
    d3.json("samples.json").then((data) => {

    var samples = data.samples.filter(d => d.id === name)[0];

    var sample_values = samples.sample_values.slice(0,10).reverse();
    
    var topValues = samples.otu_ids.slice(0,10).reverse();

    var otu_id = topValues.map(d => "OTU " + d)
    
    var labels = samples.otu_labels.slice(0,10);

    var wash = data.metadata.filter(d => d.id.toString() === name)[0];

    var washFreq = wash.wfreq;

    var samplevalues = samples.sample_values.slice(0, 10).reverse();
  
    // get only top 10 otu ids for the plot OTU and reversing it. 
    var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
    
    // get the otu id's to the desired form for the plot
    var OTU_id = OTU_top.map(d => "OTU " + d)

  //   console.log(`OTU IDS: ${OTU_id}`)


    // get the top 10 labels for the plot
    var labels = samples.otu_labels.slice(0, 10);

  //   console.log(`Sample Values: ${samplevalues}`)
  //   console.log(`Id Values: ${OTU_top}`)
    // create trace variable for the plot
    var trace = {
        x: samplevalues,
        y: OTU_id,
        text: labels,
        marker: {
          color: 'rgb(142,124,195)'},
        type:"bar",
        orientation: "h",
    };

    // create data variable
    var data = [trace];

    // create layout variable to set plots layout
    var layout = {
        title: "Top 10 OTU",
        yaxis:{
            tickmode:"linear",
        },
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 30
        }
    };

    // create the bar plot
    Plotly.newPlot("bar", data, layout);

    //console.log(`ID: ${samples.otu_ids}`)
  
    // The bubble chart
    var trace1 = {
        x: samples.otu_ids,
        y: samples.sample_values,
        mode: "markers",
        marker: {
            size: samples.sample_values,
            color: samples.otu_ids
        },
        text: samples.otu_labels

    };

    // Layout for bubble plot
    var layout_b = {
        xaxis:{title: "OTU ID"},
        height: 600,
        width: 1000
    };

    // Variable 
    var data1 = [trace1];

    // Bubble plot
    Plotly.newPlot("bubble", data1, layout_b); 

    // The guage chart

    var data_g = [
      {
      domain: { x: [0, 1], y: [0, 1] },
      value: parseFloat(wfreq),
      title: { text: `Weekly Washing Frequency ` },
      type: "indicator",
      
      mode: "gauge+number",
      gauge: { axis: { range: [null, 9] },
               steps: [
                { range: [0, 2], color: "yellow" },
                { range: [2, 4], color: "cyan" },
                { range: [4, 6], color: "teal" },
                { range: [6, 8], color: "lime" },
                { range: [8, 9], color: "green" },
              ]}
          
      }
    ];
    var layout_g = { 
        width: 700, 
        height: 600, 
        margin: { t: 20, b: 40, l:100, r:100 } 
      };
    Plotly.newPlot("gauge", data_g, layout_g);
  });
}  
// Function to get the necessary data
function getInfo(id) {
// read the json file to get data
d3.json("Data/samples.json").then((data)=> {
    
    // Demographic metadata panel
    var metadata = data.metadata;

    console.log(metadata)

    // Meta data info by id
    var result = metadata.filter(meta => meta.id.toString() === id)[0];

    // Panel to put data
    var demographicInfo = d3.select("#sample-metadata");
    
    // Demographic info panel each time before getting new id info
    demographicInfo.html("");

    // Demographic data
    Object.entries(result).forEach((key) => {   
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
    });
});
}

// Change event function
function optionChanged(id) {
getPlot(id);
getInfo(id);
}

// Function for the initial rendering of data
function init() {
// Dropdown menu selection 
var dropdown = d3.select("#selDataset");

// Read data 
d3.json("Data/samples.json").then((data)=> {
    console.log(data)

    // ID data to the dropdwown menu
    data.names.forEach(function(name) {
        dropdown.append("option").text(name).property("value");
    });

    // Display data and plots
    getPlot(data.names[0]);
    getInfo(data.names[0]);
});
}

init();

