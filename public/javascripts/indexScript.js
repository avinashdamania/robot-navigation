//Used by user when in proximity to robot so that robot can guide user to
//select location.

const IP_V4 = "http://10.147.121.127:3000";
const SPECIAL_DOORS = ["d3_414", "d3_710", "d3_816"];
const TAGS = ['food', 'networking', 'club', 'seminar'];
let doorCode = "";

window.onload = function() {
  // let buttonContainer = document.getElementById("buttonContainer");
  let buttons = document.getElementsByClassName("eventButton");
  let tags = document.getElementsByClassName('invisible');
  let iconHolders = document.getElementsByClassName('iconHolder');

  //adds event listeners and icons to each of the buttons
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", sendEventRoom);
  }

  for (let i = 0; i < tags.length; i++) {
    let tagList = tags[i].innerHTML;
    console.log(tagList);
    let space = tagList.indexOf(' ');
    while (space != -1) {
      let currentTag = tagList.substring(0, space);
      //depending on current tag, add an icon.
      let icon = document.createElement('img');
      icon.height = 50;
      icon.width = 50;

      if (currentTag == "food") {
        icon.src = "../images/food.png";
        icon.alt = "Food-providing Event";
        iconHolders[i].appendChild(icon);
      }
      else if (currentTag == "networking") {
        icon.src = "../images/networking.png";
        icon.alt = "Networking Event";
        iconHolders[i].appendChild(icon);
      }
      else if (currentTag == "club") {
        icon.src = "../images/club.png";
        icon.alt = "Club-sponsored Event";
        iconHolders[i].appendChild(icon);
      }
      else if (currentTag == "seminar") {
        icon.src = "../images/seminar.png";
        icon.alt = "Seminar or Lecture Event";
        iconHolders[i].appendChild(icon);
      }
      tagList = tagList.substring(space + 1);
      space = tagList.indexOf(' ');
    }
  }
}

//Well, technically sends a door request, but whatever.
function sendEventRoom(event) {
  let buttonOfInterest = event.currentTarget;
  let buttonProps = buttonOfInterest.childNodes;
  //roomText holds the room number of interest
  let roomText;

  //gets the room number
  for (let k = 0; k < buttonProps.length; k++) {
    if (buttonProps[k].id === "roomNumber") {
      roomText = buttonProps[k].innerHTML.slice(1, -1);
      k = buttonProps.length;
    }
  }

  //determine if room number is on the third floor; if not, provide rejection
  //TODO: do something better than an alert?
  if (roomText.indexOf('3.') == -1) {
    alert("Sorry, but functionality of this robot is currently only limited to the third floor.");
    //break out, dont send the post request
    return;
  }

  //Now that we know that the room number is on the third floor, we can determine available doors as necessary.
  let processedRoomNumber = roomText.substring(roomText.indexOf('3.')).replace('.', '_');;
  //Featuring: Hard coded logic for special doors cause hey, why not?
  doorCode = `d${processedRoomNumber}`;
  let doorIndex = DOOR_LIST.indexOf(doorCode);

  if (doorIndex == -1) {
    //Handling doors that dont comply to d3_###
    let specialOptions = SPECIAL_DOORS.indexOf(doorCode);
    if (specialOptions != -1) {
      if (specialOptions == 2) {
        doorCode = "d3_816a";
        sendRequest();
      }
      //Multiple doors possible here.
      //index 0 = 414, index 1 = 710
      else {
        document.getElementById("chooseDoors").style.visibility = "visible";
        //make other things unclickable? hmm
      }
    }
    //just not a door, lol
    else {
      alert("Sorry, but that room does not exist in our directory.");
      return;
    }
  }
  else sendRequest();
}

function processDoorChoice(event) {
  event.preventDefault();
  let doorChoice = document.getElementById("doorSelect").value;
  doorCode = doorCode + doorChoice;
  document.getElementById("chooseDoors").style.visibility = "hidden";
  sendRequest();
}

function sendRequest() {
  //request made to broadcast room number
  //IT WORKS WOOOOOOOOOO only on computer but that is sufficient!!!!!!!
  //possible todo: trouble shoot safri?
  fetch(IP_V4 + '/sendRoomNumber', {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}, body: doorCode}).then((response) => {
    if (response.status == 200) {
      console.log("(Door of) room of interest successfully sent");
      //alert for now, but can be replaced in future with more cosmetically pleasing notification
      alert("Successful transmission! Robot is now navigating.");
      //IDEA: get subscriber to re-render page when message is sent? so like send message on receival of command and another message upon success...
      document.location.href = IP_V4 + "/loadingScreen";
    }
    else {
      console.log(response);
      console.log("(Door of) room of interest failed to send. An error occurred");
    }
  });
}

//Special Doors: 414(6 doors, a1-a3 and b1-b3), 816(just a), 710(a1-a3, b1-b3)
//NOTE: remove special doors from list?
const DOOR_LIST = ["d3_404", "d3_400", "d3_508", "d3_402", "d3_500", "d3_502", "d3_430", "d3_422", "d3_420", "d3_416", "d3_516", "d3_418", "d3_512", "d3_510", "d3_432", "d3_436", "d3_824", "d3_600", "d3_303"];
