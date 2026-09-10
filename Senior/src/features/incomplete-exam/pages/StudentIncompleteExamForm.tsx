import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Check,
} from 'lucide-react';
import { SubmittedRequestData } from '../../../types';
import { courses } from '../mocks/incompleteExam.mock';
import { BackLink } from '../../../components/common/BackLink';
import { FileUploadDropzone } from '../../../components/common/FileUploadDropzone';

interface StudentIncompleteExamFormProps {
  onToast: (msg: string) => void;
}

export const StudentIncompleteExamForm: React.FC<StudentIncompleteExamFormProps> = ({
  onToast,
}) => {
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState<string>('All Departments');
  const [reasonType, setReasonType] = useState<string>('Medical Emergency');
  const [explanation, setExplanation] = useState<string>(
    'I experienced severe acute viral gastroenteritis with hospitalization at University Hospital Sharjah on the exam day.'
  );
  const [proposedDate, setProposedDate] = useState<string>('2026-03-24');
  const [proposedTime, setProposedTime] = useState<string>('10:00 AM');
  const [altDate, setAltDate] = useState<string>('2026-03-26');
  const [altTime, setAltTime] = useState<string>('02:00 PM');
  // Setter intentionally unused: the dropzone below is a static
  // placeholder with no file-picker wired up (see FileUploadDropzone.tsx).
  const [uploadedFile] = useState<string>('Hospital_Medical_Discharge_Summary.pdf');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [selectedCourse, setSelectedCourse] = useState(courses[0]);

  const departments = [
    'All Departments',
    'Computer Science',
    'Engineering',
    'Mathematics',
    'Sciences',
  ];

  const filteredCourses = courses.filter((c) => {
    if (selectedDept === 'All Departments') return true;
    return c.department === selectedDept;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!explanation.trim()) {
      setErrorMsg('Please provide a detailed explanation.');
      return;
    }

    const payload: SubmittedRequestData = {
      requestId: '#IE-2026-095',
      requestType: 'Incomplete Exam',
      course: `${selectedCourse.code} - ${selectedCourse.name} (${selectedCourse.section})`,
      submittedDate: 'Mar 16, 2026',
      estimatedProcessing: '3-5 business days',
      status: 'Pending Committee Review',
      details: explanation,
    };

    onToast('Petition submitted successfully to academic committee.');
    navigate('/student/requests/success', { state: payload });
  };

  return (
    <div id="student-incomplete-exam-page" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Back button & Header */}
      <div>
        <BackLink onClick={() => navigate('/student/dashboard')} variant="tight">
          Back to Dashboard
        </BackLink>
        <h1 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
          Incomplete Exam Request
        </h1>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Submit petition and supporting medical documentation for final make-up examination
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Course Selection (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F3F4F6]">
              <span className="text-lg">📚</span>
              <h2 className="font-bold text-sm text-[#1F2937]">Select Course</h2>
            </div>

            {/* Department filters */}
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

            {/* Course List */}
            <div className="flex flex-col gap-2.5 max-h-[480px] overflow-y-auto pr-1">
              {filteredCourses.map((c) => {
                const isSelected = selectedCourse.code === c.code;

                return (
                  <div
                    key={c.code}
                    onClick={() => setSelectedCourse(c)}
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
                            {c.code}
                          </span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#E0F2FE] text-[#0284C7]">
                            {c.section}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-[#1F2937] mt-0.5">{c.name}</h4>
                        <p className="text-[11px] text-[#6B7280]">{c.instructor}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#059669] text-white flex items-center justify-center text-xs shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#6B7280] pt-1.5 border-t border-[#E5E7EB]/60">
                      <span>Exam Date: <strong className="text-[#1F2937]">{c.examDate}</strong></span>
                      <span className="font-semibold text-[#059669]">Standing: {c.standing}</span>
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
                Selected Course For Make-up Exam
              </span>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0C4A6E]">
                    {selectedCourse.code} - {selectedCourse.name}
                  </h3>
                  <p className="text-xs text-[#0369A1] mt-0.5">
                    Instructor: {selectedCourse.instructor} • {selectedCourse.section}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white text-[#0284C7] shadow-xs block">
                    Standing: {selectedCourse.standing}
                  </span>
                </div>
              </div>
            </div>

            {/* Reason for Incomplete Exam */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#1F2937]">
                Reason for Incomplete Exam <span className="text-[#EF4444]">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['Medical Emergency', 'Personal Emergency', 'Other'].map((type) => (
                  <label
                    key={type}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs transition-all ${
                      reasonType === type
                        ? 'bg-[#F0FDF4] border-[#059669] text-[#059669] font-bold ring-1 ring-[#059669]'
                        : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#4B5563]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason-group"
                      value={type}
                      checked={reasonType === type}
                      onChange={() => setReasonType(type)}
                      className="accent-[#059669] w-3.5 h-3.5"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Detailed Explanation */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1F2937]">
                Detailed Explanation <span className="text-[#EF4444]">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Provide comprehensive circumstances and medical facility details..."
                className="w-full p-3.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              />
            </div>

            {/* Medical Documentation */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1F2937]">
                Medical Documentation (Stamped Hospital Report) <span className="text-[#EF4444]">*</span>
              </label>
              <FileUploadDropzone
                fileName={uploadedFile}
                placeholderText="Upload stamped medical excuse certificate (PDF/JPG)"
                hintText="Must be verified by Sharjah Ministry of Health or University Clinic"
              />
            </div>

            {/* Proposed Dates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Proposed Make-up Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1F2937]">
                  Proposed Make-up Date
                </label>
                <input
                  type="date"
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#059669]/20"
                />
                <select
                  value={proposedTime}
                  onChange={(e) => setProposedTime(e.target.value)}
                  className="px-3.5 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#1F2937] mt-1"
                >
                  <option value="09:00 AM">09:00 AM - 11:00 AM</option>
                  <option value="10:00 AM">10:00 AM - 12:00 PM</option>
                  <option value="01:00 PM">01:00 PM - 03:00 PM</option>
                  <option value="03:00 PM">03:00 PM - 05:00 PM</option>
                </select>
              </div>

              {/* Alternative Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1F2937]">
                  Alternative Date (Fallback)
                </label>
                <input
                  type="date"
                  value={altDate}
                  onChange={(e) => setAltDate(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#059669]/20"
                />
                <select
                  value={altTime}
                  onChange={(e) => setAltTime(e.target.value)}
                  className="px-3.5 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#1F2937] mt-1"
                >
                  <option value="02:00 PM">02:00 PM - 04:00 PM</option>
                  <option value="11:00 AM">11:00 AM - 01:00 PM</option>
                  <option value="04:00 PM">04:00 PM - 06:00 PM</option>
                </select>
              </div>
            </div>

            {/* Current Course Standing Banner */}
            <div className="p-3.5 rounded-xl bg-[#FEF3C7]/60 border border-[#F59E0B]/30 flex items-center justify-between text-xs text-[#92400E]">
              <span>Course Standing (without final exam): <strong>{selectedCourse.standing}</strong></span>
              <span>Instructor: <strong>{selectedCourse.instructor}</strong></span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/student/dashboard')}
                className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] text-[#4B5563] text-xs font-bold"
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
