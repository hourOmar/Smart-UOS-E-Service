SELECT * 
FROM Authorized_Staff 
WHERE Program_ID NOT IN (SELECT Program_ID FROM Program);