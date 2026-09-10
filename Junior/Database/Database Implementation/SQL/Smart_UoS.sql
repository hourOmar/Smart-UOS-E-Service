-- =========================================
-- Smart UoS Database
-- This database supports the Smart UoS E-Service system
-- It includes both student requests and administrative processing
-- It manages students, requests, staff, and documents
-- =========================================

Create Database Smart_UoS;
Use Smart_UoS;

-- Stores academic programs offered by the university
CREATE TABLE Program (
    Program_ID INT PRIMARY KEY,
    Program_Name VARCHAR(100),
    College_Name VARCHAR(100)
);

-- Stores student information and their enrolled program
CREATE TABLE Student (
    Student_ID VARCHAR(20) PRIMARY KEY,
    Student_Name VARCHAR(100),
    Student_Email VARCHAR(100) UNIQUE,
    Program_ID INT,
    FOREIGN KEY (Program_ID) REFERENCES Program(Program_ID)
);

-- Stores login account credentials
CREATE TABLE Account (
    Account_ID INT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE,
    Password VARCHAR(100)
);

-- Links student accounts to student records
CREATE TABLE Student_Account (
    Account_ID INT PRIMARY KEY,
    Student_ID VARCHAR(20) UNIQUE,
    FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID),
    FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID)
);

-- Stores authorized staff details
CREATE TABLE Authorized_Staff (
    Staff_ID INT PRIMARY KEY,
    Staff_Name VARCHAR(100),
    Staff_Email VARCHAR(100) UNIQUE,
	Program_ID INT, 
    FOREIGN KEY (Program_ID) REFERENCES Program(Program_ID) 
);

-- Links staff accounts to staff records
CREATE TABLE Staff_Account (
    Account_ID INT PRIMARY KEY,
    Staff_ID INT UNIQUE,
    FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID),
    FOREIGN KEY (Staff_ID) REFERENCES Authorized_Staff(Staff_ID)
);

-- Stores transcript metadata (actual transcript stored in MongoDB)
CREATE TABLE Transcript (
    Transcript_ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    Issue_Date DATE,
    Student_ID VARCHAR(20) UNIQUE,
    Mongo_Transcript_ID VARCHAR(100),
    FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID)
);

-- Stores course details and capacity information
CREATE TABLE Course (
    Course_ID INT PRIMARY KEY,
    Course_Name VARCHAR(100),
    Credit_Hours INT,
    Prerequisites VARCHAR(100),
    Total_Capacity INT,
    Current_Capacity INT,
    Additional_Capacity INT
);

-- Stores courses taken by students and their grades
CREATE TABLE Takes (
    Student_ID VARCHAR(20),
    Course_ID INT,
    Grade VARCHAR(5),
    PRIMARY KEY (Student_ID, Course_ID),
    FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID),
    FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID)
);

-- Stores all student requests submitted to the system
CREATE TABLE Request (
    Request_ID INT PRIMARY KEY,
    Request_Type VARCHAR(50),
    Request_Date DATE,
    Priority_Level VARCHAR(20),
    Submission_Time TIME,
    Description TEXT,
    Student_ID VARCHAR(20),
    FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID)
);

-- Stores details for incomplete exam requests
CREATE TABLE Incomplete_Exam (
    Request_ID INT PRIMARY KEY,
    Exam_Type VARCHAR(50),
    Missed_Exam_Date DATE,
    Reason TEXT,
    Proof TEXT,
    Section_ID INT,
    Course_ID INT,
    FOREIGN KEY (Request_ID) REFERENCES Request(Request_ID),
    FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID)
);

-- Stores details for grade change requests
CREATE TABLE Grade_Change (
    Request_ID INT PRIMARY KEY,
    Exam_Type VARCHAR(50),
    Claimed_Grade VARCHAR(5),
    Justification TEXT,
	Course_ID INT,
    Section_ID INT,
    FOREIGN KEY (Request_ID) REFERENCES Request(Request_ID),
    FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID)
);

-- Stores requests to increase course capacity
CREATE TABLE Raise_Capacity (
    Request_ID INT PRIMARY KEY,
    Course_ID INT,
    Section_ID INT,
    Reason TEXT,
    Requested_Section INT,
    Requested_Course INT,
    FOREIGN KEY (Request_ID) REFERENCES Request(Request_ID),
    FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID)
);

-- Stores course equivalency request details
CREATE TABLE Course_Equivalency (
    Request_ID INT PRIMARY KEY,
    Old_Course_ID INT,
    New_Course_ID INT,
    Old_Course_Syllabus TEXT,
    New_Course_Syllabus TEXT,
    FOREIGN KEY (Request_ID) REFERENCES Request(Request_ID),
    FOREIGN KEY (Old_Course_ID) REFERENCES Course(Course_ID),
    FOREIGN KEY (New_Course_ID) REFERENCES Course(Course_ID)
);

-- Stores program change request details
CREATE TABLE Program_Change (
    Request_ID INT PRIMARY KEY,
    Current_Program VARCHAR(100),
    Requested_Program VARCHAR(100),
    Transfer_Reason TEXT,
    FOREIGN KEY (Request_ID) REFERENCES Request(Request_ID)
);

