SELECT r.Request_ID, r.Request_Type 
FROM Request r JOIN Req_Status rs ON r.Request_ID = rs.Request_ID 
WHERE rs.Req_Status='Approved';