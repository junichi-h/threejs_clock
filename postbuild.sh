#!/bin/bash
#img
cp -R ./app/assets ./dist/jpn/events/mobilmo
cp -R ./app/assets ./dist/events/mobilmo

rm -R ./dist/jpn/events/mobilmo/assets/img/sprites
rm -R ./dist/events/mobilmo/assets/img/sprites

#js
cp ./.tmp/scripts/webgl-index.bundle.js ./dist/jpn/events/mobilmo/scripts/
cp ./.tmp/scripts/webgl-index.bundle.js ./dist/events/mobilmo/scripts/