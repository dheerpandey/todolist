var chartConfig = [];

function loadChartConfig(worksapceName, pipelineName, sectionName, eventName, startDate, endDate, startAfter, baseThreshold) {
    var url = Settings.T3APIUrl + worksapceName + "/" + pipelineName + "/" + sectionName + "/" + eventName + "/" + startDate + "/" + endDate + "/" + startAfter + "/" + baseThreshold + "/getmodel";
    var proxy = new ServiceProxy(url);
    var response = proxy.getTrends();

    $.each(response, function (i, items) {
        
        chartConfig.push({
            charttype: items.Type,
            threshold: items.Threshold,
            config:
            {
                type: "line",
                options: chartOptions,
                data:
                {
                     
                    datasets: function () {
                        var ds = [];

                        var thresholdTrend = 
                        {
                            label: "Threshold",
                            backgroundColor: 'rgba(255,192,203,0.5)',
                            borderColor: 'rgba(255,192,203,0.5)',                              
                            fill: true,
                            lineTension: 0
                        };
                        thresholdTrend.data = getthresholdTrend(items.Threshold, items.Datasets);

                        $.each(items.Datasets, function (j, item) {
                            ds.push({
                                fill: false,
                                borderWidth: 1,
                                backgroundColor: getRandomColor(),
                                borderColor: getRandomColor(),
                                tension: 0.3,
                                data: item.trendDataPoints,
                                label: item.label
                            });
                        })
                        //Add Threshhold Data for each chart.[This should be based on API data, Hard-Coded, since not getting any threshold data from the API.]
                        ds.push({
                            fill: thresholdTrend.fill,
                            borderWidth: 1,
                            backgroundColor: thresholdTrend.backgroundColor,
                            borderColor: thresholdTrend.borderColor,
                            lineTension: thresholdTrend.lineTension,
                            data: thresholdTrend.data,
                            label: thresholdTrend.label
                        });
                        return ds;
                    }()
                }
            }
        });
    })
}

function getthresholdTrend(th, trends) {
        //Build threshold data points from Threshold values.
        var arr = [];
        var xAxis, yAxis;
        var basethreshold = parseFloat(th[1].basethreshold);
        var magnitude = parseFloat(th[0].magnitude);
        var holdtime = parseFloat(th[2].holdtime);
        var decaytime = parseFloat(th[3].decaytime);

        xAxis = 0;
        yAxis = basethreshold;
        arr.push({ x: xAxis, y: yAxis });
        
        xAxis = parseFloat(trends[1].trendDataPoints[0].x);
        arr.push({ x: xAxis, y: yAxis });

        yAxis = (basethreshold * magnitude);
        arr.push({ x: xAxis, y: yAxis });

        xAxis = xAxis + holdtime;
        arr.push({ x: xAxis, y: yAxis });
        
        xAxis = xAxis + decaytime;
        arr.push({ x: xAxis, y: basethreshold });

        xAxis = 16; //trends[1].trendDataPoints[trends[1].trendDataPoints.length - 1].x;
        arr.push({ x: xAxis, y: basethreshold });

     return arr;
    //return [{ x: 0, y: 100 }, { x: 1, y: 100 }, { x: 1, y: 200 }, { x: 11, y: 200 }, { x: 14, y: 100}, { x: 16, y: 100 }];
}

var chartOptions = {
    responsive: true,
    legend: {
        display: false
    },
    tooltips: {
        mode: 'single',
        intersect: false,
    },
    hover: {
        mode: 'nearest',
        intersect: true
    },
    onClick: function (event, array) {
        if (array[0]) {
            var currentDataSet = $(this)[0].config.data.datasets[array[0]._datasetIndex];
            if (currentDataSet.label == "Threshold")
                return;

            if (currentDataSet.borderDash) {
                currentDataSet.borderDash = null;
            } else {
                currentDataSet.borderDash = [5, 5];
            }
            this.update();
        }
    },
    scales: {
        xAxes: [{
            display: true,
            type: 'linear',
            position: 'bottom',
            scaleLabel: {
                display: true,
                labelString: 'Time'
            }
        }],
        yAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: 'IMBALANCE'
            }
        }]
    }
}