const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

function init(){
    d3.json(url).then(function(data1){
        let dropdown = d3.select('#selDataset');
        let names = data1.names;
        names.forEach(function(id){
            dropdown.append('option').text(id).property('value', id);
        });
        chart_values(names[0]);
        meta_data(names[0]);
    });
};

function optionChanged(passedvalue){
    chart_values(passedvalue);
    meta_data(passedvalue);
};

function chart_values(passedvalue){
    d3.json(url).then(function(data1){
        let sample_data = data1.samples;
        let results = sample_data.filter(id => id.id == passedvalue);
        
        let sample_values = results[0].sample_values;
        let otu_ids = results[0].otu_ids;
        let otu_labels = results[0].otu_labels;
       
        charts(sample_values, otu_ids, otu_labels);
    });
};
function charts(sample_values, otu_ids, otu_labels){
    d3.json(url).then(function(data1){
        // console.log(sample_values, otu_ids, otu_labels);    
        let bar_trace1 = [{
            type: 'bar',
            x: sample_values.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            text: otu_labels,
            orientation: 'h'
        }];
        let bubble_trace1 = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker:{
                color: otu_ids,
                colorscale: 'Earth',
                size: sample_values
            }
        }];
        let bar_trace1_layout = {
            title: 'Top 10 OTUs',
            height: 500,
            width: 400
        };

        let bubble_trace1_layout = {
            title: 'Bubble Chart',
            xaxis: { title: 'OTU ID'},
            height: 600,
            width: 1000
        };
        Plotly.newPlot('bar', bar_trace1, bar_trace1_layout);
        Plotly.newPlot('bubble', bubble_trace1, bubble_trace1_layout);

    });
};
function meta_data(passedvalue){
    d3.json(url).then(function(data1){
        let samples = data1.metadata;
        let id = samples.filter(id=>id.id == passedvalue);

        let sample_metadata = d3.select('#sample-metadata').html('');

        // using array method to iterate through the values
        Object.entries(id[0]).forEach(([key, value]) => {
            
            // display information in demographic info chart/table
            sample_metadata.append("h5").text(`${key}: ${value}`);
        });
    });
};
init();
