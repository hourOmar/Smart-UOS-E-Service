SELECT r.Student_ID, g.Course_ID, COUNT(*) 
FROM Request r 
JOIN Grade_Change g ON r.Request_ID = g.Request_ID 
GROUP BY r.Student_ID, g.Course_ID HAVING COUNT(*) > 1;