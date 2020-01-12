	function rotateCW() {
		if(document.getElementById("peopleListPage").classList.contains("ui-page-active")) {
			currentLetterCode++;
			updateLetterSelector();
		}
	}
	
	function rotateCCW() {
		if(document.getElementById("peopleListPage").classList.contains("ui-page-active")) {
			currentLetterCode--;
			updateLetterSelector();
		}
	}
	
	(function() {
	    function bindEvents() {
	        document.addEventListener('rotarydetent', function(ev) {
	            var direction = ev.detail.direction;
	            if(direction==='CCW') {
	            	rotateCCW();
	            }else {
	            	rotateCW();
	            }
	           
	        });
	    }

	    /**
	     * Initiates the application.
	     * @private
	     */
	    function initt() {
	        bindEvents();
	    }

	    window.onload = initt();

	}());
