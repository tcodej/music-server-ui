#!/bin/bash

#rsync -e ssh --rsync-path="sudo rsync" -rpt --delete --progress /mnt/g/Audio/mp3/Music trentj@192.168.1.200:/mnt/usb/mp3
rsync -e ssh --rsync-path="sudo rsync" -rpt --delete --progress /mnt/g/Audio/mp3/Music/Ministry trentj@192.168.1.200:/mnt/usb/mp3/Music

#sudo mount -t drvfs K: /mnt/k -o uid=$(id -u $USER),gid=$(id -g $USER),metadata
#rsync -e ssh --rsync-path="sudo rsync" -rpt --delete --progress /mnt/g/Audio/mp3/Music /mnt/k/mp3
