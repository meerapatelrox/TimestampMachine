# INSTALL MODULE USING:
# pip install youtube_transcript_api

# INSTALL PICO FOR PY-JS RPC FRAMEWORK
# pip install --upgrade pico

import pico
from pico import PicoApp
from youtube_transcript_api import YouTubeTranscriptApi

# define user input
#user_input = "jimmy"
# Jimmy Fallon/Kimmel video; user-uploaded captions
#video_id = "nyf7wNn5fw8"
# Eggs video; auto-generated captions
#auto_video_id = "MI_0-ZLqdo8"

@pico.expose()
def getCaptions(v, word):
    # create list of dictionary items
    caption_list = YouTubeTranscriptApi.get_transcript(v)

    # empty list for timestamps
    time_list = []

    # adds the timestamps of captions containing user input to the list
    for item in caption_list:
        if (word in item['text'].lower()):
            time_list.append(item['start'])

    # create output string
    new = ""
  
    # traverse the list, adding each item  
    for ts in time_list: 
        new += str(ts) + ' '
    
    return new

app = PicoApp()
app.register_module(__name__)