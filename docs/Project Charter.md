# SMC Project Charter
## Problem Statement
When I want to convert media attached to public social media posts I often have to find a way to download the media, upload it to a file converter and then download it again. 

This is extremely inconvenient since it creates unnecessary extra steps for a process that I want to be simple. On top of that, uploading media and sharing the source link conflicts with my preference to minimize the data I disclose to third parties.
## Purpose and Motivation
SMC aims to let users paste a supported social-media post URL and retrieve, download, or convert its attached media to a defined set of formats in as few steps as possible.

The project aims to minimize privacy risks by remaining ad-free, requiring no account, avoiding analytics and tracking, not persistently storing user media and performing supported conversions inside the user's browser.

For me SMC is a learning project where I want to be able to learn and understand how browser-based media processing, format conversion, API integration, frontend architecture, automated testing and deployment work.
## Objectives
- Retrieve public Bluesky post data and supported attached media.
- Allow users to download the best available version of the media provided by Bluesky and perform supported edits and conversions inside the browser.
- Generate a custom, source-attributed image card for supported text-only Bluesky posts.
- Deliver an ad-free and account-free experience without analytics, tracking, or deliberate persistent storage of user media.
## Success Criteria
- Given a valid public Bluesky image post, when the user submits its URL, SMC displays the attached images, allows one image to be selected at a time, and provides the best available version of each image supplied by Bluesky for download.
- Given a selected still image, SMC allows the user to crop, resize, rotate in 90-degree increments, and flip it, then export it as PNG, JPEG, WebP, or a static GIF.
- Given a valid public Bluesky post containing video or GIF-style media, SMC provides media playback, a download option for the available video and the ability to export a selected frame as PNG.
- Given a valid public text-only Bluesky post, when the user submits its URL, SMC generates a downloadable custom card containing the post text, author display name, handle, timestamp, and Bluesky attribution.
- Given a malformed or unsupported URL, SMC displays a validation error without opening the editor.
- Given a deleted, blocked, or otherwise inaccessible post, SMC displays a clear retrieval error without opening the editor.
- During normal use, SMC does not require accounts, display advertisements, run analytics or tracking, send media to an SMC-controlled backend, or deliberately write media to persistent browser storage.
## Scope
### In Scope for the MVP

- Retrieving native media from public Bluesky posts.
- Supporting still images, videos, GIF-style videos, and text-only posts.
- Editing one media item at a time.
- Browser-based still-image editing and supported format conversion.
- Video playback, download, and PNG frame capture.
- Custom, source-attributed image cards for text-only posts.
- Client-side processing without an SMC-controlled backend.
### Out of Scope for the MVP

- Social platforms other than Bluesky.
- Direct local file uploads.
- Private posts or authenticated Bluesky access.
- Media contained in external link cards.
- Video editing, video transcoding, and animated GIF creation.
- Batch editing and exporting every video frame.
- Accounts, advertisements, analytics, tracking, and server-side media storage.
## Target Users and Stakeholders
### Target Users
SMC is intended for people who have a public Bluesky post URL and want to download or convert its media through a simple, privacy-conscious browser workflow. Users should not need technical media-conversion knowledge or a Bluesky account.
### Stakeholders
- **Project Owner and Maintainer:** Responsible for scope, implementation, maintenance, and deployment decisions.
- **Application Users:** Expect understandable controls, accurate output, privacy-conscious behavior, and useful error messages.
- **Potential contributors:** Need clear documentation, development rules and issue descriptions.
## Constraints and Dependencies
### Constraints
- The MVP must operate without paid services or an application backend.
- Only public, unauthenticated Bluesky posts are supported.
- Media processing is limited by the user's browser, device memory, and supported media codecs.
- Development is performed by one person as a learning project.
- The editor handles one media item at a time.
- Official support covers the current stable versions of Chrome, Edge, and Firefox. Safari support is best-effort until it can be tested on Apple hardware.
- SMC cannot make users completely anonymous. GitHub Pages receives basic request information such as IP addresses, while Bluesky receives the requests needed to retrieve posts and media.
### External Dependencies
- Bluesky's public API and media delivery services.
- Browser image, Canvas, video-decoding, and download APIs.
- GitHub Pages for static hosting and GitHub Actions for CI/CD.
- Maintained npm packages, including the AT Protocol client tooling.
## Assumptions to Validate

