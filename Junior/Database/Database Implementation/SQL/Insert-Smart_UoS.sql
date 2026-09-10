USE Smart_UoS;

-- ================= PROGRAM =================
-- Stores university programs and their colleges
INSERT INTO Program VALUES
(1,'Computer Science','Computing and Informatics '),
(2,'Computer Engineering','Computing and Informatics '),
(3,'Information Systems','Computing and Informatics ');

-- ================= STUDENT =================
-- Stores student basic information and their program
INSERT INTO Student VALUES
('U24011234', 'Noorah Alzaabi', 'U24011234@sharjah.ac.ae', 1),
('U25024567', 'Ahmed Almansoori', 'U25024567@sharjah.ac.ae', 2),
('U23019876', 'Fatima Alnuaimi', 'U23019876@sharjah.ac.ae', 3);

-- ================= AUTHORIZED STAFF =================
-- Stores all staff members who can access the system
INSERT INTO Authorized_Staff VALUES
(201,'Ayad Turky','ATurky@sharjah.ac.ae', 1),
(202,'Lina Khalid','LKhalid@sharjah.ac.ae', 1),
(203,'Hassan Ali','HAli@sharjah.ac.ae',3),
(204, 'Rania Saeed', 'RSaeed@sharjah.ac.ae', 1),
(205, 'Khalid Nasser', 'KNasser@sharjah.ac.ae', 2),
(206, 'Amal Fahad', 'AFahad@sharjah.ac.ae', 3),
(210, 'Fahad Ahmed', 'FAhmed@sharjah.ac.ae', 1),
(211, 'Sami Yousef', 'SYousef@sharjah.ac.ae', 2),
(212, 'Tarek Salem', 'TSalem@sharjah.ac.ae', 1),
(213, 'Noor Ali', 'NAli@sharjah.ac.ae', 2),
(214, 'Samir Hadi', 'SHadi@sharjah.ac.ae', 3);

-- ================= ACCOUNT =================
-- Stores login credentials for all users
INSERT INTO Account VALUES
(1, 'noorah1', 'pass123'),
(2, 'ahmed2', 'pass456'),
(3, 'fatima3', 'pass789'),
(4, 'staff1', 'pass11'),
(5, 'staff2', 'pass22'),
(6, 'staff3', 'pass33'),
(7, 'staff4', 'pass44'),
(8, 'staff5', 'pass55'),
(9, 'staff6', 'pass66'),
(10, 'staff7', 'pass77'),
(11, 'staff8', 'pass88'),
(12, 'staff9', 'pass99'),
(13, 'staff10', 'pass100'),
(14, 'staff11', 'pass111');

-- Links accounts to students
INSERT INTO Student_Account VALUES
(1, 'U24011234'),
(2, 'U25024567'),
(3, 'U23019876');

-- Links accounts to staff
INSERT INTO Staff_Account VALUES
(4, 201),
(5, 202),
(6, 203),
(7, 204),
(8, 205),
(9, 206),
(10, 210),
(11, 211),
(12, 212),
(13, 213),
(14, 214);

-- ================= TRANSCRIPT =================
-- Stores transcript metadata (actual file stored in MongoDB)
INSERT INTO Transcript (Issue_Date, Student_ID, Mongo_Transcript_ID) VALUES
('2026-01-10','U24011234',NULL),
('2026-01-11','U25024567',NULL),
('2026-02-12', 'U23019876', NULL);

-- ================= COURSE =================
-- Stores course details including capacity
INSERT INTO Course VALUES
(1501123, 'Introduction to Database Systems', 3, 'None', 50, 45, 5),
(1501345, 'Computer Networks', 3, 'Data Structures', 60, 60, 10),
(1501567, 'Operating Systems', 4, 'Data Structures', 40, 43, 5),
(1501318,'Software Engineering',3,'None',50,30,5),
(1501715,'AI Fundamentals',3,'None',50,25,5);

