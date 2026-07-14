#!/bin/bash
cd /home/z/my-project
trap 'echo "TRAPPED SIGNAL: $?" >> /home/z/my-project/signal.log' EXIT
echo "Starting at $(date)" >> /home/z/my-project/signal.log
exec npx next dev --port 3000 2>&1 | tee -a /home/z/my-project/dev.log
echo "Exited at $(date) with code $?" >> /home/z/my-project/signal.log