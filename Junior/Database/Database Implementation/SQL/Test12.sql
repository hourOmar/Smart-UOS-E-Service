SELECT Request_ID 
FROM Request 
WHERE Request_ID NOT IN (SELECT Request_ID FROM Request_History);