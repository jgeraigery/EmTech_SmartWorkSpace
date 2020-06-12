var elementsNeeded=0;
var elementsLoaded=0;


function loaded(){
	if(elementsNeeded==0) {
		elementsNeeded = document.getElementsByClassName("components-main")[0].getElementsByTagName("img").length;
	}
	elementsLoaded++;
	if(elementsLoaded==elementsNeeded){
		hideLoadingIcon()
	}
}

var peopleListLoaded=0;

function loaded_PeopleList(length) {
	peopleListLoaded++;
	if(peopleListLoaded==length) {
		hideLoadingIcon()
	}
}

function hideLoadingIcon() {
	var loadingContainer = document.getElementById("loadingContainer");
	var loadingIcon = document.getElementsByClassName("loading")[0];
	loadingContainer.style.visibility = "hidden";
	loadingIcon.style.visibility = "hidden";
}
