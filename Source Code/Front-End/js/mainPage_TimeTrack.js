	var timeTrackingEnabled = false;

	var timeTracking_TimeLeft_Hour=0;
	var timeTracking_TimeLeft_Minute=0;
	var timeTracking_TimeLeft_Second=0;
	
	function updateCurrentStayingTime(){
		var prefix_Second="";
		var prefix_Minute="";
		var prefix_Hour="";
		
		if(timeTracking_TimeLeft_Second<10){
			prefix_Second="0";
		}if(timeTracking_TimeLeft_Minute<10){
			prefix_Minute="0";
		}if(timeTracking_TimeLeft_Hour<10){
			prefix_Hour="0";
		}
		document.getElementById("TimeTrack_TimeLeft_Text").innerHTML = prefix_Hour + timeTracking_TimeLeft_Hour+":"+ prefix_Minute + timeTracking_TimeLeft_Minute+":"+ prefix_Second +timeTracking_TimeLeft_Second;
		timeTracking_TimeLeft_Second++;
		
		if(timeTracking_TimeLeft_Second==60){
			timeTracking_TimeLeft_Minute++;
			timeTracking_TimeLeft_Second=0
		}
		if(timeTracking_TimeLeft_Minute==60){
			timeTracking_TimeLeft_Hour++;
			timeTracking_TimeLeft_Minute=0;
		}
	}
	
	//Clear the staying time when left
	function clearCurrentStayingTime() {
		timeTracking_TimeLeft_Second = 0;	timeTracking_TimeLeft_Minute = 0;	timeTracking_TimeLeft_Hour = 0;
	}
	
	function updateDigitalTime() {
		var prefix_Second="";
		var prefix_Minute="";
		var prefix_Hour="";
		
		var datetime = tizen.time.getCurrentDateTime(),
        hour = datetime.getHours(),
        minute = datetime.getMinutes(),
        second = datetime.getSeconds();
		
		if(second<10){
			prefix_Second="0";
		}if(minute<10){
			prefix_Minute="0";
		}if(hour<10){
			prefix_Hour="0";
		}
		
		document.getElementById("TimeTrack_TimeLeft_Text").innerHTML = prefix_Hour + hour+":"+ prefix_Minute + minute+":"+ prefix_Second + second;
	}
	
	function init(){
		// Update the watch hands every second
        setInterval(function() {
        	if (timeTrackingEnabled) {
        		updateCurrentStayingTime();
        	} else {
        		updateDigitalTime()
        	}
        }, 1000);
       
	}

  init();