-- Stores uploaded document metadata (files stored in MongoDB)
CREATE TABLE Document (
    Document_ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    File_Name VARCHAR(100),
    File_Type VARCHAR(50),
    Upload_Date DATE,
    Request_ID INT,
    Mongo_File_ID VARCHAR(100), -- reference to MongoDB
    FOREIGN KEY (Request_ID) REFERENCES Request(Request_ID)
);

-- Stores history of actions taken on requests
CREATE TABLE Request_History (
    History_ID INT PRIMARY KEY,
    Action_Type VARCHAR(50),
    Action_Date DATE,
    Request_ID INT,
    FOREIGN KEY (Request_ID) REFERENCES Request(Request_ID)
);

-- Stores notifications related to requests
CREATE TABLE Notification (
    Notification_ID INT PRIMARY KEY,
    Message TEXT,
    Notification_Type VARCHAR(50),
    Notification_Date DATE,
    Request_ID INT,
    FOREIGN KEY (Request_ID) REFERENCES Request(Request_ID)
);

-- Stores appeal requests submitted by students
CREATE TABLE Appeal (
    Appeal_ID INT PRIMARY KEY,
    Appeal_Reason TEXT,
    Appeal_Date DATE,
    Request_ID INT UNIQUE,
    FOREIGN KEY (Request_ID) REFERENCES Request(Request_ID)
);

-- Stores secretary-specific staff details
CREATE TABLE Secretary (
    Staff_ID INT PRIMARY KEY,
    Education_Level VARCHAR(50),
    Assign_Department VARCHAR(100),
    FOREIGN KEY (Staff_ID) REFERENCES Authorized_Staff(Staff_ID)
);

-- Stores instructor teaching assignments
CREATE TABLE Instructor (
    Staff_ID INT,
    Course_ID INT,
    Section_ID INT,
    PRIMARY KEY (Staff_ID, Course_ID, Section_ID),
    FOREIGN KEY (Staff_ID) REFERENCES Authorized_Staff(Staff_ID),
    FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID)
);

-- Stores head of department details
CREATE TABLE Head_Of_Department (
    Staff_ID INT PRIMARY KEY,
    Program_Supervised VARCHAR(100),
    FOREIGN KEY (Staff_ID) REFERENCES Authorized_Staff(Staff_ID)
);

-- Stores registration staff details
CREATE TABLE Registration_Staff (
    Staff_ID INT PRIMARY KEY,
    Service_Specialization VARCHAR(100),
    FOREIGN KEY (Staff_ID) REFERENCES Authorized_Staff(Staff_ID)
);

-- Stores decisions made on requests by staff
CREATE TABLE Decision (
    Decision_ID INT PRIMARY KEY,
    Decision_Type VARCHAR(50),
    Decision_Comment TEXT,
    Decision_Date DATE,
    Request_ID INT UNIQUE,
    Staff_ID INT,
    FOREIGN KEY (Request_ID) REFERENCES Request(Request_ID),
    FOREIGN KEY (Staff_ID) REFERENCES Authorized_Staff(Staff_ID)
);

-- Stores academic affairs committee details
CREATE TABLE Academic_Affairs_Committee (
    Committee_ID INT PRIMARY KEY,
    Committee_Name VARCHAR(100), 
    Committee_Members TEXT,
    Request_ID INT,
    FOREIGN KEY (Request_ID) REFERENCES Request(Request_ID)
);

-- Stores audit logs for system actions
CREATE TABLE Audit_Log (
    Log_ID INT PRIMARY KEY,
    Action_Type VARCHAR(50),
    Action_Timestamp DATETIME,
    Details TEXT,
    Performed_By INT,
    FOREIGN KEY (Performed_By) REFERENCES Authorized_Staff(Staff_ID)
);

-- Stores status of requests
CREATE TABLE Req_Status (
    Req_Status_ID INT PRIMARY KEY,
    Req_Status VARCHAR(50),
    Request_ID INT,
    FOREIGN KEY (Request_ID) REFERENCES Request(Request_ID)
);

-- Stores status of notifications
CREATE TABLE Notif_Status (
    Notif_Status_ID INT PRIMARY KEY,
    Notif_Status VARCHAR(50),
    Notification_ID INT,
    FOREIGN KEY (Notification_ID) REFERENCES Notification(Notification_ID)
);

-- Stores status of appeals
CREATE TABLE App_Status (
    App_Status_ID INT PRIMARY KEY,
    App_Status VARCHAR(50),
    Appeal_ID INT,
    FOREIGN KEY (Appeal_ID) REFERENCES Appeal(Appeal_ID)
);

-- Stores office location information for staff
CREATE TABLE Office_Location (
    Location_ID INT PRIMARY KEY,
    Office_Location VARCHAR(100),
    Staff_ID INT,
    FOREIGN KEY (Staff_ID) REFERENCES Authorized_Staff(Staff_ID)
);


