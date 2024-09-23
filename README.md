## Description

Node.js parser.

## Installation

```bash
$ npm install
```

## Build

```bash
# development
$ npm run build
```

## Running the app

```bash
# Single
$ npm run start [URL] [region]

# example

$ npm run start  'https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202' "Санкт-Петербург и область"


# Multiple
$ npm run start [...URLs] 'locations' [...regions] 'multiple'

# example

$ npm run start  'https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202' 'https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-2-5-950g--310778' 'locations' 'Владимирская обл.' 'Калужская обл.' 'Рязанская обл.' 'multiple'


# watch mode
$ npm run dev:nodemon [URL] [region]
```
