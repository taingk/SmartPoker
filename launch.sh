if pgrep node > /dev/null
then
     echo Running
else
     cd /home/paris/1st_screen/
     node ./server.js
fi
