// Use the D3 library to read in samples.json from the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
function optionChanged() {};

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);

  // Display the sample metadata
  function infoTable(sampleId) {
    const selector = d3.select("#sample-metadata");
    const metadata = data.metadata;
    const metaResult = metadata.filter(x => x.id == sampleId)[0];
    selector.html("");

    Object.entries(metaResult).forEach(entry => {
      const [key, value] = entry;
      console.log(key, value);
      selector.append("h5").text(`${key}: ${value}`);
    });
  }

  // Update all the plots when a new sample is selected
 optionChanged = function optionChanged(sampleId) {
    infoTable(sampleId);
    charts(sampleId);
  }

  // Display each key-value pair from the metadata JSON object somewhere on the page
  function infoTable(sampleId) {
    const selector = d3.select("#sample-metadata");
    const metadata = data.metadata;
    const metaResult = metadata.filter(x => x.id == sampleId)[0];
    selector.html("");

    Object.entries(metaResult).forEach(entry => {
      const [key, value] = entry;
      console.log(key, value);
      selector.append("h5").text(`${key}: ${value}`);
    });
  }

  function charts(sampleId) {
    const samples = data.samples;
    const sampleResult = samples.filter(x => x.id == sampleId)[0];
    const otu_ids = sampleResult.otu_ids;
    const otu_labels = sampleResult.otu_labels;
    const sample_values = sampleResult.sample_values;

    // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
    const barData = [{
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids.slice(0, 10).map(x => `OTU ${x}`).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    const barLayout = { title: "Top 10 OTUs" };

    Plotly.newPlot("bar", barData, barLayout);

    // Create a bubble chart that displays each sample.
    const bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        colorscale: 'Earth',
        size: sample_values
      }
    }];

    const bubbleLayout = { title: 'Belly Button Samples' };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
  }

  function init() {
    const selector = d3.select("#selDataset");
    const names = data.names;

    names.forEach((name) => {
      selector.append("option").text(name);
    });

    infoTable(names[0]);
    charts(names[0]);
  }

  init();
});
