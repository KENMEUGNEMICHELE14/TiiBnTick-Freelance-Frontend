#!/bin/sh
cd /home/z/my-project
# Double fork to fully detach
(npx next dev --port 3000 --hostname :: > /home/z/my-project/dev.log 2>&1 &) &