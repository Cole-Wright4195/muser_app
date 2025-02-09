Team Names: Cole Wright, Turjoy Paul, Kareem Coulibaly

Purpose: We came up with this idea because it seemed to fit the theme of hacks this year and we felt 
as though it was very unique and no other groups would do something like it. We wanted to come up with something that accomplishes goals that some other organizational app like excel or google calendar couldn't do whilst still being simple and on theme by skewing it towards the giging/band scene. Essentially, MUSER allows users to make accounts as a manager or a band member (backend, frontend isnt working in this regard) managers can create bands, add events, and manage/view the status of their band members via the status page, The status page can update a band member's status by sending an SMS text message, the member can response YES or NO when asked about their availability for an event, based on this response MUSER will update the availability status of the member and the manager will see it update in real time.

Tools Utilizied: we built muser using a full stack of, CSS, React/next.js, and MogoDB. We used Twilio and ngrok to send and receive SMS messages. ngrok to publicly host the site so Twilio could use a web-hook to receive messages. We also used AI assistance such as COPILOT and GPT for helpful bugfixing and Schema Mapping.

Problems that your team ran into and how your team overcame them: Where do we start, there was seemingly a million challenges along the way, the learning curve of using an API such as Twilio, the intense react implementation, the construction of countless MongoDB schemas with endless possibilities. Bugs that made no sense! The largest challenge was getting the availability light to change dynamically based on the user's response to the text message.

APIS: ngrok and twillio, were used to operate the app's SMS system. nGrok to create a public tunnel for our local hosted site so the TWILIO API could recieve its messages.
We of course used the react/next.js framework to build our application, as well as basic CSS styling on top of our component files.




