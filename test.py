# INSTALL MODULE USING:
# pip install youtube_transcript_api

from youtube_transcript_api import YouTubeTranscriptApi

# define user input
user_input = "jimmy"

# Jimmy Fallon/Kimmel video; user-uploaded captions
video_id = "nyf7wNn5fw8"

# Eggs video; auto-generated captions
auto_video_id = "MI_0-ZLqdo8"

# create list of dictionary items
caption_list = YouTubeTranscriptApi.get_transcript(video_id)

# empty list for timestamps
time_list = []

# adds the timestamps of captions containing user input to the list
for item in caption_list:
    if (user_input.lower() in item['text'].lower()):
        time_list.append(item['start'])

# prints timestamp list
for ts in timelist:
    print(ts)