SELECT Student_ID, Request_Type, COUNT(*) 
FROM Request 
GROUP BY Student_ID, Request_Type HAVING COUNT(*) > 1;