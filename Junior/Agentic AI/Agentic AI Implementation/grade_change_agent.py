from openai import OpenAI
import subprocess
import json
import re
import time

# -------------------------
# LLM
# -------------------------
client = OpenAI()

def llm_extract(request_text):
    # Prompt instructs LLM to extract structured data from natural language input
    prompt = f"""
    Extract the following from the text:
    - student_id (format: U########)
    - course_id (numbers only)
    - section_id (numbers only)
    - request_type (must be "grade_change" or "other")

    Return ONLY valid JSON:
    {{
        "student_id": "...",
        "course_id": "...",
        "section_id": "...",
        "request_type": "..."
    }}

    Text:
    {request_text}
    """

    # Call LLM to process input
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    # Return cleaned output
    return response.choices[0].message.content.strip()

# -------------------------
# SQL (CLI)
# -------------------------
def run_sql(query):
    # Executes SQL query using MySQL CLI
    command = f'mysql -u root -D Smart_UoS -e "{query}"'
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    return result.stdout

def get_student(student_id):
    # Retrieves student name from SQL database
    return run_sql(f"SELECT Student_Name FROM Student WHERE Student_ID = '{student_id}';")


def get_course_name(course_id):
    # Retrieves course name from SQL database
    output = run_sql(f"SELECT Course_Name FROM Course WHERE Course_ID = {course_id};")
    lines = [line.strip() for line in output.split("\n") if line.strip()]
    if len(lines) >= 2:
        return lines[1]
    return "Unknown Course"


# -------------------------
# STUDENT NAME
# -------------------------
def extract_student_name(student_raw):
    lines = [line.strip() for line in student_raw.split("\n") if line.strip()]
    if len(lines) >= 2:
        return lines[1]
    return "Unknown"


# -------------------------
# MongoDB
# -------------------------
from pymongo import MongoClient

# Persistent MongoDB connection (avoids reconnect overhead and reduces execution time)
mongo_client = MongoClient(
    "mongodb://root:0zOBvPFLIHBhAoXINdJPHU7I@172.21.212.248:27017/"
)

def get_transcript_grade(student_id, course_id):
    try:
        db = mongo_client["Smart_UoS"]
        collection = db["transcripts"]

        # Find student's transcript
        doc = collection.find_one({"student_id": student_id})

        # Search for matching course inside array (transcript)
        if doc:
            for course in doc["courses"]:
                if course["course_id"] == int(course_id):
                    return course["grade"]

        return "N/A"

    except Exception as e:
        print("Mongo error:", e)
        return "N/A"

# -------------------------
# OUTPUT PARSER
# -------------------------
def parse_output(output):
    try:
        # Extract JSON block from LLM response
        json_text = re.search(r'\{.*\}', output, re.DOTALL).group()
        return json.loads(json_text)
    except:
        print("Parsing failed:", output)
        return None


# -------------------------
# MAIN AGENT
# -------------------------
def academic_agent(user_input):

    start_time = time.time() # Start timing execution

    # Step 1: LLM extraction
    llm_output = llm_extract(user_input)
    data = parse_output(llm_output)

    # Validate extracted data
    if not data or not all(k in data for k in ["student_id", "course_id", "section_id", "request_type"]):
        print("Invalid extraction from LLM")
        return

    print("Extracted Data:", data)

    # Step 2: Validate request type (only process grade change requests)
    if data["request_type"].lower() != "grade_change":
        print("\nRequest invalid: Not a grade change request\n")
        return

    # Step 3: Retrieve student and course info from SQL
    student_raw = get_student(data["student_id"])
    student_name = extract_student_name(student_raw)

    course_name = get_course_name(int(data["course_id"]))

    # Step 4: Retrieve transcript grade from MongoDB
    transcript_grade = get_transcript_grade(
        data["student_id"],
        data["course_id"]
    )

    # -------------------------
    # FINAL OUTPUT
    # -------------------------
    print("\n===== Grade Change Academic Eligibility Result =====\n")
    print(f"Student ID: {data['student_id']}")
    print(f"Student Name: {student_name}")
    print(f"Course: {course_name} ({data['course_id']})")
    print(f"Section ID: {data['section_id']}")
    print(f"Transcript Grade: {transcript_grade}")
    print("\n======================================\n")

    end_time = time.time()
    print("Execution time:", round(end_time - start_time, 2), "seconds")

# -------------------------
# RUN
# -------------------------
academic_agent("Student U24011234 is requesting a grade change for course 1501318 in section 31")