- A public Bluesky post URL can be resolved and its post data retrieved without
  user authentication.
- Bluesky's media endpoints permit the cross-origin browser requests required
  for downloading and Canvas-based processing.
- An available Bluesky video can be obtained in a downloadable format without
  authentication or backend processing.
- Typical supported media can be processed within reasonable browser memory
  and performance limits.
- Browser support for each output format can be detected so unsupported
  conversions fail clearly.
## High-Level Risks

| ID  | Risk                                                                                                                                                                                            | Likelihood | Impact | Planned Response                                                                                                                                                                                                          |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | Because Canvas export requires permitted cross-origin media access, Bluesky media responses may prevent browser-side editing or downloading.                                                    | Unknown    | High   | Run a CORS feasibility spike before building the editor; revise scope or architecture if it fails.                                                                                                                        |
| R2  | Because SMC depends on Bluesky's external APIs and schemas, an incompatible change may cause post retrieval or response parsing to fail.                                                        | Unknown    | High   | Isolate Bluesky access behind an adapter, generate types from official lexicons, validate responses, test against saved fixtures, and display a controlled retrieval error when an unexpected response occurs.            |
| R3  | Browser and operating-system codec differences could prevent playback or produce an unsupported output format for some users.                                                                   | Unknown    | Medium | Detect capabilities at runtime, verify the returned MIME type, disable unsupported options, and test Chromium, Firefox and WebKit.                                                                                        |
| R4  | Because SMC relies on third-party npm packages, a package may become vulnerable, deprecated, unmaintained, or incompatible with another dependency, causing security problems or failed builds. | Low        | High   | Keep direct dependencies minimal, commit `package-lock.json`, run weekly Dependabot checks, review updates manually, require passing CI before merging, and replace unmaintained packages when necessary.                 |
| R5  | Because SMC is a solo learning project, new feature ideas or technology experiments may expand the MVP beyond the available time, delaying or preventing its release.                           | Medium     | High   | Treat the agreed MVP scope as fixed, move new ideas to the Roadmap, work on one issue at a time, and limit research on one blocker to one hour before reassessing or asking for help.                                     |
| R6  | People might use SMC to download or change media that they do not own or have permission to use, which could lead to copyright complaints.                                                      | Unknown    | High   | Add a short notice explaining that users are responsible for permission, keep source information on text-post cards, make it clear that SMC is not an official Bluesky application, and provide a way to report problems. |
## Milestones
### M1: Planning Baseline
Complete and review the project charter, product requirements, architecture,
privacy and security plan, testing and deployment plan, roadmap, research
sources, and initial architecture decisions.
### M2: Repository and Tooling

Initialize the Vue project and Git repository, create the GitHub repository,
configure documentation, issues, milestones, branch protection, CI,
Dependabot, and an initial GitHub Pages deployment.
### M3: Technical Feasibility
Validate Bluesky URL resolution, unauthenticated API access, media CORS
behavior, image downloading, video access, Canvas processing, and supported
browser exports. Record the results and revise the scope if an assumption
fails.
### M4: MVP Implementation
Implement post retrieval, error handling, media selection, downloading,
still-image editing and conversion, video playback and frame capture, and
text-only post cards.
### M5: Testing and Release
Complete automated and manual testing, verify privacy requirements and target
browser behavior, deploy the finished application to GitHub Pages, and publish
the first versioned release.
## Budget and Resources
- The MVP has no planned monetary budget.
- Development will use existing personal hardware and internet access.
- Hosting will use a public GitHub repository, GitHub Pages, and standard
  GitHub-hosted Actions runners.
- Paid APIs, hosting services, dependencies, and a custom domain are outside
  the MVP.
- Any requirement for paid infrastructure must trigger a scope and
  architecture review before money is spent.
## Governance and Change Control
- The project owner is the final decision-maker for scope, architecture, and
  releases.
- The accepted MVP scope is the baseline for implementation.
- New feature ideas go into the Roadmap unless they are required to satisfy an
  existing success criterion.
- Significant architecture, privacy, dependency, or scope decisions must be
  recorded in an Architecture Decision Record.
- Implementation work must have a GitHub issue with clear acceptance criteria.
- Changes affecting objectives, privacy commitments, budget, or MVP scope must
  update the planning documentation before implementation begins.
## Charter Status
- **Status:** Approved
- **Project owner:** 01y7z
- **Last reviewed:** 2026-09-03