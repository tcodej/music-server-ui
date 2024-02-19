#!/bin/bash

rsync -e ssh --rsync-path="sudo rsync" -rpt --delete --progress /mnt/g/Audio/mp3/Music trentj@192.168.1.200:/mnt/usb/mp3
