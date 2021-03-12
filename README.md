# `fake-https-cert`

> Create fake SSL certificates for `https://localhost` to work.
> Shamelessly stolen from `webpack-dev-server`.

## Install

```sh
npm i -D fake-https-cert

yarn add --dev fake-https-cert
```

## Usage

```js
const { createServer } = require("https");
const fakeHttpsCert = require("fake-https-cert");
const fakeCert = getCertificate(console);

const httpsOptions = {
  key: fakeCert,
  cert: fakeCert,
};

createServer(httpsOptions, (req, res) => {
  const parsedUrl = parse(req.url, true);
  handle(req, res, parsedUrl);
}).listen(3000, () => {
  console.log("> Server started on https://localhost:3000");
});
```
