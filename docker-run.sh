#!/bin/sh

echo "Set root path to ${ROOT_PATH:-v2}"
sed -i -e "s/\/static/\/${ROOT_PATH:-v2}\/static/g" build/index.html
serve -s build
