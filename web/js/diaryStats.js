$(function () {
    $('#positivePercent').highcharts({
      exporting: {
    enabled: false
  },credits: {
     enabled: false
},
        colors: ['#a5e398', '#f5f5f5'],
        title: {
            text: '50%',
            verticalAlign: 'middle'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false
                },
                size: 90,
                borderWidth: 0,
                renderTo: 'container'
            }
        },
        series: [{
            type: 'pie',
            name: 'positive',
            innerSize: '90%',
            data: [50,50],
            states: {
hover: {
enabled: false, 
lineWidth: 1,
},
inactive: {
        opacity: 1
      }
}
        }],
        tooltip: {
        enabled: false,
        animation: false,
    },  
        
    });
});

$(function () {
    $('#neutralPercent').highcharts({
      exporting: {
    enabled: false
  },credits: {
     enabled: false
},
        colors: ['#c9c8c5', '#f5f5f5'],
        title: {
            text: '25%',
            verticalAlign: 'middle'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false
                },
                size: 90,
                borderWidth: 0,
                renderTo: 'container'
            }
        },
        series: [{
            type: 'pie',
            name: 'neutral',
            innerSize: '90%',
            data: [25,75],
            states: {
hover: {
enabled: false, 
lineWidth: 1,
},
inactive: {
        opacity: 1
      }
}
        }],
        tooltip: {
        enabled: false,
        animation: false,
    },  
        
    });
});

$(function () {
    $('#negativePercent').highcharts({
      exporting: {
    enabled: false
  },credits: {
     enabled: false
},
        colors: ['#e39898', '#f5f5f5'],
        title: {
            text: '25%',
            verticalAlign: 'middle'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false
                },
                size: 90,
                borderWidth: 0,
                renderTo: 'container'
            }
        },
        series: [{
            type: 'pie',
            name: 'negative',
            innerSize: '90%',
            data: [25,75],
            states: {
hover: {
enabled: false, 
lineWidth: 1,
},
inactive: {
        opacity: 1
      }
}
        }],
        tooltip: {
        enabled: false,
        animation: false,
    },  
        
    });
});

$(function () {
  var feelings = ["angry", "Angry", "Pissed", "Happy", "happy", "Glad", "Neutral", "Normal"];
  var color = ['#e39898', '#e39898', '#e39898', "#a5e398", "#a5e398", "#a5e398", "#c9c8c5", "#c9c8c5"];
  var counter = 0;
    data = Highcharts.reduce(feelings, function (arr, word) {
          var obj = Highcharts.find(arr, function (obj) {
              return obj.name === word.charAt(0).toUpperCase() + word.slice(1);
          });
          if (obj) {
              obj.weight += 1;
          } else {
              obj = {
                  name: word.charAt(0).toUpperCase() + word.slice(1),
                  weight: 1,
                  color: color[counter]
              };
              arr.push(obj);
          }
          counter += 1;
          return arr;
      }, []);
      var getRandomPosition = function getRandomPosition(size) {
        return Math.round((size * (Math.random() + 0.5)) / 2);
      };

      var randomPlacement = function randomPlacement(point, options) {
        var field = options.field,
          r = options.rotation;
        return {
          x: getRandomPosition(field.width) - (field.width / 2),
          y: getRandomPosition(field.height) - (field.height / 2),
          rotation: 0
        };
      }

    Highcharts.seriesTypes.wordcloud.prototype.placementStrategy.randomHorizontal = randomPlacement;
      Highcharts.chart('wordCloud', {
      series: [{
          type: 'wordcloud',
          data: data,
          placementStrategy: 'randomHorizontal',
          name: 'Occurrences'
      }],
      chart: {
    marginRight: 0,
    marginLeft: 0,
    marginBottom: 0
  },
      exporting: {
    enabled: false
  },credits: {
     enabled: false
  }, title:{
    text: ''
  }
})
})
