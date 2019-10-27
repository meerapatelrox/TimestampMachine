const getYouTubeSubtitles = (youtubeUrl, matchWord) => {
  try {

    return "Timestamps from " + youtubeUrl + " containing '" + matchWord + "':";

  } catch (error) {
    alert(`Error getting captions: ${error.message}`);
  }
};

function init(){
    chrome.tabs.query({currentWindow: true, active: true},function(tabs){
       url = tabs[0].url;
       tab = tabs[0];
       console.log(url)
       //Now that we have the data we can proceed and do something with it
       chrome.tabs.executeScript({
				code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
			}, (results) => {
				//Here we have just the innerHTML and not DOM structure
				console.log('Results: ' + results[0])
			});
       //processTab();
    });
}

function modifyDOM()
{
  console.log(document)

  /* document.querySelector('#menu-container > #menu > ytd-menu-renderer > yt-icon-button').click();
  document.querySelector('ytd-popup-container > iron-dropdown > #contentWrapper > ytd-menu-popup-renderer > paper-listbox').children[1].click()
  const allTranscripts = document.getElementsByTagName('ytd-transcript-body-renderer')[0].innerText;
  document.querySelector('ytd-engagement-panel-section-list-renderer > #header > ytd-engagement-panel-title-header-renderer > #visibility-button').children[0].click();
  console.log(allTranscripts); */
}

function processTab(){
    alert(url);
}

var url, tab;
init();

/*** FUNCTIONS ***/

/* Send message to content script of tab to select next result */
function selectNext(){
  chrome.tabs.query({
    'active': true,
    'currentWindow': true
  },
  function(tabs) {
    if ('undefined' != typeof tabs[0].id && tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        'message' : 'selectNextNode'
      });
    }
  });
}

gapi.load("client:auth2", function() {
	gapi.auth2.init({client_id: "769594192979-4q2g6gpjm9ui97pbaq493eeigp4ocipd.apps.googleusercontent.com"});
});

/* Send message to content script of tab to select previous result */
function selectPrev(){
  chrome.tabs.query({
    'active': true,
    'currentWindow': true
  },
  function(tabs) {
    if ('undefined' != typeof tabs[0].id && tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        'message' : 'selectPrevNode'
      });
    }
  });
}

/* Send message to pass input string to content script of tab to find and highlight regex matches */

/* function passInputToContentScript(){
  passInputToContentScript(false);
} */
/*** LISTENERS ***/
document.getElementById('next').addEventListener('click', function() {
  selectNext();
});

document.getElementById('prev').addEventListener('click', function() {
  selectPrev();
});

document.getElementById('clear').addEventListener('click', function() {
  sentInput = false;
  document.getElementById('userInput').value = '';
  passInputToContentScript();
  document.getElementById('userInput').focus();
});

document.getElementById('search').addEventListener('click', function() {
  alert("Searching!");
  // this is the user input! ---> document.getElementById('userInput').value
  var ts = getYouTubeSubtitles(url, document.getElementById('userInput').value);
  alert(ts);
});

/* Get search info if there is any */
chrome.tabs.query({
  'active': true,
  'currentWindow': true
},
function(tabs) {
  if ('undefined' != typeof tabs[0].id && tabs[0].id) {
    chrome.tabs.sendMessage(tabs[0].id, {
      'message' : 'getSearchInfo'
    }, function(response){
      if (response) {
        // Content script is active
        console.log(response);
      } else {
        console.log(response);
        //document.getElementById('error').innerHTML = ERROR_TEXT;
      }
    });
  }
});
