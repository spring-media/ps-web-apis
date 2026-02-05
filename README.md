# ps-web-apis

ps-web-apis is a client side library to interface with ps services on ps supported websites.

The possible use cases are documented here:
https://github.com/spring-media/ps-public-integration

Please use public-integration to implement your use case. If it is not listed there or the documentation is not understandable / complete, please contact the team premium services for assistance.

# Installation

`yarn install @axelspringer/ps-web-apis`

> **Note** Also needs [ps-rosetta](https://github.com/spring-media/ps-rosetta) to be present on the website:

```html
<script
  type="text/javascript"
  src="https://rosetta.prod.ps.(welt|bild|axelspringer).de/ps-rosetta.js"
></script>
```

# Basic Usage

```javascript
import { whoamiV1 } from "@axelspringer/ps-web-apis";

whoamiV1()
  .then((whoami) => {
    console.log(
      `user login status: ${whoami.isLoggedIn() ? "logged in" : "logged out"}`,
    );
  })
  .catch(() => {
    console.error("handle unavilability of whoami api");
  });
```

# Building

```
yarn
yarn build
```

