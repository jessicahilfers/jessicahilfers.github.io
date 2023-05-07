/*     Choropleth      */
var choro =
    function drawChoropleth(data, geojson) {
        dataP = [];
        data.filter(function (d) {
            return d.code && d.code != 'SOF46';
        }).forEach(function (d) {
            d.sum = 0;
            for (var p in d)
                if (p && p != "code" && p != "sum") {
                    dataP.push({ 'code': d.code, 'type': p, 'value': +d[p] });
                    d.sum += +d[p];
                }
        });
        delete data;

        var xf = crossfilter(dataP);
        var groupname = "Choropleth";
        var facilities = xf.dimension(function (d) { return d.code; });
        var facilitiesGroup = facilities.group().reduceSum(function (d) { return d.value; });

        dc.leafletChoroplethChart("#demo3 .map", groupname)
            .dimension(facilities)
            .group(facilitiesGroup)
            .width(600)
            .height(400)
            .center([42.69, 25.42])
            .zoom(7)
            .geojson(geojson)
            .colors(['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'])
            .colorDomain(function () {
                return [dc.utils.groupMin(this.group(), this.valueAccessor()),
                dc.utils.groupMax(this.group(), this.valueAccessor())];
            })
            .colorAccessor(function (d, i) {
                return d.value;
            })
            .featureKeyAccessor(function (feature) {
                return feature.properties.code;
            })
            .renderPopup(true)
            .popup(function (d, feature) {
                return feature.properties.nameEn + " : " + d.value;
            });

        var types = xf.dimension(function (d) { return d.type; });
        var typesGroup = types.group().reduceSum(function (d) { return d.value; });

        dc.pieChart("#demo3 .pie", groupname)
            .dimension(types)
            .group(typesGroup)
            .width(200)
            .height(200)
            .ordering(function (p) {
                return +p.key.substr(6);
            })
            .renderLabel(false)
            .renderTitle(true)
            .title(function (d) {
                var age = d.data.key.substr(6);
                if (age.indexOf("p") == -1)
                    age = "Between " + (+age - 4) + "-" + age;
                else
                    age = "Over " + age.substr(0, 2);
                return age + " : " + d.value;
            });

        dc.renderAll(groupname);
    }

