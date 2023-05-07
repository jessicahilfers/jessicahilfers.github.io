Promise.all([d3.csv("data/nmjustice40.csv"), d3.csv("data/foodaccessnm.csv"), d3.json("data/NewMexico10.json")])
    .then(function([justic_data, food_data, nm_json]) {
        draw(justic_data, food_data, nm_json);
        //  returnObject = drawBubbles(demo2, demo2_geojson);
    });


function draw(justic_data, food_data, nm_json) {
    // dataP = [];
    // console.log(food_data)
    // console.log(dataP)
    // food_data.forEach(function(d) {
    //     d.sum = 0;
    //     for (var p in d)
    //         if (p && p != "GEOID10" && p != "sum") {
    //             dataP.push({
    //                 'code': d.GEOID10,
    //                 'variables': p,
    //                 'value': +d[p]
    //             });
    //             d.sum += +d[p];
    //         }
    // });
    // delete data;


    // merge two csv data
    // const dataP = new Map();
    // food_data.forEach(item => dataP.set(item.GEOID10, item));
    // justic_data.forEach(item => dataP.set(item.GEOID10, {...dataP.get(item.GEOID10), ...item }));
    // const data_merged = Array.from(dataP.values());
    // console.log(data_merged)
    // console.log(food_data)
    // ndx = crossfilter(data_merged);

    ndx = crossfilter(food_data);
    var allDim = ndx.dimension(function(d) {
        return d;
    });

    var countyDim = ndx.dimension(function(d) {
        return d["County"];
    });
    var lowIncomeDim = ndx.dimension(function(d) {
        return d["LowIncomeTracts"];
    });
    // var pop2010Dim = ndx.dimension(function(d) {
    //     return d["Pop2010"];
    // });
    var mapDim = ndx.dimension(function(d) {
        return d["GEOID10"];
    });

    var groupname = "marker-select";
    var all = ndx.groupAll();
    // var pop2010Group = pop2010Dim.group().reduceCount();

    var countyGroup = countyDim.group().reduceCount();
    var lowIncomeGroup = lowIncomeDim.group().reduceCount();
    var mapGroup = mapDim.group().reduceSum(function(d) {
        return d.Excede;
    });


    var countyChart = dc.pieChart('#chart-ring-county', groupname);
    var lowIncomeChart = dc.barChart('#chart-ring-lowIncome', groupname);
    var map = dc_leaflet.choroplethChart("#map", groupname)
        // var map = dc_leaflet.choroplethChart("#map", groupname)

    var dataTableCount = dc.dataCount('.dc-dataTable-count', groupname);
    var dataTable = dc_datatables.datatable('#data-table', groupname);
    var dataCount = dc.dataCount('.dc-dataTitle-count', groupname);

    var d3SchemeCategory20c = ['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#e6550d', '#fd8d3c', '#fdae6b', '#fdd0a2', '#31a354', '#74c476', '#a1d99b', '#c7e9c0', '#756bb1', '#9e9ac8', '#bcbddc', '#dadaeb', '#636363', '#969696', '#bdbdbd', '#d9d9d9']


    map
        .dimension(mapDim)
        .group(mapGroup)
        .width(750)
        .height(400)
        .center([34.528072, -106.007275])
        .zoom(6)
        .geojson(nm_json)
        .colors(colorbrewer.YlGnBu[7])
        .colorDomain([
            d3.min(mapGroup.all(), dc.pluck('value')),
            d3.max(mapGroup.all(), dc.pluck('value'))
        ])
        .colorAccessor(function(d, i) {
            return d.value;
        })
        .featureKeyAccessor(function(feature) {
            return feature.properties.GEOID10;
        })
        .popupMod('ctrlCmd')
        .renderPopup(true)
        .popup(function(d, feature) {
            return feature.properties.TRACTCE10 + " : " + d.Excede;
        })
        .legend(dc_leaflet.legend().position('bottomright'));

    countyChart
        .width(245)
        .height(280)
        .innerRadius(70)
        .dimension(countyDim)
        .group(countyGroup)
        .legend(new dc.HtmlLegend()
            .container('#county-legend')
            .horizontal(false)
            .highlightSelected(true));

    lowIncomeChart
        .width(245)
        .height(280)
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .brushOn(false)
        .yAxisLabel("This is the Y Axis!")
        .dimension(lowIncomeDim)
        .group(lowIncomeGroup)
        // .on('renderlet', function(chart) {
        //     chart.selectAll('rect').on("click", function(d) {
        //         console.log("click!", d);
        //     });
        // });


    dataCount
        .dimension(ndx)
        .group(all);

    dataTableCount
        .dimension(ndx)
        .group(all)

    dataTable
        .dimension(allDim)
        .group(function(d) {
            return 'dc.js insists on putting a row here so I remove it using JS';
        })
        .size(10)
        .columns([{
                label: 'GEOID10',
                type: 'string',
                format: function(d) {
                    return d["GEOID10"];
                }

            }, {
                label: 'Pop2010',
                type: 'num',
                format: function(d) {
                    return d["Pop2010"];
                }
            }, {
                label: 'State',
                type: 'num',
                format: function(d) {
                    return d["State"];
                }
            }, {
                label: 'County',
                type: 'num',
                format: function(d) {
                    return d["County"];
                }
            }, {
                label: 'OHU2010',
                type: 'num',
                format: function(d) {
                    return d["OHU2010"];
                }
            }, {
                label: 'GroupQuartersFlag',
                type: 'num',
                format: function(d) {
                    return d["GroupQuartersFlag"];
                }
            }, {
                label: 'NUMGQTRS',
                type: 'num',
                format: function(d) {
                    return d["NUMGQTRS"];
                }
            }, {
                label: 'LILATracts_1And10',
                type: 'num',
                format: function(d) {
                    return d["LILATracts_1And10"];
                }
            }, {
                label: 'MedianFamilyIncome',
                type: 'num',
                format: function(d) {
                    return d["MedianFamilyIncome"];
                }
            }, {
                label: 'PCTGQTRS',
                type: 'num',
                format: function(d) {
                    return d["PCTGQTRS"];
                }
            }, {
                label: 'PovertyRate',
                type: 'num',
                format: function(d) {
                    return d["PovertyRate"];
                }
            }, {
                label: 'LowIncomeTracts',
                type: 'num',
                format: function(d) {
                    return d["LowIncomeTracts"];
                }
            }

        ])
        .sortBy(function(d) {
            return d.Title;
        })
        .order(d3.ascending)
        .options({
            "scrollX": true
        })
        .on('renderlet', function(table) {
            table.selectAll('.dc-table-group').classed('info', true);
        });

    d3.selectAll('a#all').on('click', function() {
        dc.filterAll(groupname);
        dc.renderAll(groupname);
    });


    d3.selectAll('a#county').on('click', function() {
        countyChart.filterAll(groupname);
        dc.redrawAll(groupname);
    });

    d3.selectAll('a#lowIncome').on('click', function() {
        lowIncomeChart.filterAll(groupname);
        dc.redrawAll(groupname);
    });

    $("#mapReset").on('click', function() {
        // paperMarkers.map().setView([24.5, 1.343465], 1);
        // paperMarkers.map().setView([47, -16.7], 1);
        paperMarkers.map().setView([19.7, 4.1], 2);
    });

    dc.renderAll(groupname);
};



$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

// var offset = 70;
// $('.navbar li a').click(function(event) {
//     event.preventDefault();
//     $($(this).attr('href'))[0].scrollIntoView();
//     scrollBy(0, -offset);
// });

var navOffset = $('.navbar').height();

$('.navbar li a').click(function(event) {
    var href = $(this).attr('href');

    event.preventDefault();
    window.location.hash = href;

    $(href)[0].scrollIntoView();
    window.scrollBy(0, -navOffset);
});