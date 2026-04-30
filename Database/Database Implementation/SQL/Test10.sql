SELECT * 
FROM Takes 
WHERE Student_ID NOT IN (SELECT Student_ID FROM Student);