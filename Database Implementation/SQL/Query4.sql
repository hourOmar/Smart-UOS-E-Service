Use Smart_UoS;

SELECT 
    t.Student_ID,
    SUM(c.Credit_Hours) AS Completed_Hours
FROM Takes t
JOIN Course c ON t.Course_ID = c.Course_ID
GROUP BY t.Student_ID;

