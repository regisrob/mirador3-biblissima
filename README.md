
# README


## Install dependencies:

```
npm install
```

## Start app

Open `demo/index.html` on localhost:4444 and watches the source files
```
npm start
```

URL: http://localhost:4444/?manifest=https://gallica.bnf.fr/iiif/ark:/12148/btv1b525002505/manifest.json

Known parameters are:
- `manifest` or `iiif-content` = URL of IIIF resource
- `context` = mirador embedding context (i.e. type of page in the portal)
- `theme` = mirador selected theme

## Serve demo

Serve static files in `demo/portal` on localhost:5555
```
npm run serve
```

Directory root: http://localhost:5555/demo/portal
