firebase.initializeApp(firebaseConfig);
const usersRef = firebase.firestore().collection("Users")
const diaryRefs = firebase.firestore().collection("Diary")
const uid = sessionStorage.getItem('uid');

async function getDiary(){
    var diaryData;
    var test = await diaryRefs.where("userID", "==", uid).get()
    .then((querySnapshot) => {
        diaryData = querySnapshot.docs.map((doc) => ({
            id: doc.id,      
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
    if(uid == null){
        window.location.href = "index.html"; 
    }
    getDiary().then(result => {
        console.log(result) //db results
        if(result.length == 0){
            $('.showStats').css("display", "none")
            $('#diaryTitle').text('View My Diary')
        }
        else{
            if(result.length == 1){
                $('#diaryTitle').text('View My Diary (' + result.length + ' Entry)' )
            }
            else{
                $('#diaryTitle').text('View My Diary (' + result.length + ' Entries)' )
            }
        posResult = []; 
        negResult = [];
        NeuResult = [];
        moodArray = [];
        sleepArray = new Array(24).fill(0);
        for(r of result){
            moodArray.push(r.mood)
            if (r.feeling == "Positive"){
                posResult.push(r)
            }
            else if(r.feeling == "Negative"){
                negResult.push(r)
            }
            else if(r.feeling == "Neutral"){
                NeuResult.push(r)
            }
            var dateString = r.date; 
            var year  = dateString.substring(0,4);
            var month  = dateString.substring(5,7);
            var day   = dateString.substring(8,10);
            var dateObj   = new Date(year, month-1, day);
            var today = dateObj.getDate();
            new_event_json(r.hoursSlept, r.stress, r.anxiety, r.feeling, r.mood, r.thoughts, dateObj, today, r.id);
            hoursSlept = r.hoursSlept
            sleepArray[hoursSlept] = sleepArray[hoursSlept]+1
        }
        createCalendar();
        var veryStress = result.reduce(function (n, r){
            return n + (r.stress == "Very Stress");
        }, 0);
        var relaxed = result.reduce(function (n, r){
            return n + (r.stress == "Relaxed");
        }, 0); 
        var feelingGood = result.reduce(function (n, r){
            return n + (r.stress == "Feeling Good");
        }, 0); 
        var littleStress = result.reduce(function (n, r){
            return n + (r.stress == "A Little Stress");
        }, 0); 
        var stress = result.reduce(function (n, r){
            return n + (r.stress == "Stress");
        }, 0); 
        var calm = result.reduce(function (n, r){
            return n + (r.anxiety == "Calm");
        }, 0); 
        var neutral = result.reduce(function (n, r){
            return n + (r.anxiety == "Neutral");
        }, 0); 
        var cross = result.reduce(function (n, r){
            return n + (r.anxiety == "Cross");
        }, 0); 
        var angry = result.reduce(function (n, r){
            return n + (r.anxiety == "Angry");
        }, 0); 
        var furious = result.reduce(function (n, r){
            return n + (r.anxiety == "Furious");
        }, 0); 
        stressSeries = [
            {
                data: [veryStress],
                name: "Very Stress",
                color: "darkblue",
            },{
                data: [stress],
                name: 'Stress',
                color:"#4f88d1",
            }, {
                data: [littleStress],
                name: 'A little Stress',
                color:"#6ec8ff",
            }, {
              data: [feelingGood],
              name: 'Feeling Good',
              color:"#a6ddff",
          }, {
            data: [relaxed],
            name: 'Relaxed',
            color:"#bae8ff",
          }
        ]
        anxietySeries = [
            {
                data: [furious],
                name: "Furious",
                color: "darkred",
            },{
                data: [angry],
                name: 'Angry',
                color:"#da413d",
            }, {
                data: [cross],
                name: 'Cross',
                color:"#ff8575",
            }, {
              data: [neutral],
              name: 'Neutral',
              color:"#ffbab0",
          }, {
            data: [calm],
            name: 'Calm',
            color:"#f7d2cd",
          }
        ]
        positiveChart(posResult, result.length)
        negativeChart(negResult, result.length)
        neutralChart(NeuResult, result.length)
        callMonkeyLearn(moodArray)
        createTracker(stressSeries, anxietySeries, result.length) 
        sleepTracker(sleepArray, result.length)
    }
})
});

function positiveChart(results, totalDays){
    resultDays = results.length
    percent = (resultDays/totalDays) * 100
    postivePercent = Math.round(percent * 100) / 100
    restPercent = Math.round((100-postivePercent) * 100) / 100
    restPercent = restPercent.toFixed(1)
    document.getElementById("positiveDays").innerHTML = " in " + resultDays + " out of " + totalDays + " days..."
    $('#positivePercent').highcharts({
        exporting: {
        enabled: false
    },credits: {
        enabled: false
    },
    colors: ['#42a371', '#f5f5f5'],
    title: {
        text: String(postivePercent) + "%",
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
            data: JSON.parse("[" + postivePercent + "," + restPercent +"]"),
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
}

function negativeChart(results, totalDays){
    resultDays = results.length
    percent = (resultDays/totalDays) * 100
    negativePercent = Math.round(percent * 100) / 100
    restPercent = Math.round((100-negativePercent) * 100) / 100
    restPercent = restPercent.toFixed(1)
    document.getElementById("negativeDays").innerHTML = " in " + resultDays + " out of " + totalDays + " days..."
    $('#negativePercent').highcharts({
        exporting: {
      enabled: false
    },credits: {
       enabled: false
  },
          colors: ['#f7533b', '#f5f5f5'],
          title: {
              text: String(negativePercent) + "%",
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
              data: JSON.parse("[" + negativePercent + "," + restPercent +"]"),
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
}

function neutralChart(results, totalDays){
    resultDays = results.length
    percent = (resultDays/totalDays) * 100
    neutralPercent = Math.round(percent * 100) / 100
    restPercent = Math.round((100-neutralPercent) * 100) / 100
    restPercent = restPercent.toFixed(1)
    document.getElementById("neutralDays").innerHTML = " in " + resultDays + " out of " + totalDays + " days..."
    $('#neutralPercent').highcharts({
        exporting: {
      enabled: false
    },credits: {
       enabled: false
  },
          colors: ['#afb1ae', '#f5f5f5'],
          title: {
              text: String(neutralPercent) + "%",
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
              data: JSON.parse("[" + neutralPercent + "," + restPercent +"]"),
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
}

function callMonkeyLearn(moodArray){
    jsonObj = {
        "data": moodArray
    }
    var feelings = []
    var color = []
    //call monkeylearn api
    const token = '1dbd9fff3ba179eaa79bfef0a3412e9b3249cef3' 

    //if prev token expired
    // const token = 'ea201a414091a2ec6685d3224f9c7e217e7ba487'
    axios({
        method:'post',
        url: "https://api.monkeylearn.com/v3/classifiers/cl_pi3C7JiL/classify/",
        data: jsonObj,
        headers:{
            'Authorization': `token ${token}`
        }
    }).then((response) =>{
        for(resultArray of response.data){
            feelings.push(resultArray.text)
            if(String(resultArray.classifications[0].tag_name) == "Neutral"){
                color.push('#afb1ae')
            }
            else if(String(resultArray.classifications[0].tag_name) == "Positive"){
                color.push('#42a371')
            }
            else if(String(resultArray.classifications[0].tag_name) == "Negative"){
                color.push('#f7533b')
            }
        }
        wordCloud(feelings, color)
    }).catch(error =>{
        console.log(error.message)
    })
}

function wordCloud(feelings, color){
    data = []
    const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
    for (var i = 0; i < feelings.length; i++){
        if (data.filter(e => e.name ==  feelings[i]).length == 0) {
            count = countOccurrences(feelings, feelings[i])
            obj = {
                name: feelings[i],
                weight: count,
                color: color[i]
            }
            data.push(obj)
        }    
    }
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
}

function createTracker(stressSeries, anxietySeries, totalDays){
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
      series: stressSeries,
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
          percent = Math.round(this.series.data[0].y/totalDays * 100)
          var tooltip = '<br><span style="color:' + this.series.color + '">' + this.series.name + '</span>: ' + this.series.data[0].y + ' out of ' + totalDays + ' days (' + percent + '%)';
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
      series: anxietySeries,
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
          percent = Math.round(this.series.data[0].y/totalDays * 100)
          var tooltip = '<br><span style="color:' + this.series.color + '">' + this.series.name + '</span>: ' + this.series.data[0].y + ' out of ' + totalDays + ' days (' + percent + '%)';
          return tooltip;
        } 
      }
    });
}

function sleepTracker(sleepArray, totalDays){
    Highcharts.chart('sleepTracker', {
        credits: {
            enabled: false
          },
          title:{
              text: null
          },
        exporting: {
            enabled: false
        },
        chart:{
            type: 'column'
        },
        yAxis: {
            title: {
                text: 'Number of Days'
            },
            tickInterval: 1,
            min: 0
        },
        xAxis: {
           min: 0,
           max: 24,
           tickInterval: 1,
           title: {
            text: 'Hours Slept'
            }
        },
    
        legend: {
            enabled: false
        },
    
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 0,
            }
        },
    
        series: [{
            name: '',
            data: sleepArray
        }],
        tooltip: {
            formatter: function() {
                return 'Slept for <strong>' + this.x + '</strong> hours in <strong>' + this.y + '</strong> day(s) out of ' + totalDays + ' days';
            }
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    
    });
}