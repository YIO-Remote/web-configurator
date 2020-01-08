# YIO Remote Config Repository

For details about the YIO Remote Config Software, please visit our documentation repository which can be found under
https://github.com/YIO-Remote/documentation

### Installation
Install dependencies - `npm install`

Run development server - `npm run serve`

Lint code - `npm run lint`

Production build - `npm run build` <--- This probably won't work yet

### TODO
- [x] Add localisation plugin example usage
- [x] Make websocket and store use RxJS streams
- [x] Create <card> component
- [x] Create <card-list> component (so we can independently select cards (e.g.get all cards in card-list and toggle))
- [ ] Create <list> and <list-item> component (optional drag/drop functionality)
- [x] Create <table> component
- [x] Create <remote-control> component
- [x] Create <delete-icon> component (little one in tables etc.)
- [x] Add interface types for components (e.g. no use of "any" type for component references)
- [ ] Split up Redux state
- [ ] Create RxJs data fragments (e.g. entities/pages/groups by profile)
- [ ] Remove any types from page components
- [ ] Add license link to files
- [x] Add TSLint to project
- [x] Add production build output configuration
- [ ] Setup GitHub Actions for PR QA and Production Builds (possibly also auto gen of translations?)
