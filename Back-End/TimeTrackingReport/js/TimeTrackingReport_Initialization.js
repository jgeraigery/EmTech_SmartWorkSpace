let locationNameSet = ["Meeting room", "Lab", "Dinning room"];
(function (){   
    const url = 'https://workspaceguruapi.azurewebsites.net/api/TimeTrackingAPI'; 
    // const url = 'http://127.0.0.1:7071/api/TimeTrackingAPI'; 

    function initialization() {
        const urlParams = new URLSearchParams(window.location.search);
        const userID = urlParams.get("userID");

        requestUserTimeSpentList(userID);
    }

    function requestUserTimeSpentList(userID) {
        const userAction = async () => {

            const controller = new AbortController();
    
            //Set time out for the fetch function, to avoid a death waiting
            setTimeout(() => controller.abort(), 5000);
    
            const response = await fetch(url+"?userID="+userID);
     
            switch(response.status) {
                //200 means the REST API successfully carried out whatever action the client requested
                case 200:
                    const myJson = await response.json(); //extract JSON from the http response
                    return myJson;
                default:
                    return "Failed to update";
              }
       
        };
        userAction().then(myJson => synchronizeLocationNameSet(myJson) )
                    .catch(e => {
                        //If fetch timeout, release the lock
                        console.log(e);
                        document.body.innerHTML = "Failed to fetch user info, please refresh the page";
                        return "Failed to update";
                    });
    }

    function synchronizeLocationNameSet(myJson) {
        const userAction = async () => {
	
            // The parameters we are gonna pass to the fetch function
            let fetchData = { 
               method: 'POST', 
               body: "f"	//Means fetch data
           };
            
            const response = await fetch(url,fetchData);
    
           switch(response.status) {
               //200 means the REST API successfully carried out whatever action the client requested
               case 200:
                   const myJson = await response.json(); //extract JSON from the http response
                   return myJson;
               default:
                   return "Failed to update";
             }
      
       };
       userAction().then(updatedGeoJSONFeature => {
            locationNameSet = [];
            updatedGeoJSONFeature.features.forEach(a => locationNameSet.push(a.name));
            let temp = myJson;
            drawChart(temp)
       }).catch(e => {
            //If fetch timeout, release the lock
            console.log("Fail to update geoJSONFeature");
            setTimeout(synchronizeLocationNameSet, 100000);
       });
    }

    function drawChart(myJson) {

        console.log("Hi");

        for(let i in myJson) {
            //Draw the graph for every single day in reverse order[From latest to oldest]
            onedayRecord = myJson[myJson.length - 1 - i ];

            var chartData = {
                type: 'horizontalBar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Time Spent / min',
                        data: [],
                        backgroundColor: [],
                        borderColor: [],
                        borderWidth: 1,
                        hoverBackgroundColor: []
                    }]
                },
                options: {
                    legend: {
                        labels:{
                            fontColor: 'white',
                        }
                    },
                    scales: {
                        xAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }, title: {
                        display: true,
                        text: ""
                    }
                }
            };
            
            //Chart data of the overall time spent in places
            var chartData_OverAll = {
                type: 'doughnut',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Time Spent / min',
                        data: [],
                        backgroundColor: [],
                        borderColor: [],
                        hoverBackgroundColor: []
                    }]
                },
                options: {
                    responsive: true,
                    legend: {
                        labels:{
                            fontColor: 'white',
                        },
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: ''
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    }
                }
            };

            var timeSpentInfo = onedayRecord.timeSpentInfo;

            for(let j in timeSpentInfo.indicator) {
                //Map location indicators to human-readable names
                locationName = locationNameSet[timeSpentInfo.indicator[j]];

                //Get time spent in minutes and set number of decimal
                timeSpent = (timeSpentInfo.time[j]/1000/60).toFixed(2);
                //If location already exist, add value to this location
                if(chartData_OverAll.data.labels.includes(locationName)) {
                    index = chartData_OverAll.data.labels.indexOf(locationName);
                    chartData_OverAll.data.datasets[0].data[index] = (parseFloat(chartData_OverAll.data.datasets[0].data[index]) + parseFloat(timeSpent)).toFixed(2);
                }else {
                    chartData_OverAll.data.labels.push(locationName);
                    chartData_OverAll.data.datasets[0].data.push(timeSpent);
                }

                chartData.data.datasets[0].data.push(timeSpent);
                
                //Set the bar with the same location the same color
                if(chartData.data.labels.includes(locationName)) {
                    let i = chartData.data.labels.indexOf(locationName);
                    chartData.data.datasets[0].backgroundColor.push(chartData.data.datasets[0].backgroundColor[i]);
                    chartData.data.datasets[0].borderColor.push(chartData.data.datasets[0].borderColor[i]);
                    chartData.data.datasets[0].hoverBackgroundColor.push(chartData.data.datasets[0].hoverBackgroundColor[i]);
                }else {
                    //Set color for individual chart
                    var colors = generateRandomColor();
                    chartData.data.datasets[0].backgroundColor.push(colors[0]);
                    chartData.data.datasets[0].borderColor.push(colors[1]);
                    chartData.data.datasets[0].hoverBackgroundColor.push(colors[1]);

                    chartData_OverAll.data.datasets[0].backgroundColor.push(colors[0]);
                    chartData_OverAll.data.datasets[0].borderColor.push(colors[1]);
                    chartData_OverAll.data.datasets[0].hoverBackgroundColor.push(colors[1]);
                }
                chartData.data.labels.push(locationName);
                //Attach date of single record to title
                date = translateRawDate(onedayRecord.date);
                chartData.options.title.text=date;
                chartData_OverAll.options.title.text=date;
            }


            var ctx_timeFlow = document.createElement('canvas');
            var ctx_timeOverAll = document.createElement('canvas');
            document.getElementById("chart-container").appendChild(ctx_timeFlow);
            document.getElementById("chart-container_OverAll").appendChild(ctx_timeOverAll);
            var myChart_timeFlow = new Chart(ctx_timeFlow, chartData);
            var myChart_timeOverAll = new Chart(ctx_timeOverAll, chartData_OverAll);
        }
    }

    function translateRawDate(rawDate) {
        var year = rawDate.substring(0,4);
        var month = rawDate.substring(4,6);
        var day = rawDate.substring(6,8);
        return day + "/" + month + "/" + year;
    }

    function generateRandomColor() {
        var r = Math.floor(Math.random()*255);
        var g = Math.floor(Math.random()*255);
        var b = Math.floor(Math.random()*255);
        return ["rgba(" + r + "," + g + "," + b + "," + 0.1 + ")", "rgba(" + r + "," + g + "," + b + "," + 1 + ")"];
    }

    window.onload=initialization();
}());
