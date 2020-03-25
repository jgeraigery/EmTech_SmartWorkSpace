const timeTracking_CheckingInterval = 1000;   
/*
    Time in second between updating timer
    The lower the value, the lower the power efficiency. 
    Should be set to dynamic in future version to optimized the performance
*/

const timeTracking_SendingInterval = 1;       //Time in day between sending two updating request[Method sendUserTimeSpentInfo()] to server 

let locationID;

let timeSpentInfo;

//User Time spent info which will be store in the cosmos database via azure function
let timeSpentInfo_Default = {
    "userID" : "",     //Using device's MAC address as ID
    "date" : "",       //The date when the time tracking info was recorded
    "userName" : "Richard",                 //Name of user
    "timeSpentInfo" : {
        "indicator" : [/*1, 0, 2, 1*/],                                 //Indicator corresponds to the index of positionID, single character makes it much smaller
        "time" : [/*100, 50, 20, 120*/]                                 //Time spent in each position in order, corresponding to the indicator
    }
};

//URL of Rest API
// const url = 'http://localhost:7071/api/TimeTrackingAPI'; 
 const url = 'https://workspaceguruapi.azurewebsites.net/api/TimeTrackingAPI'; 

//The locationID set corresponds to the locationIndicator， must be synchronized with in API
const locationIDSet = [ "Meeting room",
                        "Lab",
                        "Dinning room" ];

let timeSpentTimer = 0;   //Time spent in seconds, will be reset when change position

let macAddress;

let requestSendingLock = 0;

//Function that map locationID to location indicator, locationIDSet must be up-to-date.
function mapLocationID(id){ 
    try{
        return locationIDSet.indexOf(id);
    }catch(err){
        console.log("Not a valid position(Out of workspace or locationIDSet not updated)");
    }
}
    
//Function which attach latest TimeSpent info in POST to the server side.
function sendUserTimeSpentInfo(MAC){

    requestSendingLock = 1;

    timeSpentInfo = JSON.parse(localStorage.getItem("timeSpentInfo"));

    if(MAC == null) {
        MAC = "Unknown";
    }

    //Set MAC address as use ID
    timeSpentInfo.userID = "31884d7164e4";

    let oldDate = localStorage.getItem("oldDate");
    timeSpentInfo.date = oldDate;

    const userAction = async () => {

        const controller = new AbortController();

        //Set time out for the fetch function, to avoid a death waiting
        setTimeout(() => controller.abort(), 10000);

        // The parameters we are gonna pass to the fetch function
        let fetchData = { 
            method: 'POST', 
            body: JSON.stringify(timeSpentInfo),
            signal: controller.signal
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
    userAction().then(myJson => processReturnedData(myJson))
                .catch(e => {
                    //If fetch timeout, release the lock
                    requestSendingLock = 0;
                });
}

function processReturnedData(myJson){

//     document.body.innerText=JSON.stringify(myJson);
     if(myJson!="Failed to update") {
        //update the date to current
    	 alert();
        localStorage.setItem("oldDate", getCurrentDate());
        //Restore the user time spent info that have been sent to the server
        localStorage.setItem("timeSpentInfo", JSON.stringify(timeSpentInfo_Default));
        timeSpentInfo = timeSpentInfo_Default;
        console.log(timeSpentInfo);
     }
     requestSendingLock = 0;
 }

 //This function should be triggered when detected a change in current location
function leftGeoFence(areaThatWasLeft_ID) {
	//Hide current location on main screen
	$("#TimeTrack_Position")[0].style.visibility = "hidden";
	
    timeTrackingEnabled = false;
    
    clearCurrentStayingTime();

    let locationIndicator = mapLocationID(areaThatWasLeft_ID);      //Convert ID to indicator

    timeSpentInfo.timeSpentInfo.indicator.push(locationIndicator);
    timeSpentInfo.timeSpentInfo.time.push(timeSpentTimer);

    //Store the updated time spent info in local storage
    localStorage.setItem("timeSpentInfo", JSON.stringify(timeSpentInfo));

    timeSpentTimer=0;       //Reset timer
}

function enteredGeoFence(areaThatWasEntered) {
	//Display current location on main screen
	$("#TimeTrack_Position")[0].style.visibility = "visible";
	timeTrackingEnabled = true;
	document.getElementById('TimeTrack_Position_Text').innerHTML = areaThatWasEntered;
	document.getElementById('nevigation_Destination_Name').innerHTML = areaThatWasEntered;
}

 //Updating timer with the defined interval
 setInterval(function(){
	timeTrackin_CheckDataFromStorage();
	if(!timeTrackingEnabled) return;
    timeSpentTimer += timeTracking_CheckingInterval;
 }, timeTracking_CheckingInterval);

//Simulation of position change, should be replaced in the future
 function positionChangeSimulation() {
     leftGeoFence(locationID);
     locationID = Object.keys(locationIDSet)[Math.floor((Math.random()*2))];
     setTimeout(positionChangeSimulation, Math.floor((Math.random()*50000 + 5000)));
 }
 
//Get current date in this format: yyyymmdd
function getCurrentDate() {
    let d = new Date();
    let month = d.getMonth()+1<10 ? "0" + (d.getMonth()+1).toString() : (d.getMonth()+1).toString();
    let date = d.getDate()+1<10 ? "0" + (d.getDate()).toString() : (d.getDate()).toString();
    return d.getFullYear().toString() + month + date;
}

//Get oldDate from storage, 
function timeTrackin_CheckDataFromStorage () {
    let storedDate = localStorage.getItem("oldDate");
    let currentDate = getCurrentDate();
    switch(storedDate) {
        //No date stored
        case null:
            localStorage.setItem("oldDate", currentDate);
            break;
        default:
            //If change date, send user time spent info from yesterday 
            if(storedDate != currentDate) {
                if(requestSendingLock == 1) return;
                //Get MAC address before sending the time info
                // tizen.systeminfo.getPropertyValue("WIFI_NETWORK", function(wifi){sendUserTimeSpentInfo(wifi.macAddress);});
                sendUserTimeSpentInfo(simulateMAC());
            }   
            break;
    }
}

//Uses for generating a random simulated MAC address 
function simulateMAC() { 
    let randGenMAC = "";
    for(let i=0; i<12; i++) {
        let randNum = Math.floor(Math.random()*15); 
        randGenMAC = randGenMAC.concat(randNum.toString(16));
    }
    return randGenMAC;
}

function timeTrackingIni() {
    function iniLocalTimeSpentInfo() {
        timeSpentInfo = timeSpentInfo_Default;
        localStorage.setItem("timeSpentInfo", JSON.stringify(timeSpentInfo));
    }
    //If no local timeSpentInfo found, create a default one
    if(localStorage.getItem("timeSpentInfo")==null) {
        iniLocalTimeSpentInfo();
    }else {
        try {
            timeSpentInfo = JSON.parse(localStorage.getItem("timeSpentInfo"));
        } catch(e) {
            console.log("Cannot parse the timeSpentInfo data read from local storage");
            iniLocalTimeSpentInfo();
        }
    }
    timeTrackin_CheckDataFromStorage();
    
    setTimeout(positionChangeSimulation, Math.floor((Math.random()*50000 + 5000)));
}

timeTrackingIni();