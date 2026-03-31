Use Smart_UoS;

SELECT 
    t.Student_ID,
    ROUND(
        SUM(
            CASE 
                WHEN t.Grade = 'A' THEN 4.00
                WHEN t.Grade = 'B+' THEN 3.50
                WHEN t.Grade = 'B' THEN 3.00
                WHEN t.Grade = 'C+' THEN 2.50
                WHEN t.Grade = 'C' THEN 2.00
                WHEN t.Grade = 'D+' THEN 1.00
                WHEN t.Grade = 'F' THEN 0.00
                ELSE 0
            END * c.Credit_Hours
        ) / SUM(c.Credit_Hours), 2
    ) AS GPA
FROM Takes t
JOIN Course c ON t.Course_ID = c.Course_ID
GROUP BY t.Student_ID;

