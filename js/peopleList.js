var peopleList_Names=["Acer",
                      "Adam",
                      "Barbara",
                      "Bryson",
                      "Bella",
                      "Bryan",
                      "Beck",
                      "Belen",
                      "Cody"];

var peopleList_Photos=["image/PeopleList/Acer.jpg",
                       "image/PeopleList/Adam.jpg",
                       "image/PeopleList/Barbara.png",
                       "image/PeopleList/Bryson.png",
                       "image/PeopleList/Bella.png",
                       "image/PeopleList/Bryan.png",
                       "image/PeopleList/Beck.jpg",
                       "image/PeopleList/Belen.jpg",
                       "image/PeopleList/Cody.jpg"];

var currentLetterCode = 'B'.charCodeAt(0);

function init(){
	updateLetterSelector();
	updatePeopleList("B");
	addScrollEvent();
}

function addScrollEvent() {
	
	var scrollEvent = function(){
		var scrollTop = document.getElementById("peopleList").scrollTop;
		if(scrollTop>10) {
			document.getElementById("PeopleList_Page_Title").style.visibility="hidden";
			document.getElementById("PeopleList_Page_CurrentTime").style.visibility="hidden";
		}else{
			document.getElementById("PeopleList_Page_Title").style.visibility="visible";
			document.getElementById("PeopleList_Page_CurrentTime").style.visibility="visible";
		}
	}
	document.getElementById("peopleList").addEventListener("scroll", scrollEvent);
}


var peopleList_Length=peopleList_Names.length;

function showPersonalDetails(index) {
	tau.changePage("#personalDetails");
	document.getElementById("PersonalDetails_Page_PersonalPhoto").src=peopleList_Photos[index];
}

function updatePeopleList(startLetter){
	var container = document.getElementById("peopleList");
	var top = "22vw";
	var left = "22vw";
	container.innerHTML = "";
	for(let i=0;i<peopleList_Length;i++){

		if(peopleList_Names[i].charAt(0)!=startLetter) continue;
		var person = document.createElement("img");
		var personName = document.createElement("p");
		person.src = peopleList_Photos[i];
		person.classList.add("peopleList_Person");
		person.style.top = top;
		person.style.left = left;
		person.addEventListener("click",function(){
			showPersonalDetails(i);
		});
		
		personName.classList.add("peopleList_PersonName");
		personName.innerHTML = peopleList_Names[i];
		personName.style.top = (parseInt(top)+21)+"vw";
		personName.style.left = (parseInt(left)+12.6)+"vw";
		personName.style.transform = "translateX(-50%)";
		container.appendChild(person);
		container.appendChild(personName);
		if(left==("22vw")){
			left="55vw";
		}else{
			left="22vw";
			top=(parseInt(top)+34)+"vw";
		}
	}
}

var PreviousLetterElement = document.getElementById("peopleListPage").querySelector("#PreviousLetter");
var CurrentLetterElement = document.getElementById("peopleListPage").querySelector("#CurrentLetter");
var NextLetterElement = document.getElementById("peopleListPage").querySelector("#NextLetter");

function updateLetterSelector() {
	if(currentLetterCode < 'A'.charCodeAt(0)) {
		currentLetterCode = 'A'.charCodeAt(0);
		return;
	}
	if(currentLetterCode > 'Z'.charCodeAt(0)) {
		currentLetterCode = 'Z'.charCodeAt(0);
		return;
	}
	var previousLetter = currentLetterCode-1 < ( 'A'.charCodeAt(0) ) ? 32/*White space*/ : currentLetterCode-1;
	var NextLetter = currentLetterCode+1 > ( 'Z'.charCodeAt(0) ) ? 32/*White space*/ : currentLetterCode+1;
	PreviousLetterElement.innerHTML=String.fromCharCode(previousLetter);
	CurrentLetterElement.innerHTML=String.fromCharCode(currentLetterCode);
	NextLetterElement.innerHTML=String.fromCharCode(NextLetter);
	updatePeopleList(String.fromCharCode(currentLetterCode));
}

window.onload=init();



