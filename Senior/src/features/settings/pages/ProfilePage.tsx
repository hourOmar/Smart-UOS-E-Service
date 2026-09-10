import React, { useState } from 'react';
import { UserRole } from '../../../types';
import { defaultStudentProfile } from '../../../mocks/students.mock';
import { defaultAdminProfile } from '../../../mocks/admins.mock';
interface ProfilePageProps {
  role: UserRole;
  onToast: (msg: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ role, onToast }) => {
  const isStudent = role === 'student';
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div id="profile-page" className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
      {/* Top Banner & Profile Overview */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-xs">
        <div className="h-32 bg-gradient-to-r from-[#059669] to-[#10B981] relative">
          <div className="absolute inset-0 bg-black/5" />
        </div>

        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div
              id="profile-avatar-circle"
              className="w-24 h-24 rounded-full bg-[#059669] border-4 border-white text-white flex items-center justify-center text-2xl font-black shadow-md"
            >
              {isStudent ? defaultStudentProfile.initials : defaultAdminProfile.initials}
            </div>

            <div className="mb-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2937]">
                {isStudent ? defaultStudentProfile.name : defaultAdminProfile.name}
              </h1>
              <p className="text-xs font-semibold text-[#6B7280] mt-0.5">
                {isStudent
                  ? `Student ID: ${defaultStudentProfile.id}`
                  : defaultAdminProfile.role}
              </p>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {isStudent
                  ? `${defaultStudentProfile.department} | ${defaultStudentProfile.year}`
                  : `${defaultAdminProfile.department} | ${defaultAdminProfile.office}`}
              </p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                {isStudent
                  ? `${defaultStudentProfile.email} | ${defaultStudentProfile.phone}`
                  : `${defaultAdminProfile.email} | ${defaultAdminProfile.phone}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
            <button
              onClick={() => onToast('Password change security email dispatched.')}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] text-[#4B5563] text-xs font-bold transition-all"
            >
              Change Password
            </button>
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                onToast(isEditing ? 'Profile changes saved.' : 'Editing mode active.');
              }}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-sm transition-all"
            >
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      {isStudent ? (
        /* STUDENT PROFILE CONTENT */
        <>
          {/* 4 Stat Cards in a row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-2xl font-extrabold text-[#059669]">
                {defaultStudentProfile.gpa}
              </span>
              <p className="text-xs text-[#6B7280] font-medium mt-1">Cumulative GPA</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-2xl font-extrabold text-[#059669]">
                {defaultStudentProfile.credits}
              </span>
              <p className="text-xs text-[#6B7280] font-medium mt-1">Credits Completed</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-2xl font-extrabold text-[#059669]">
                [12]
              </span>
              <p className="text-xs text-[#6B7280] font-medium mt-1">Total Requests</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-2xl font-extrabold text-[#059669]">
                [6]
              </span>
              <p className="text-xs text-[#6B7280] font-medium mt-1">Approved Petitions</p>
            </div>
          </div>

          {/* Personal Information Card (2 columns) */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
            <h2 className="text-sm font-bold text-[#1F2937] pb-3 border-b border-[#F3F4F6] mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Full Name</span>
                  <span className="font-semibold text-[#1F2937]">{defaultStudentProfile.name}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Nationality</span>
                  <span className="font-semibold text-[#1F2937]">{defaultStudentProfile.nationality}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Email Address</span>
                  <span className="font-semibold text-[#1F2937] font-mono">{defaultStudentProfile.email}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Date of Birth</span>
                  <span className="font-semibold text-[#1F2937]">{defaultStudentProfile.dob}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Enrollment Date</span>
                  <span className="font-semibold text-[#1F2937]">{defaultStudentProfile.enrollment}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Phone Number</span>
                  <span className="font-semibold text-[#1F2937]">{defaultStudentProfile.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information Card (2 columns) */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
            <h2 className="text-sm font-bold text-[#1F2937] pb-3 border-b border-[#F3F4F6] mb-4">
              Academic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Degree Program</span>
                  <span className="font-semibold text-[#1F2937]">{defaultStudentProfile.program}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Academic Standing</span>
                  <span className="font-bold text-[#059669] bg-[#D1FAE5] px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                    {defaultStudentProfile.standing}
                  </span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Expected Graduation</span>
                  <span className="font-semibold text-[#1F2937]">{defaultStudentProfile.graduation}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Faculty & College</span>
                  <span className="font-semibold text-[#1F2937]">{defaultStudentProfile.college}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Academic Advisor</span>
                  <span className="font-semibold text-[#1F2937]">{defaultStudentProfile.advisor}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Current Semester</span>
                  <span className="font-semibold text-[#1F2937]">{defaultStudentProfile.semester}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ADMIN PROFILE CONTENT */
        <>
          {/* Department Overview stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-2xl font-extrabold text-[#059669]">
                {defaultAdminProfile.facultyMembers}
              </span>
              <p className="text-xs text-[#6B7280] font-medium mt-1">Faculty Members</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-2xl font-extrabold text-[#059669]">
                {defaultAdminProfile.studentsCount}
              </span>
              <p className="text-xs text-[#6B7280] font-medium mt-1">Enrolled Students</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-2xl font-extrabold text-[#059669]">
                {defaultAdminProfile.coursesCount}
              </span>
              <p className="text-xs text-[#6B7280] font-medium mt-1">Offered Courses</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-2xl font-extrabold text-[#059669]">
                {defaultAdminProfile.programsCount}
              </span>
              <p className="text-xs text-[#6B7280] font-medium mt-1">Active Programs</p>
            </div>
          </div>

          {/* Professional & Academic Qualifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <h2 className="text-sm font-bold text-[#1F2937] pb-3 border-b border-[#F3F4F6] mb-4">
                Professional Information
              </h2>
              <div className="flex flex-col gap-3 text-xs">
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Administrative Title</span>
                  <span className="font-semibold text-[#1F2937]">{defaultAdminProfile.role}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Office Location</span>
                  <span className="font-semibold text-[#1F2937]">{defaultAdminProfile.office}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Department</span>
                  <span className="font-semibold text-[#1F2937]">{defaultAdminProfile.department}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Academic Qualification</span>
                  <span className="font-semibold text-[#1F2937]">{defaultAdminProfile.qualification}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
              {/*
                PLACEHOLDER ACTIVITY FEED
                TODO: Replace with data returned by the FastAPI backend.
                Future source: FastAPI backend (audit/activity log).
                Persistence: TBD — backend persistence decision.
              */}
              <h2 className="text-sm font-bold text-[#1F2937] pb-3 border-b border-[#F3F4F6] mb-4">
                Recent Administrative Activity
              </h2>
              <div className="flex flex-col gap-3 text-xs">
                <div className="p-2.5 bg-[#F9FAFB] rounded-xl">
                  <p className="font-semibold text-[#1F2937]">Approved Capacity for Section 31</p>
                  <span className="text-[10px] text-[#6B7280]">2 hours ago • Programming I</span>
                </div>
                <div className="p-2.5 bg-[#F9FAFB] rounded-xl">
                  <p className="font-semibold text-[#1F2937]">Reviewed Medical Petition #IE-2026-042</p>
                  <span className="text-[10px] text-[#6B7280]">Yesterday • Calculus I</span>
                </div>
                <div className="p-2.5 bg-[#F9FAFB] rounded-xl">
                  <p className="font-semibold text-[#1F2937]">Updated Course Schedule Capacity Limits</p>
                  <span className="text-[10px] text-[#6B7280]">3 days ago • Registrar Portal</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
