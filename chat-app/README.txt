This is how to setup and run the messaging system.
Step 1: Set up a mongodb database.

Any form that is stored locally will work.

You can also install MONGODB Compass to have a clean and workable UI

For my implementation, I use localhost:27017

I named the database for this project "CS307" on my end

Any differences on the previous two lines, you can modify the mongoose connection on line 14 in index.js

this messaging system will write to a collection called "messages".

no need to create the cluster, it will autogenerate when inputs are made on the frontend if none exist

this cluster is a master database of all the messages ever sent from anyone on the website.

I specify what messages to show in the current room by "room_id"

I specify which ones are left and right of the screen depending on "user_id"

It is sorted by timestamp and automatically updates for both ends.



Step 2: run nodemon index.js

This should listen to your local database and start the basic frontend.



Step 3: connect to http://localhost:4000/

open multiple instances if you want to simulate a conversation



Step 4: type in "user_id" and "room_id" and press "Join Room"

All messages with the room_id will be shown. we can work on security of this later.

if your "user_id" is equal to the message in the database's, it will be on the right, and if not, on the left



Step 5: type your messages in "Type a message" and press send

the backend should receive the message and both users should see the new message