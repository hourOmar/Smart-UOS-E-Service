import React, { useEffect, useState } from 'react';
import { UserRole } from '../../../types';
import { defaultStudentProfile } from '../../../mocks/students.mock';
import { supabase } from '../../../services/supabase/client';
import {
  getStudentByEmail,
  getAuthorizedStaffByEmail,
} from '../../../services/supabase/students';
import { getProgramById } from '../../../services/supabase/programs';
import { listStudentRequests } from '../../../services/supabase/requests';

interface ProfilePageProps {
  role: UserRole;
  onToast: (msg: string) => void;
}

function initialsFromName(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ role, onToast }) => {
  const isStudent = role === 'student';
  const [isEditing, setIsEditing] = useState(false);

  // ─── Student profile state ────────────────────────────────────────
  const [profile, setProfile] = useState({
    name: defaultStudentProfile.name,
    id: defaultStudentProfile.id,
    email: defaultStudentProfile.email,
    initials: defaultStudentProfile.initials,
    gpa: defaultStudentProfile.gpa,
    credits: defaultStudentProfile.credits,
    program: defaultStudentProfile.program,
    college: defaultStudentProfile.college,
  });
  const [totalRequests, setTotalRequests] = useState<number | null>(null);
  const [approvedRequests, setApprovedRequests] = useState<number | null>(null);

  // ─── Admin profile state ──────────────────────────────────────────
  const [adminProfile, setAdminProfile] = useState({
    name: '—',
    role: '—',
    email: '—',
    initials: '—',
    office: '—',
    staffId: '—',
  });

  // ─── Live counts for the admin overview cards ─────────────────────
  const [counts, setCounts] = useState({
    students: 0,
    courses: 0,
    sections: 0,
    requests: 0,
  });

  // ─── Load student data when the role is student ───────────────────
  useEffect(() => {
    if (!isStudent) return;
    let cancelled = false;

    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email;
      if (!email) return;

      try {
        const student = await getStudentByEmail(email);
        if (!student) return;

        let programName = defaultStudentProfile.program;
        let collegeName = defaultStudentProfile.college;
        if (student.Program_ID) {
          const program = await getProgramById(student.Program_ID);
          if (program) {
            programName = program.Program_Name;
            collegeName = program.College_Name;
          }
        }

        if (cancelled) return;
        setProfile({
          name: student.Student_Name,
          id: student.Student_ID,
          email: student.Student_Email,
          initials: initialsFromName(student.Student_Name),
          gpa: student.CGPA != null ? String(student.CGPA) : defaultStudentProfile.gpa,
          credits:
            student.Completed_Hours != null
              ? String(student.Completed_Hours)
              : defaultStudentProfile.credits,
          program: programName,
          college: collegeName,
        });

        const requests = await listStudentRequests(student.Student_ID);
        if (!cancelled) {
          setTotalRequests(requests.length);
          setApprovedRequests(
            requests.filter((r) => r.status === 'Completed').length
          );
        }
      } catch (err) {
        console.error('Failed to load student profile:', err);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [isStudent]);

  // ─── Load admin data when the role is admin ───────────────────────
  useEffect(() => {
    if (isStudent) return;
    let cancelled = false;

    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email;
      if (!email) return;

      try {
        const staff = await getAuthorizedStaffByEmail(email);
        if (!staff || cancelled) return;

        setAdminProfile({
          name: staff.Staff_Name,
          role: 'Authorized Staff',
          email: staff.Staff_Email,
          initials: initialsFromName(staff.Staff_Name),
          office: staff.Office_Location ?? '—',
          staffId: staff.Staff_ID,
        });
      } catch (err) {
        console.error('Failed to load admin profile:', err);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [isStudent]);

  // ─── Load live counts (admin only) ────────────────────────────────
  useEffect(() => {
    if (isStudent) return;

    (async () => {
      const [studentsRes, coursesRes, sectionsRes, requestsRes] = await Promise.all([
        supabase.from('Student').select('*', { count: 'exact', head: true }),
        supabase.from('Course').select('*', { count: 'exact', head: true }),
        supabase.from('Section').select('*', { count: 'exact', head: true }),
        supabase.from('Request').select('*', { count: 'exact', head: true }),
      ]);

      setCounts({
        students: studentsRes.count ?? 0,
        courses: coursesRes.count ?? 0,
        sections: sectionsRes.count ?? 0,
        requests: requestsRes.count ?? 0,
      });
    })();
  }, [isStudent]);

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
              {isStudent ? profile.initials : adminProfile.initials}
            </div>

            <div className="mb-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2937]">
                {isStudent ? profile.name : adminProfile.name}
              </h1>
              <p className="text-xs font-semibold text-[#6B7280] mt-0.5">
                {isStudent
                  ? `Student ID: ${profile.id}`
                  : `${adminProfile.role} • Staff ID: ${adminProfile.staffId}`}
              </p>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {isStudent
                  ? `${profile.program}`
                  : `Office: ${adminProfile.office}`}
              </p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                {isStudent ? profile.email : adminProfile.email}
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
        /* ─────────── STUDENT PROFILE CONTENT ─────────── */
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-2xl font-extrabold text-[#059669]">
                {profile.gpa}
              </span>
              <p className="text-xs text-[#6B7280] font-medium mt-1">Cumulative GPA</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-2xl font-extrabold text-[#059669]">
                {profile.credits}
              </span>
              <p className="text-xs text-[#6B7280] font-medium mt-1">Credits Completed</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-2xl font-extrabold text-[#059669]">
                {totalRequests ?? '—'}
              </span>
              <p className="text-xs text-[#6B7280] font-medium mt-1">Total Requests</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-2xl font-extrabold text-[#059669]">
                {approvedRequests ?? '—'}
              </span>
              <p className="text-xs text-[#6B7280] font-medium mt-1">Approved Petitions</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
            <h2 className="text-sm font-bold text-[#1F2937] pb-3 border-b border-[#F3F4F6] mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Full Name</span>
                  <span className="font-semibold text-[#1F2937]">{profile.name}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Email Address</span>
                  <span className="font-semibold text-[#1F2937] font-mono">{profile.email}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Student ID</span>
                  <span className="font-semibold text-[#1F2937] font-mono">{profile.id}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Program</span>
                  <span className="font-semibold text-[#1F2937]">{profile.program}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">College</span>
                  <span className="font-semibold text-[#1F2937]">{profile.college}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">CGPA</span>
                  <span className="font-semibold text-[#1F2937]">{profile.gpa}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ─────────── ADMIN PROFILE CONTENT ─────────── */
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-2xl font-extrabold text-[#059669]">
                {counts.students}
              </span>
              <p className="text-xs text-[#6B7280] font-medium mt-1">Registered Students</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-2xl font-extrabold text-[#059669]">
                {counts.courses}
              </span>
              <p className="text-xs text-[#6B7280] font-medium mt-1">Courses</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-2xl font-extrabold text-[#059669]">
                {counts.sections}
              </span>
              <p className="text-xs text-[#6B7280] font-medium mt-1">Sections</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-2xl font-extrabold text-[#059669]">
                {counts.requests}
              </span>
              <p className="text-xs text-[#6B7280] font-medium mt-1">Total Requests</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
            <h2 className="text-sm font-bold text-[#1F2937] pb-3 border-b border-[#F3F4F6] mb-4">
              Professional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Staff ID</span>
                  <span className="font-semibold text-[#1F2937] font-mono">{adminProfile.staffId}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Email</span>
                  <span className="font-semibold text-[#1F2937] font-mono">{adminProfile.email}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Role</span>
                  <span className="font-semibold text-[#1F2937]">{adminProfile.role}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] text-[11px] font-medium block">Office Location</span>
                  <span className="font-semibold text-[#1F2937]">{adminProfile.office}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};