-- ================= TAKES =================
-- Stores student grades for each course
INSERT INTO Takes VALUES
('U24011234', 1501123, 'A'),
('U24011234', 1501345, 'B+'),
('U24011234', 1501567, 'A'),
('U24011234', 1501318, 'A'),
('U24011234', 1501715, 'A'),
('U25024567', 1501123, 'B+'),
('U25024567', 1501345, 'A'),
('U25024567', 1501567, 'A'),
('U25024567', 1501318, 'B+'),
('U25024567', 1501715, 'A'),
('U23019876', 1501123, 'A'),
('U23019876', 1501345, 'B'),
('U23019876', 1501567, 'B+'),
('U23019876', 1501318, 'A'),
('U23019876', 1501715, 'A');

-- ================= REQUEST =================
-- Stores all student requests in the system
INSERT INTO Request VALUES
(400,'Grade Change','2026-03-01','High','10:15:00','Review grade','U24011234'),
(401,'Grade Change','2026-03-01','High','10:15:00','Review grade','U24011234'),
(402,'Course Equivalency','2026-03-02','Medium','11:30:00','Transfer course','U25024567'),
(404,'Raise Capacity','2026-03-03','Low','12:00:00','Need more seats','U25024567'),
(406,'Program Change','2026-03-04','Medium','13:00:00','Switch program','U23019876'),
(411,'Course Equivalency','2026-03-05','Medium','14:00:00','Equivalency request','U23019876'),
(407, 'Incomplete Exam', '2026-03-10', 'High', '09:00:00', 'Missed midterm due to illness', 'U24011234');

-- ================= SPECIFIC REQUEST TYPES =================
-- Each table stores details for a specific request type

-- ================= INCOMPLETE EXAM =================
-- Incomplete exam details
INSERT INTO Incomplete_Exam VALUES 
(407, 'Midterm', '2026-02-20', 'Sick', 'Medical certificate', 62, 1501345);

-- ================= GRADE CHANGE =================
-- Grade change details
INSERT INTO Grade_Change VALUES 
(400, 'Final', 'A', 'Recheck requested', 1501318, 31),
(401, 'Midterm', 'B+', 'Re-evaluation', 1501123, 30);

-- ================= RAISE CAPACITY =================
-- Raise capacity details
INSERT INTO Raise_Capacity VALUES 
(404, 1501715, 62, 'Section full', 62, 1501715);

-- ================= COURSE EQUIVALENCY =================
-- Course equivalency details
INSERT INTO Course_Equivalency VALUES
(402, 1501345, 1501123, 'Old syllabus', 'New syllabus'),
(411, 1501123, 1501567, 'Old syllabus', 'New syllabus');

-- ================= PROGRAM CHANGE =================
-- Program change details
INSERT INTO Program_Change VALUES 
(406, 'Computer Science', 'Information Systems', 'Better opportunities');

-- ================= DOCUMENT =================
-- Stores uploaded documents linked to requests
INSERT INTO Document VALUES
(1101, 'medical.pdf', 'PDF', '2026-03-01', 407, NULL),
(1102, 'transcript.pdf', 'PDF', '2026-03-02', 411, NULL),
(1103, 'transcript2.pdf', 'PDF', '2026-03-03', 406, NULL);

-- ================= REQUEST HISTORY =================
-- Tracks status changes over time
INSERT INTO Request_History VALUES
(1201, 'Approved', '2026-03-01', 400),
(1202, 'Rejected', '2026-03-02', 401),
(1203, 'Rejected', '2026-03-04', 402),
(1204, 'Pending', '2026-03-06', 404),
(1205, 'Approved', '2026-03-07', 406),
(1206, 'Approved', '2026-03-09', 411),
(1207, 'Pending', '2026-03-10', 407);

-- ================= NOTIFICATION =================
-- Stores system notifications sent to users
INSERT INTO Notification VALUES
(601, 'Request received', 'Email', '2026-03-02', 400),
(602,'Request received','Email','2026-03-03', 401),
(603, 'Pending update', 'System', '2026-03-04', 404),
(604, 'Approved', 'System', '2026-03-05', 406),
(605, 'Pending update', 'System', '2026-03-06', 407);

