import { getSubtitles } from 'youtube-captions-scraper';

getSubtitles({
  videoID: 'XXXXX', // youtube video id
  lang: 'fr' // default: `en`
}).then(captions => {
  console.log(captions);
});

// ES5
var getSubtitles = require('youtube-captions-scraper').getSubtitles;

getSubtitles({
  videoID: 'XXXXX', // youtube video id
  lang: 'fr' // default: `en`
}).then(function(captions) {
  console.log(captions);
});