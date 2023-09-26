// json url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

function init() {
    var dropDown = d3.select("#selDataset");
//JSON data
    d3.json(url).then(function (data) {
        var sampleId = data.names;
        sampleId.forEach((sample) => {
            dropDown.append("option").text(sample).property("value", sample)
        });
        var initSample = sampleId[0];
        buildDemo(initSample);
        buildCharts(initSample);
    });
};

// create charts 
function buildCharts(sample) {
    d3.json(url).then(function (data) {
        var allSamples = data.samples;
        var sampleInfo = allSamples.filter(row => row.id == sample);
        var sampleValues = sampleInfo[0].sample_values;
        var sampleValuesSlice = sampleValues.slice(0,10).reverse();
        var otuIds = sampleInfo[0].otu_ids;
        var otuIdsSlice = otuIds.slice(0,10).reverse();
        var otuLabels = sampleInfo[0].otu_labels;
        var otuLabelsSlice = otuLabels.slice(0,10).reverse();
        var metaData = data.metadata;
        var metaDataSample = metaData.filter(row => row.id == sample);
        var wash = metaDataSample[0].wfreq;

        // bar chart
        var trace1 = {
            x: sampleValuesSlice,
            y: otuIdsSlice.map(item => `OTU ${item}`),
            type: "bar",
            orientation: "h",
            text: otuLabelsSlice,
        };
        var data = [trace1];
        Plotly.newPlot("bar", data)

        // bubble chrat
        var trace2 = {
            x: otuIds,
            y: sampleValues,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: "Earth"
            },
            text: otuIds
        };
        var data2 = [trace2];
        var layout = {
            showlegend: false
        };

        Plotly.newPlot("bubble", data2, layout);

        // gauge chart
        var data3 = [
            {
            domain: { x: [0, 1], y: [0, 1] },
            value: wash,
            title: {text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { dtick: 1,
                    range: [0, 9],
                    tickcolor: "black"
                },
                bar: { color: "#840000" },
                steps: [
                { range: [0, 1], color: "#f8f3ed" },
                { range: [1, 2], color: "#f4f2e5" },
                { range: [2, 3], color: "#eae6ca" },
                { range: [3, 4], color: "#e4e8af" },
                { range: [4, 5], color: "#d4e598" },
                { range: [5, 6], color: "#b7cd90" },
                { range: [6, 7], color: "#8cc186" },
                { range: [7, 8], color: "#89bc8c" },
                { range: [8, 9], color: "#7fb285" },
                ],
                threshold: {
                line: { color: "#840000", width: 2 },
                thickness: 0.5,
                value: wash
                }
            }
            }
        ];
        
        var layout2 = { width: 600, height: 450, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', data3, layout2);
    });
};

function buildDemo(sample) {
    var demo = d3.select("#sample-metadata");
    d3.json(url).then(function (data) {
        var metaData = data.metadata;
        var metaDataSample = metaData.filter(row => row.id == sample);
        demo.selectAll("p").remove();
        metaDataSample.forEach((row) => {
            for (const [key, value] of Object.entries(row)) {
                demo.append("p").text(`${key}: ${value}`);
            };
        });
    });
};

// 
function optionChanged(sample) {
    buildDemo(sample);
    buildCharts(sample);
};

init();


