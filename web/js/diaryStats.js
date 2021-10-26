firebase.initializeApp(firebaseConfig);
const usersRef = firebase.firestore().collection("Users")
const diaryRefs = firebase.firestore().collection("Diary")


async function getDiary(){
    var diaryData;
    var test = await diaryRefs.where("userID", "==", "wioE4JOjwid6r2Y3JLv2YL0Z6FJ2").get()
    .then((querySnapshot) => {
        diaryData = querySnapshot.docs.map((doc) => ({
            id: doc.id,             // will the id better if is using user's uid or auto generated id?
            anxiety: doc.data().anxiety,
            date: doc.data().date,
            feeling: doc.data().feeling,
            hoursSlept: doc.data().hoursSlept,
            mood: doc.data().mood,
            stress: doc.data().stress,
            thoughts: doc.data().thoughts,
            userID: doc.data().userID
        }));
    })
    return diaryData
}


$(function () {
    getDiary().then(result => {
        console.log(result) //db results
            $('#positivePercent').highcharts({
            exporting: {
            enabled: false
        },credits: {
            enabled: false
        },
        colors: ['#42a371', '#f5f5f5'],
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
})
});

$(function () {
    $('#neutralPercent').highcharts({
      exporting: {
    enabled: false
  },credits: {
     enabled: false
},
        colors: ['#afb1ae', '#f5f5f5'],
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
        colors: ['#f7533b', '#f5f5f5'],
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
  var feelings = ["angry", "Angry", "Pissed", "doubtful", "Happy", "happy", "Neutral", "Normal", "Normal", "indifferent", "Excited", "grateful"];
  var color = ['#f7533b', '#f7533b', '#f7533b', '#f7533b', "#42a371", "#42a371", "#afb1ae", "#afb1ae", "#afb1ae", "#afb1ae", "#42a371", "#42a371"];
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

$(function(){
  Highcharts.seriesType(
    'pictorial',
    'column',
    {
        borderWidth: 0
    },
    {
        pointAttribs: function (point, selected) {
            const pointAttribs = Highcharts.seriesTypes.column.prototype
                .pointAttribs.call(this, point, selected);

            pointAttribs.fill = {
                pattern: {
                    path: {
                        d: point.series.options.paths[
                            point.index % point.series.options.paths.length
                        ],
                        fill: pointAttribs.fill,
                        strokeWidth: 0,
                        stroke: pointAttribs.stroke
                    },
                    x: point.shapeArgs.x,
                    y: 0,
                    width: point.shapeArgs.width,
                    height: point.series.yAxis.len,
                    patternContentUnits: 'objectBoundingBox',
                    backgroundColor: 'none'
                }
            };

            delete pointAttribs.stroke;
            delete pointAttribs.strokeWidth;

            return pointAttribs;
        }
    }
);

Highcharts.addEvent(Highcharts.Series, 'afterRender', function () {
  if (this instanceof Highcharts.seriesTypes.pictorial) {
      this.points.forEach(point => {
          const fill = point.graphic && point.graphic.attr('fill');
          const match = fill && fill.match(/url\(([^)]+)\)/);
          if (match) {
              const patternPath = document.querySelector(`${match[1]} path`);
              if (patternPath) {
                  const bBox = patternPath.getBBox();
                  const scaleX = 1 / bBox.width;
                  const scaleY = this.yAxis.len /
                      point.shapeArgs.height /
                      bBox.height;

                  patternPath.setAttribute(
                      'transform',
                      `scale(${scaleX} ${scaleY}) ` +
                      `translate(${-bBox.x}, ${-bBox.y})`
                  );
              }
          }

      });
  }
});

Highcharts.chart('stressTracker', {
  chart: {
      type: 'pictorial',
  },
  exporting: {
    enabled: false
  },credits: {
     enabled: false
  },
  title: {
      text: ''
  },
  xAxis: {
      categories: [''],
      lineWidth: 0
  },
  yAxis: {
      visible: false
  },
  plotOptions: {
      pictorial: {
          stacking: 'percent',

          /*
          Icon paths from font-awesome, https://fontawesome.com/license,
          translated using http://jsfiddle.net/highcharts/a0jrvxch/
          */
          paths: [
              'M96 0c35.346 0 64 28.654 64 64s-28.654 64-64 64-64-28.654-64-64S60.654 0 96 0m48 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H48c-26.51 0-48 21.49-48 48v136c0 13.255 10.745 24 24 24h16v136c0 13.255 10.745 24 24 24h64c13.255 0 24-10.745 24-24V352h16c13.255 0 24-10.745 24-24V192c0-26.51-21.49-48-48-48z',
              'M128 0c35.346 0 64 28.654 64 64s-28.654 64-64 64c-35.346 0-64-28.654-64-64S92.654 0 128 0m119.283 354.179l-48-192A24 24 0 0 0 176 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H80a24 24 0 0 0-23.283 18.179l-48 192C4.935 369.305 16.383 384 32 384h56v104c0 13.255 10.745 24 24 24h32c13.255 0 24-10.745 24-24V384h56c15.591 0 27.071-14.671 23.283-29.821z'
          ],
          pointPadding: 0
      },
    
allowPointSelect: false,
  },
  legend: {
      align: 'center',
      verticalAlign: 'middle',
      layout: 'vertical'
  }, 
  series: [{
      data: [10],
      name: "Very Stress",
      color:"darkblue"
  }, {
      data: [20],
      name: 'Stress',
      color:"#4f88d1"
  }, {
      data: [30],
      name: 'A little Stress',
      color:"#6ec8ff"
  }, {
    data: [30],
    name: 'Feeling Good',
    color:"#a6ddff"
}, {
  data: [30],
  name: 'Relaxed',
  color:"#bae8ff"
 
}],
  
  responsive: {
      rules: [{
          condition: {
          },
          chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'top',
              },
              chart:{
              }
          }
      }]

  },
  tooltip: {
    formatter: function() {
      var tooltip = '<br><span style="color:' + this.series.color + '">' + this.series.name + '</span>: ' + this.series.data[0].y + ' out of 300 days (50%)';
      return tooltip;
    } 
  }
});

Highcharts.chart('anxietyTracker', {
  chart: {
      type: 'pictorial',
  },
  exporting: {
    enabled: false
  },credits: {
     enabled: false
  },
  title: {
      text: ''
  },
  xAxis: {
      categories: [''],
      lineWidth: 0
  },
  yAxis: {
      visible: false
  },
  plotOptions: {
      pictorial: {
          stacking: 'percent',

          /*
          Icon paths from font-awesome, https://fontawesome.com/license,
          translated using http://jsfiddle.net/highcharts/a0jrvxch/
          */
          paths: [
              'M96 0c35.346 0 64 28.654 64 64s-28.654 64-64 64-64-28.654-64-64S60.654 0 96 0m48 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H48c-26.51 0-48 21.49-48 48v136c0 13.255 10.745 24 24 24h16v136c0 13.255 10.745 24 24 24h64c13.255 0 24-10.745 24-24V352h16c13.255 0 24-10.745 24-24V192c0-26.51-21.49-48-48-48z',
              'M128 0c35.346 0 64 28.654 64 64s-28.654 64-64 64c-35.346 0-64-28.654-64-64S92.654 0 128 0m119.283 354.179l-48-192A24 24 0 0 0 176 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H80a24 24 0 0 0-23.283 18.179l-48 192C4.935 369.305 16.383 384 32 384h56v104c0 13.255 10.745 24 24 24h32c13.255 0 24-10.745 24-24V384h56c15.591 0 27.071-14.671 23.283-29.821z'
          ],
          pointPadding: 0
      },
    
allowPointSelect: false,
  },
  legend: {
      align: 'center',
      verticalAlign: 'middle',
      layout: 'vertical'
  }, 
  series: [{
      data: [10],
      name: "Furious",
      color:"darkred"
  }, {
      data: [20],
      name: 'Angry',
      color:"#da413d"
  }, {
      data: [30],
      name: 'Cross',
      color:"#ff8575"
  }, {
    data: [30],
    name: 'Neutral',
    color:"#ffbab0"
}, {
  data: [30],
  name: 'Calm',
  color:"#f7d2cd"
 
}],
 
  responsive: {
      rules: [{
          condition: {
          },
          chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'top',
              },
              chart:{
              }
          }
      }]

  },
  tooltip: {
    formatter: function() {
      var tooltip = '<br><span style="color:' + this.series.color + '">' + this.series.name + '</span>: ' + this.series.data[0].y + ' out of 300 days (50%)';
      return tooltip;
    } 
  }
});


})