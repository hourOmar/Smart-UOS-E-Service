import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  AlertCircle,
} from 'lucide-react';
import { SubmittedRequestData } from '../../../types';
import { CourseCapacityItem } from '../types/raiseCapacity.types';
import { coursesList } from '../mocks/courses.mock';
import { BackLink } from '../../../components/common/BackLink';
import { FileUploadDropzone } from '../../../components/common/FileUploadDropzone';
import { supabase } from '../../../services/supabase/client';
import { createRaiseCapacityRequest } from '../../../services/supabase/requests';
import { getStudentByEmail } from '../../../services/supabase/students';

interface StudentRaiseCapacityFormProps {
  onToast: (msg: string) => void;
}

export const StudentRaiseCapacityForm: React.FC<StudentRaiseCapacityFormProps> = ({
  onToast,
}) => {
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState<string>('All Departments');
  const [selectedCourse, setSelectedCourse] = useState<CourseCapacityItem>(coursesList[0]);
  const [justification, setJustification] = useState<string>(
    'I need this course to meet graduation prerequisites for next semester and there are no alternative open sections compatible with my degree plan.'
  );
  const [priority, setPriority] = useState<string>('High');
  // Setter intentionally unused: the dropzone below is a static
  // placeholder with no file-picker wired up (see FileUploadDropzone.tsx).
  const [uploadedFile] = useState<string>('Graduation_Plan_Audit.pdf');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const departments = [
    'All Departments',
    'Computer Science',
    'Engineering',
    'Mathematics',
    'Sciences',
    'Business',
  ];

  const filteredCourses = coursesList.filter((c) => {
    if (selectedDept === 'All Departments') return true;
    return c.department === selectedDept;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!justification.trim()) {
      setErrorMsg('Please provide a justification for your request.');
      return;
    }

    setErrorMsg('');

    try {
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email;
      if (!email) throw new Error('Your session has expired. Please sign in again.');

      const student = await getStudentByEmail(email);
      const studentId = student?.Student_id ?? email.split('@')[0];
      const submittedDate = new Date().toISOString().slice(0, 10);
      const requestId = Date.now() % 2147483647;
      const sectionId = Number.parseInt(selectedCourse.section.replace(/\D/g, ''), 10);

      if (Number.isNaN(sectionId)) {
        throw new Error(`The selected section "${selectedCourse.section}" has no numeric section ID.`);
      }

      await createRaiseCapacityRequest({
        requestId,
        studentId,
        courseId: Number.parseInt(selectedCourse.code, 10),
        sectionId,
        reason: justification,
        submittedDate,
      });

      const payload: SubmittedRequestData = {
        requestId: String(requestId),
        requestType: 'Raise Capacity',
        course: `${selectedCourse.code} - ${selectedCourse.name} (${selectedCourse.section})`,
        submittedDate,
        estimatedProcessing: '1-2 business days',
        status: 'Pending Review',
        details: justification,
      };

      onToast('Petition submitted successfully to academic committee.');
      navigate('/student/requests/success', { state: payload });
    } catch (error) {
      const supabaseError = error as {
        message?: string;
        code?: string;
        details?: string;
        hint?: string;
      };
      const details = [supabaseError.code, supabaseError.message, supabaseError.details, supabaseError.hint]
        .filter(Boolean)
        .join(' - ');
      setErrorMsg(details || 'Unable to submit the request.');
    }
  };

  return (
    <div id="student-raise-capacity-page" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Back button & Page Title */}
      <div>
        <BackLink onClick={() => navigate('/student/dashboard')} variant="tight">
          Back to Dashboard
        </BackLink>
        <h1 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
          Raise Capacity Request
        </h1>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Select a course to request capacity increase
        </p>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Course Selection (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F3F4F6]">
              <span className="text-lg">📚</span>
              <h2 className="font-bold text-sm text-[#1F2937]">Select Course</h2>
            </div>

            {/* Department Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs font-semibold">
              {departments.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] transition-all ${
                    selectedDept === dept
                      ? 'bg-[#059669] text-white shadow-xs'
                      : 'bg-[#F9FAFB] border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Scrollable Course List */}
            <div className="flex flex-col gap-2.5 max-h-[480px] overflow-y-auto pr-1">
              {filteredCourses.map((course) => {
                const isSelected = selectedCourse.code === course.code;

                return (
                  <div
                    key={course.code}
                    onClick={() => setSelectedCourse(course)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-[#F0FDF4] border-[#059669] shadow-sm ring-1 ring-[#059669]'
                        : 'bg-[#F9FAFB] border-[#E5E7EB] hover:bg-white hover:border-[#D1D5DB]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#059669]">
                            {course.code}
                          </span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#E0F2FE] text-[#0284C7]">
                            {course.section}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-[#1F2937] mt-0.5">
                          {course.name}
                        </h4>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#059669] text-white flex items-center justify-center text-xs shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#6B7280] pt-1 border-t border-[#E5E7EB]/60">
                      <span>Seats: <strong className="text-[#1F2937]">{course.capacity}</strong></span>
                      <span className="text-[#D97706] font-semibold">{course.pendingRequests} pending</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Request Form (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-5"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-[#F3F4F6]">
              <span className="text-lg">📝</span>
              <h2 className="font-bold text-sm text-[#1F2937]">Request Details</h2>
            </div>

            {errorMsg && (
              <div className="p-3 bg-[#FEE2E2] border border-[#EF4444]/30 rounded-xl text-xs text-[#EF4444] font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Selected Course Preview (Light Blue Box) */}
            <div className="p-4 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-[#0284C7] uppercase tracking-wider">
                Selected Course for Capacity Increase
              </span>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0C4A6E]">
                    {selectedCourse.code} - {selectedCourse.name}
                  </h3>
                  <p className="text-xs text-[#0369A1] mt-0.5">
                    {selectedCourse.section} • {selectedCourse.schedule} • {selectedCourse.room}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white text-[#0284C7] shadow-xs">
                  {selectedCourse.capacity}
                </span>
              </div>
            </div>

            {/* Justification for Request */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1F2937]">
                Justification for Request <span className="text-[#EF4444]">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Explain why you need a seat in this specific section (e.g. graduation requirement, prerequisite progression)..."
                className="w-full p-3.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] resize-y leading-relaxed"
              />
            </div>

            {/* Supporting Documents (Optional) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1F2937]">
                Supporting Documents (Optional)
              </label>
              <FileUploadDropzone
                fileName={uploadedFile}
                placeholderText="Click or drag degree audit / study plan"
                hintText="PDF, PNG or JPG up to 5MB"
              />
            </div>

            {/* Priority Level */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1F2937]">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              >
                <option value="High">High Priority (Graduating this academic year)</option>
                <option value="Medium">Medium Priority (Core major requirement)</option>
                <option value="Low">Low Priority (Elective course preference)</option>
              </select>
            </div>

            {/* Request Summary Box */}
            <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex flex-col gap-2 text-xs">
              <h4 className="font-bold text-xs text-[#1F2937]">Request Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[#9CA3AF] block">Request Type:</span>
                  <span className="font-semibold text-[#1F2937]">Raise Capacity</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] block">Course:</span>
                  <span className="font-semibold text-[#1F2937]">{selectedCourse.code} ({selectedCourse.section})</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] block">Current Capacity:</span>
                  <span className="font-semibold text-[#1F2937]">{selectedCourse.capacity}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] block">Estimated Processing:</span>
                  <span className="font-semibold text-[#059669]">[1-2 days]</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/student/dashboard')}
                className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] text-[#4B5563] text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
