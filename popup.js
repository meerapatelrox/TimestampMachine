// Get video ID arg from URL
function getUrlVars(url) {
    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function init(){
    chrome.tabs.query({currentWindow: true, active: true},function(tabs){
       url = tabs[0].url;
       tab = tabs[0];
       //Now that we have the data we can proceed and do something with it
       processTab();
    });
}

function processTab(){
    // Use url & tab as you like
    arg = getUrlVars(url)["v"];
    console.log(url);
    console.log(tab);
    debug();
}

function debug() {
  alert(arg);
}

var url, tab, arg;
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
});

/* Received returnSearchInfo message, populate popup UI */ 
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
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
});

/* Key listener for selectNext and selectPrev
 * Thanks a lot to Cristy from StackOverflow for this AWESOME solution
 * http://stackoverflow.com/questions/5203407/javascript-multiple-keys-pressed-at-once */
var map = [];
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
}
/*** LISTENERS ***/

/*** INIT ***/
/* Retrieve from storage whether we should use instant results or not */
chrome.storage.local.get({
    'instantResults' : DEFAULT_INSTANT_RESULTS,
    'maxHistoryLength' : MAX_HISTORY_LENGTH,
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
    setHistoryVisibility(result.isSearchHistoryVisible);
    updateHistoryDiv();
  }
);

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
        document.getElementById('error').textContent = ERROR_TEXT;
      }
    });
  }
});

/* Focus onto input form */
document.getElementById('userInput').focus();
window.setTimeout( 
  function(){document.getElementById('userInput').select();}, 0);
//Thanks to http://stackoverflow.com/questions/480735#comment40578284_14573552

var makeVisible = document.getElementById('history').style.display == 'none';
setHistoryVisibility(makeVisible);
chrome.storage.local.set({isSearchHistoryVisible: makeVisible});

setCaseInsensitiveElement();
/*** INIT ***/