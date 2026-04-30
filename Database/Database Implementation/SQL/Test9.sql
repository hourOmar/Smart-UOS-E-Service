USE Smart_UoS;
SELECT Request_ID 
FROM Request 
WHERE Request_ID NOT IN (SELECT Request_ID FROM Decision);