-- ================= APPEAL =================
-- Stores appeals submitted for rejected/pending requests
INSERT INTO Appeal VALUES
(501, 'Unfair grading', '2026-03-06', 401),
(502, 'Incorrect evaluation', '2026-03-08', 407),
(503, 'No available seats', '2026-03-10', 404);

-- ================= STAFF ROLES =================
-- Defines specific roles of staff members in the system

-- Secretaries responsible for handling and tracking requests
INSERT INTO Secretary VALUES 
(204, 'Masters', 'Computer Science'),
(205, 'Bachelors', 'Computer Engineering'),
(206, 'Bachelors', 'Information Systems');

-- Instructors assigned to courses and sections
INSERT INTO Instructor VALUES 
(201, 1501123, 31),
(202, 1501345, 62),
(203, 1501567, 61);

-- Heads of Departments responsible for final decisions
INSERT INTO Head_Of_Department VALUES 
(212, 'Computer Science'),
(213, 'Computer Engineering'),
(214, 'Information Systems');

-- Registration staff handling enrollment and course-related services
INSERT INTO Registration_Staff VALUES 
(210, 'Enrollment Services'),
(211, 'Course Registration');

-- ================= DECISION =================
-- Final decisions made by staff on requests
INSERT INTO Decision VALUES
(901, 'Approved', 'Valid reason', '2026-03-06', 400, 201),
(902, 'Rejected', 'Missing proof', '2026-03-07', 401, 202),
(903, 'Rejected', 'Missing proof', '2026-03-08', 402, 212),
(904, 'Pending', 'Under review', '2026-03-09', 404, 212),
(905, 'Approved', 'Meets requirements', '2026-03-10', 406, 214),
(906, 'Approved', 'Valid reason', '2026-03-11', 411, 213),
(907, 'Pending', 'Under review', '2026-03-12', 407, 203);

-- ================= ACADEMIC COMMITTEE =================
-- Represents committees involved in reviewing or handling specific requests
INSERT INTO Academic_Affairs_Committee VALUES 
(1001, 'Academic Review Board', 'Dr. Hassan, Ms. Lina', 400),
(1002, 'Appeals Committee', 'Dr. Omar, Dr. Sami', 402);

-- ================= AUDIT LOG =================
-- Logs system actions performed by staff
INSERT INTO Audit_Log VALUES
(801, 'CREATE', '2026-03-01 10:20:00', 'Created request', 201),
(802, 'UPDATE', '2026-03-02 11:40:00', 'Request updated', 202),
(803, 'REVIEW', '2026-03-03 12:00:00', 'Reviewed by staff', 203),
(804, 'APPROVE', '2026-03-04 13:10:00', 'Approved request', 204),
(805, 'REJECT', '2026-03-05 9:00:00', 'Rejected request', 205);

-- ================= STATUS TABLES =================
-- Stores the current status of different system entities

-- Status of requests (Approved, Rejected, Pending)
INSERT INTO Req_Status VALUES 
(1301, 'Approved', 400),
(1302, 'Rejected', 401),
(1303, 'Rejected', 402),
(1304, 'Pending', 404),
(1305, 'Approved', 406),
(1306, 'Approved', 411),
(1307, 'Pending', 407);

-- Status of notifications (e.g., Sent)
INSERT INTO Notif_Status VALUES 
(1401,'Sent',601),
(1402,'Sent',602),
(1403,'Sent',603),
(1404,'Sent',604),
(1405,'Sent',605);

-- Status of appeals (Under Review, Approved, Rejected)
INSERT INTO App_Status VALUES 
(1501, 'Under Review', 501),
(1502, 'Approved', 502),
(1503, 'Rejected', 503);

-- ================= OFFICE =================
-- Stores office locations for staff members
INSERT INTO Office_Location VALUES 
(0205, 'M5-205', 201),
(0211, 'M5-211', 202),
(0215, 'M5-215', 203),
(0209, 'W5-209', 204),
(0219, 'W5-219', 205),
(0229, 'W5-229', 206),
(0208, 'M11-A-208', 210),
(0218, 'M11-A-218', 211),
(0210, 'W5-210', 212),
(0220, 'W5-220', 213),
(0230, 'W5-230', 214);


