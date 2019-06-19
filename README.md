![demo](./static/demo.gif "Record and replay request in storybook")


## How to use with storybook

### Install the package
```npm install -D storybook-addon-r2request```

### Edit the config.js

Add the following code:
```javascript
import { withR2Request } from "storybook-addon-r2request/lib/index";

addDecorator(withR2Request);
```

### Edit the addons.js
Add the following code

```javascript
import 'storybook-addon-r2request/lib/register';
```

### Edit the middleware.js

```javascript
const { register: registerR2Request } = require("storybook-addon-r2request/lib/middleware");

module.exports = function expressMiddleware(app) {
  registerR2Request(app);
};
```

## Next
[ ] Support edit match request in story configurations