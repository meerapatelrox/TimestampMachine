//const { getSubtitles } = require('youtube-captions-scraper');
//const getYouTubeID = require('get-youtube-id');

const getYouTubeSubtitles = (youtubeUrl, matchWord) => {
  try {
    //const videoID = getYouTubeID(youtubeUrl);
    /*chrome.tabs.getCurrent(tab => {
      alert("currentTab: " + tab);
    })*/
    
    //document.querySelector('#menu-container > #menu > ytd-menu-renderer > yt-icon-button').click();
    //document.querySelector('ytd-popup-container > iron-dropdown > #contentWrapper > ytd-menu-popup-renderer > paper-listbox').children[1].click()
    //const subtitles = await getSubtitles({ videoID });
    //const allTranscripts = document.getElementsByTagName('ytd-transcript-body-renderer')[0].innerText;
    //document.querySelector('ytd-engagement-panel-section-list-renderer > #header > ytd-engagement-panel-title-header-renderer > #visibility-button').children[0].click();
    //console.log(allTranscripts);

    return "allTranscripts";
    /*var arrayMatch = [];

    for (var i = 0; i < subtitles.length; i++) {
        if (subtitles[i].text.toLowerCase().includes(matchWord.toLowerCase())) {
            console.log(subtitles[i].text);
            arrayMatch.push(subtitles[i].start);
        }
    }

    return arrayMatch;*/

  } catch (error) {
    alert(`Error getting captions: ${error.message}`);
  }
};
var url, tab;


function init(){
    chrome.tabs.query({currentWindow: true, active: true},function(tabs){
       url = tabs[0].url;
       tab = tabs[0];
       console.log(url)
       //Now that we have the data we can proceed and do something with it
<<<<<<< Updated upstream
=======
       chrome.tabs.executeScript({
				code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
			}, (results) => {
				//Here we have just the innerHTML and not DOM structure
				console.log('Transcript: ' + results[0])
			});
>>>>>>> Stashed changes
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
    // Use url & tab as you like
    alert(url);
}

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
  const captionTimes =  getYouTubeSubtitles(url, document.getElementById('userInput').value);
  //alert("Transcript: " + captionTimes);
});

/* Received returnSearchInfo message, populate popup UI */ 
/*chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if ('returnSearchInfo' == request.message) {
    processingKey = false;
    if (request.numResults > 0) {
      document.getElementById('numResults').textContent = String(request.currentSelection+1) + ' of ' + String(request.numResults);
    } else {
      document.getElementById('numResults').textContent = String(request.currentSelection) + ' of ' + String(request.numResults);
    }
    if (!sentInput) {
      document.getElementById('userInput').value = request.regexString;
    }
    if (request.numResults > 0 && request.cause == 'selectNode') {
      addToHistory(request.regexString);
    }
    if (request.regexString !== document.getElementById('userInput').value) {
      passInputToContentScript();
    }
  }
});*/

/* Key listener for selectNext and selectPrev
 * Thanks a lot to Cristy from StackOverflow for this AWESOME solution
 * http://stackoverflow.com/questions/5203407/javascript-multiple-keys-pressed-at-once */
/*var map = [];
onkeydown = onkeyup = function(e) {
    map[e.keyCode] = e.type == 'keydown';
    if (document.getElementById('userInput') === document.activeElement) { //input element is in focus
      if (!map[16] && map[13]) { //ENTER
        if (sentInput) {
          selectNext();
        } else {
          passInputToContentScript();
        }
      } else if (map[16] && map[13]) { //SHIFT + ENTER
        selectPrev();
      }
    }
}*/
/*** LISTENERS ***/

/*** INIT ***/
/* Retrieve from storage whether we should use instant results or not */
/* chrome.storage.local.get({
    //'instantResults' : DEFAULT_INSTANT_RESULTS,
    //'maxHistoryLength' : MAX_HISTORY_LENGTH,
    'searchHistory' : null,
    'isSearchHistoryVisible' : false},

  function(result) {
    if(result.instantResults) {
      document.getElementById('userInput').addEventListener('input', function() {
        passInputToContentScript();
      });
    } else {
      document.getElementById('userInput').addEventListener('change', function() {
        passInputToContentScript();
      });
    }
    console.log(result);
    if(result.maxHistoryLength) {
      maxHistoryLength = result.maxHistoryLength;
    }
    if(result.searchHistory) {
      searchHistory = result.searchHistory.slice(0);
    } else {
      searchHistory = [];
    }
    //setHistoryVisibility(result.isSearchHistoryVisible);
    updateHistoryDiv();
  }
); */

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

/* Focus onto input form */
//document.getElementById('userInput').focus();
//window.setTimeout( 
  //function(){document.getElementById('userInput').select();}, 0);
//Thanks to http://stackoverflow.com/questions/480735#comment40578284_14573552

//var makeVisible = document.getElementById('history').style.display == 'none';
//setHistoryVisibility(makeVisible);
//chrome.storage.local.set({isSearchHistoryVisible: makeVisible});

//setCaseInsensitiveElement();
/*** INIT ***/