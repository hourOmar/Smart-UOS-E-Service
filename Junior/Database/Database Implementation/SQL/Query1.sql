Use Smart_UoS;

SELECT Course_ID, Course_Name,
       (Total_Capacity - Current_Capacity + Additional_Capacity) AS Remaining_Seats
FROM Course;