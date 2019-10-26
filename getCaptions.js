const { getSubtitles } = require('youtube-captions-scraper');
const getYouTubeID = require('get-youtube-id');

const getYouTubeSubtitles = async (youtubeUrl, matchWord) => {
  try {
    const videoID = getYouTubeID(youtubeUrl);
    const subtitles = await getSubtitles({ videoID });
    var arrayMatch = [];

    for (var i = 0; i < subtitles.length; i++) {
        if (subtitles[i].text.toLowerCase().includes(matchWord.toLowerCase())) {
            console.log(subtitles[i].text);
            arrayMatch.push(subtitles[i]);
        }
    }

    return arrayMatch;
    
    /* return subtitles.reduce(
      (accumulator, currentSubtitle) =>
        `${accumulator} ${currentSubtitle.text}`,
      ''
    ); */

  } catch (error) {
    console.log(`Error getting captions: ${error.message}`);
    // alert(`Error getting captions: ${error.message}`);
  }
};

(async () => {
  const consoleArguments = process.argv;
  if (consoleArguments.length !== 4) {
    console.log(
      'usage example: node <example.js> <YouTube URL> <match word>'
    );
    return;
  }

  const subtitles = await getYouTubeSubtitles(consoleArguments[2], consoleArguments[3]);
  console.log(subtitles);
})();