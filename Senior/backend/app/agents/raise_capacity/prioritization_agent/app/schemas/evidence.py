"""
Aggregated Supabase evidence for a single Raise Capacity request.

This is NOT the final Agent 2 evidence package — it is only the Supabase
portion. Later phases add UoS study-plan evidence, deterministic
calculations, course-offering evidence, and the prioritization rules.
"""

from typing import Optional

from pydantic import BaseModel

from app.schemas.academic_history import PreviousAttemptsSummary
from app.schemas.course import CourseInfo
from app.schemas.program import ProgramInfo
from app.schemas.raise_capacity import RaiseCapacityDetails
from app.schemas.request import RequestRecord
from app.schemas.section import SectionInfo
from app.schemas.student import StudentAcademicProfile


class SupabaseEvidence(BaseModel):
    request: RequestRecord
    raise_capacity: RaiseCapacityDetails
    student: StudentAcademicProfile
    program: Optional[ProgramInfo]
    course: CourseInfo
    section: SectionInfo
    previous_attempts: PreviousAttemptsSummary
