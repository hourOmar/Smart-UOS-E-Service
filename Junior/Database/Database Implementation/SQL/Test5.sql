USE Smart_UoS;
SELECT r.Request_ID, r.Request_Type, rs.Req_Status
FROM Request r JOIN Req_Status rs ON r.Request_ID = rs.Request_ID;