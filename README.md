## Overview

A wrapper for the [unpass.me](unpass.me) API to be used on a server. You will need to register for a Private Key.

## Installing

### NPM

```bash
npm install passwordless-node
```

### Yarn

```bash
yarn add passwordless-node
```

## Usage

#### Import Library

```js
import { loginComplete } from "passwordless-node";
```

#### Pass in data

```js
const isLoginComplete = await loginComplete(loginData, your_private_key);
```

Pass in the `loginData` object that you recieved from the frontend library into the `loginComplete` function, along with your private key. The function will either return true and you can authenticate the user, or it will throw an error with a message.
