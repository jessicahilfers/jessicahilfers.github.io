
Promise.all([d3.csv("data/nmjustice40.csv"), d3.csv("data/foodaccessnm.csv"), d3.json("data/NewMexico10.json")])
    .then(function ([justic_data, food_data, nm_json]) {
        draw(justic_data, food_data, nm_json);
        //  returnObject = drawBubbles(demo2, demo2_geojson);
    });

// var exceed = Number(d.Excede)

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
    var allDim = ndx.dimension(function (d) {
        return d;
    });

    var countyDim = ndx.dimension(function (d) {
        return d["County"];
    });

    var foodDim = ndx.dimension(function (d) {
        return d["LATracts1"];
    })

    var food10Dim = ndx.dimension(function (d) {
        return d["LATracts10"]
    })

    var food20Dim = ndx.dimension(function (d) {
        return d["LATracts20"]
    })

    var foodVehDim = ndx.dimension(function (d) {
        return d["HUNVFlag"]
    })

    var catsExceededDim = ndx.dimension(function (d) {
        return d["Excede"]
    })

    var lowIncomeDim = ndx.dimension(function (d) {
        return d["PovertyRate"];
    });

    var percBlackDim = ndx.dimension(function (d) {
        return d["lablack1share"];
    })

    var percHispDim = ndx.dimension(function (d) {
        return d["lahisp1share"];
    })

    var snapDim = ndx.dimension(function (d) {
        return d["TractSNAP"];
    })
    // var pop2010Dim = ndx.dimension(function(d) {
    //     return d["Pop2010"];
    // });
    var mapDim = ndx.dimension(function (d) {
        return d["GEOID10"];
    });

    var groupname = "marker-select";
    var all = ndx.groupAll();
    // var pop2010Group = pop2010Dim.group().reduceCount();

    var countyGroup = countyDim.group().reduceCount();
    var foodGroup = foodDim.group().reduceCount();
    var food10Group = food10Dim.group().reduceCount();
    var food20Group = food20Dim.group().reduceCount();
    var foodVehGroup = foodVehDim.group().reduceCount();
    var catsExceededGroup = catsExceededDim.group().reduceCount();
    var lowIncomeGroup = lowIncomeDim.group().reduceCount();
    var percBlackGroup = percBlackDim.group().reduceCount();
    var percHispGroup = percHispDim.group().reduceCount();
    var snapGroup = snapDim.group().reduceCount();
    var mapGroup = mapDim.group().reduceSum(function (d) {
        return d.Excede;
    });


    var countyChart = dc.pieChart('#chart-ring-county', groupname);
    var foodChart = dc.pieChart('#chart-ring-food', groupname);
    var food10Chart = dc.pieChart('#chart-ring-food10', groupname);
    var food20Chart = dc.pieChart('#chart-ring-food20', groupname);
    var foodVehChart = dc.pieChart('#chart-ring-foodVeh', groupname);
    var catsExceededChart = dc.pieChart('#chart-ring-cats', groupname)
    var lowIncomeChart = dc.barChart('#chart-ring-lowIncome', groupname);
    var snapChart = dc.barChart('#chart-ring-snap', groupname);
    //  var percBlackChart = dc.barChart('#chart-ring-Black', groupname);
    // var percHispChart = dc.barChart('#chart-ring-Hisp', groupname);
    var map = dc_leaflet.choroplethChart("#map", groupname)
    // var map = dc_leaflet.choroplethChart("#map", groupname)

    var dataTableCount = dc.dataCount('.dc-dataTable-count', groupname);
    var dataTable = dc_datatables.datatable('#data-table', groupname);
    var dataCount = dc.dataCount('.dc-dataTitle-count', groupname);

    // var d3SchemeCategory20c = ['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#e6550d', '#fd8d3c', '#fdae6b', '#fdd0a2', '#31a354', '#74c476', '#a1d99b', '#c7e9c0', '#756bb1', '#9e9ac8', '#bcbddc', '#dadaeb', '#636363', '#969696', '#bdbdbd', '#d9d9d9']


    map
        .dimension(mapDim)
        .group(mapGroup)
        .width(600)
        .height(400)
        .center([34.528072, -106.007275])
        .zoom(6)
        .geojson(nm_json)
        .colors(colorbrewer.YlOrRd[7])
        .colorDomain([
            d3.min(mapGroup.all(), dc.pluck('value')),
            d3.max(mapGroup.all(), dc.pluck('value'))
        ])
        .colorAccessor(function (d, i) {
            return d.value;
        })
        .featureKeyAccessor(function (feature) {
            return feature.properties.GEOID10;
        })
        // .popupMod('ctrlCmd')
        // .renderPopup(true)
        // .popup(function (d, feature) {
        //     return "2010 Population : " + d["Pop2010"];
        //  })
        .legend(dc_leaflet.legend().position('bottomright').legendTitle("Disadvantaged <br> Categories"));


    /*  L.geoJSON(foodaccessnm, {
          onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.GEIOD10) {
              layer.bindPopup('<h3><p>2010 Population ' + feature.properties["POP2010"] + '</h3></p>');
            }
          },
      }).addTo(mapObject);
*/

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



    foodChart
        .width(245)
        .height(280)
        .innerRadius(70)
        .dimension(foodDim)
        .group(foodGroup)
        .legend(new dc.HtmlLegend()
            .container('#food-legend')
            .horizontal(false)
            .highlightSelected(true));

    foodChart.ordinalColors(['#47be3e', '#E5E815', '#c1c1c1'])


    food10Chart
        .width(245)
        .height(280)
        .innerRadius(70)
        .dimension(food10Dim)
        .group(food10Group)
        .legend(new dc.HtmlLegend()
            .container('#food10-legend')
            .horizontal(false)
            .highlightSelected(true));

    food10Chart.ordinalColors(['#47be3e', '#E1A91C', '#c1c1c1'])

    food20Chart
        .width(245)
        .height(280)
        .innerRadius(70)
        .dimension(food20Dim)
        .group(food20Group)
        .legend(new dc.HtmlLegend()
            .container('#food20-legend')
            .horizontal(false)
            .highlightSelected(true));

    food20Chart.ordinalColors(['#47be3e', '#DD6A23', '#c1c1c1'])

    foodVehChart
        .width(245)
        .height(280)
        .innerRadius(70)
        .dimension(foodVehDim)
        .group(foodVehGroup)
        .legend(new dc.HtmlLegend()
            .container('#foodVeh-legend')
            .horizontal(false)
            .highlightSelected(true));

    foodVehChart.ordinalColors(['#47be3e', '#D92B2B', '#c1c1c1'])

    catsExceededChart
        .width(245)
        .height(280)
        .innerRadius(70)
        .dimension(catsExceededDim)
        .group(catsExceededGroup)
        // .colors(d.scale.ordinal().range(['red','green']))
        .legend(new dc.HtmlLegend()
            .container('#cats-legend')
            .horizontal(false)
            .highlightSelected(true));

    // catsExceededChart.ordinalColors(['#FF1010', '#E42914', '#CA4219', '#AF5B1E', '#957523', '#7B8E28', '#60A72D', '#46C032', '#2CDA37']);

    catsExceededChart.ordinalColors(['#FAF8BD', '#F5DEAA', '#F1C498', '#EDAB86', '#E99174', '#E57761', '#E15E4F', '#DD443D', '#D92B2B']);

    // comented out by Dr. Yang
    // lowIncomeChart
    //     .width(1200)
    //     .height(280)
    //     .x(d3.scaleBand())
    //     .xUnits(dc.units.ordinal)
    //     .brushOn(false)
    //     .yAxisLabel("Poverty rate")
    //     .dimension(lowIncomeDim)
    //     .group(lowIncomeGroup)


    // Dr. Yang added for bar chart Start

    lowIncomeChart
        .width(700)
        .height(400)
        .margins({ top: 10, right: 20, bottom: 35, left: 50 }) // because of the x axix label, need to set the bootom margin a large number
        .x(d3.scaleLinear().domain([0, 70]))   //d3.scale.ordinal().domain(genusDim) //d3.scaleBand() for d3 v4 //May want to make this non-ordinal
        // .xUnits(dc.units.linear)
        .linearColors(["#008080"])
        .brushOn(true)
        .xAxisLabel('Poverty Rate Percent (%)')
        .yAxisLabel('Number of Tracts')
        // .elasticX(true)
        .elasticY(true)
        .yAxisPadding('10%')
        .xAxisPadding('20%')
        .dimension(lowIncomeDim)
        .barPadding(0.02)
        .outerPadding(0.05)
        .group(lowIncomeGroup)
        .renderlet(function (chart) {
            chart.selectAll("g.x text")
                // .attr('dx', '-30')
                .attr('dx', '0')
                .attr('transform', "rotate(0)");
        });
    // need to tweak this...
    lowIncomeChart.xAxis().tickValues([0, 10, 20, 30, 40, 50, 60, 70]);

    // Dr. Yang added for bar chart End

    snapChart
        .width(700)
        .height(370)
        .margins({ top: 10, right: 20, bottom: 35, left: 50 }) // because of the x axix label, need to set the bootom margin a large number
        .x(d3.scaleLinear().domain([0, 1400]))   //d3.scale.ordinal().domain(genusDim) //d3.scaleBand() for d3 v4 //May want to make this non-ordinal
        // .xUnits(dc.units.linear)
        .linearColors(["#008080"])
        .brushOn(true)
        .xAxisLabel('SNAP Recipients')
        .yAxisLabel('Number of Tracts')
        .elasticY(true)
        .yAxisPadding('10%')
        .xAxisPadding('20%')
        .dimension(snapDim)
        .barPadding(0.02)
        .outerPadding(0.05)
        .group(snapGroup)
        .renderlet(function (chart) {
            chart.selectAll("g.x text")
                .attr('dx', '0')
                .attr('transform', "rotate(0)");
        });
    snapChart.xAxis().tickValues([5, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400]);
    // lowIncomeChart.yAxis().tickValues([1, 2, 3, 4, 5, 6, 7]); didn't work





    /* percBlackChart
         // .width(500)
         // .height(250)
          .x(d3.scaleBand())
          //.xUnits(dc.units.ordinal)
          .brushOn(false)
          .yAxisLabel("Percent Black")
          .dimension(percBlackDim)
          .group(percBlackGroup)*/

    /* percHispChart
         .width(500)
         .height(250)
         .x(d3.scaleBand())
         .xUnits(dc.units.ordinal)
         .brushOn(false)
         .yAxisLabel("Percent Hispanic")
         .dimension(percHispDim)
         .group(percHispGroup)*/

    dataCount
        .dimension(ndx)
        .group(all);

    dataTableCount
        .dimension(ndx)
        .group(all)

    dataTable
        .dimension(allDim)
        .group(function (d) {
            return 'dc.js insists on putting a row here so I remove it using JS';
        })
        .size(15)
        .columns([{
            label: 'GEOID10',
            type: 'string',
            format: function (d) {
                return d["GEOID10"];
            }

        }, {
            label: 'State',
            type: 'num',
            format: function (d) {
                return d["State"];
            }
        }, {
            label: 'County',
            type: 'num',
            format: function (d) {
                return d["County"];
            }
        }, {
            label: 'Population',
            type: 'num',
            format: function (d) {
                return d["Pop2010"];
            }
        }, {
            label: 'Median Family Income ($)',
            type: 'num',
            format: function (d) {
                return d["MedianFamilyIncome"];
            }
        }, {
            label: 'Poverty Rate %',
            type: 'num',
            format: function (d) {
                return d["PovertyRate"];
            }
        }, {
            label: 'Population: White',
            type: 'num',
            format: function (d) {
                return d["TractWhite"];
            }
        }, {
            label: 'Population: Black',
            type: 'num',
            format: function (d) {
                return d["TractBlack"];
            }
        }, {
            label: 'Population: Asian',
            type: 'num',
            format: function (d) {
                return d["TractAsian"];
            }
        }, {
            label: 'Population: Native Hawaian or Pacific Islander',
            type: 'num',
            format: function (d) {
                return d["TractNHOPI"];
            }
        }, {
            label: 'Population: American Indian or Alaska Native',
            type: 'num',
            format: function (d) {
                return d["TractAIAN"];
            }
        }, {
            label: 'Population: Hispanic',
            type: 'num',
            format: function (d) {
                return d["TractHispanic"];
            }
        }, {
            label: 'Population: Multiracial',
            type: 'num',
            format: function (d) {
                return d["TractOMultir"];
            }
        }, {
            label: 'Population: Seniors',
            type: 'num',
            format: function (d) {
                return d["TractSeniors"];
            }
        }, {
            label: 'Population: Kids',
            type: 'num',
            format: function (d) {
                return d["TractKids"];
            }
        }, {
            label: 'Flood Risk %',
            type: 'num',
            format: function (d) {
                return d["Flood"];
            }
        }, {
            label: 'Fire Risk %',
            type: 'num',
            format: function (d) {
                return d["Fire"];
            }
        }

        ])
        .sortBy(function (d) {
            return d.Title;
        })
        .order(d3.ascending)
        .options({
            "scrollX": true
        })
        .on('renderlet', function (table) {
            table.selectAll('.dc-table-group').classed('info', true);
        });

    d3.selectAll('a#all').on('click', function () {
        dc.filterAll(groupname);
        dc.renderAll(groupname);
    });


    d3.selectAll('a#county').on('click', function () {
        countyChart.filterAll(groupname);
        dc.redrawAll(groupname);
    });

    d3.selectAll('a#lowIncome').on('click', function () {
        lowIncomeChart.filterAll(groupname);
        dc.redrawAll(groupname);
    });

    $("#mapReset").on('click', function () {
        // paperMarkers.map().setView([24.5, 1.343465], 1);
        // paperMarkers.map().setView([47, -16.7], 1);
        paperMarkers.map().setView([19.7, 4.1], 2);
    });

    dc.renderAll(groupname);
};



$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

// var offset = 70;
// $('.navbar li a').click(function(event) {
//     event.preventDefault();
//     $($(this).attr('href'))[0].scrollIntoView();
//     scrollBy(0, -offset);
// });

var navOffset = $('.navbar').height();

$('.navbar li a').click(function (event) {
    var href = $(this).attr('href');

    event.preventDefault();
    window.location.hash = href;

    $(href)[0].scrollIntoView();
    window.scrollBy(0, -navOffset);
});