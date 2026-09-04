# SMC Product Requirements
## Main User Flow
1. The user opens SMC and sees an input bar asking them to input a Bluesky post link.
2. The user pastes a supported Bluesky post URL
3. The user submits it by pressing either the button or the enter key.
4. While SMC retrieves the post, it shows a loading bar that moves without displaying a percentage, along with a short loading message.
5. If retrieval fails, the user gets notified with feedback as to why the retrieval of the post failed and prompts them to try again.
6. If retrieval succeeds, if the retrieved post is media you are prompted into the media converter/editor, if the retrieved post is text-only you are lead to the text-card creation screen.
7. The user then chooses what action they want to take, download the text-card, edit their image with the supported capabilities or convert the file to other supported file-types.
8. When finished, the user will then be returned to the home-screen where they can start the process again.