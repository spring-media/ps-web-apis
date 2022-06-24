# ps-web-apis

ps-web-apis is a client side library to interface with ps services on ps supported websites.

# Installation

`npm install --save @spring-media/ps-web-apis`

# Usage

```javascript
import {whoamiV1} from '@spring-media/ps-web-apis'

whoamiV1().then(whoami => {
    console.log(`user login status: ${whoami.isLoggedIn() ? 'logged in' : 'logged out'}`)
}).catch(() => {
    console.error('handle unavilability of whoami api')
});
```

# Building

```
npm i 
npm run build
```

