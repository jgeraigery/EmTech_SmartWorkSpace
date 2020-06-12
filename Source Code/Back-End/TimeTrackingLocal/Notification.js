let timeSpentTimer = 0;   //Time spent in seconds, will be reset when change position

setInterval(checkStayTime,5000);

let notification = 0;

//function to check if a user spent too much time in a certain place
function checkStayTime() {
    if(timeSpentTimer > 5000 && notification == 0){
        sendNotification();
        notification = 1;
    }
}

//function to send a notification to users
function sendNotification(){
    document.getElementById("popup").style.display = "block";
    setTimeout(function(){
        document.getElementById("popup").style.display = "none";    //Hide the popUp window
    }, 10000);
}

setInterval(function() {
    if(notification == 1){
        notification = 0;
    }
}, 1200000);

setInterval(function(){
    timeSpentTimer += 1000;
 }, 1000);
 