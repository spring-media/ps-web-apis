# ps-web-apis

ps-web-apis is a client side library to interface with ps services on ps supported websites.

# Installation

`npm install --save @spring-media/ps-web-apis`

> **Note** Also needs [ps-rosetta](https://github.com/spring-media/ps-rosetta) to be present on the website:

```html
<script type="text/javascript" src="https://rosetta.prod.ps.(welt|bild).de/ps-rosetta.js"></script>
```

# Usage

```javascript
import { whoamiV1 } from "@spring-media/ps-web-apis";

whoamiV1()
  .then((whoami) => {
    console.log(
      `user login status: ${whoami.isLoggedIn() ? "logged in" : "logged out"}`
    );
  })
  .catch(() => {
    console.error("handle unavilability of whoami api");
  });
```

# Building

```
npm i
npm run build
```
