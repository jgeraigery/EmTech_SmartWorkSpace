setInterval(checkStayTime,1000);

let notification = 0;

let timeSpentTimer_Old = 0;

//Time for an pop up window to pop up in ms 
let timeSpentNotification_NotifyTime = 10000; //Ten seconds

var timeSpentPopUpElement = document.getElementById("timeSpentPopUp");
	timeSpentPopUp = tau.widget.Popup(timeSpentPopUp);

$("#timeSpentPopUp_Close")[0].addEventListener("click", function() {
	timeSpentPopUp.close();
});

	
//function to check if a user spent too much time in a certain place
function checkStayTime() {
	//Time spent timer has been reset due to change in position
	if(timeSpentTimer<timeSpentTimer_Old) {
		timeSpentTimer_Old = 0;
	}
	
    if(timeSpentTimer - timeSpentTimer_Old > timeSpentNotification_NotifyTime){
    	timeSpentTimer_Old = timeSpentTimer;
        sendNotification();
    }
}

//function to send a notification to users
function sendNotification(){
	timeSpentPopUp.close();
	$("#timeSpentPopUp_Contents")[0].innerHTML = "You have Spent " + Math.floor(timeSpentTimer/1000/60) + " minutes in place"
	timeSpentPopUp.open();
}
