import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  Home,
  FileText,
} from 'lucide-react';
import { SubmittedRequestData } from '../../../types';

/**
 * This is an ephemeral success screen, not a persistent detail page —
 * the submitted request payload is carried via React Router's
 * `location.state` (set by whichever form just submitted) rather than
 * a route param, per Phase 6 scope. Reaching this route directly
 * (e.g. a refresh) has no state, so it falls back to the same generic
 * placeholder summary this page already showed before routing existed.
 */
export const RequestSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const requestData = location.state as SubmittedRequestData | undefined;

  /**
   * PLACEHOLDER FALLBACK DATA
   *
   * Only rendered when there's no `location.state` (direct visit or a
   * refresh — see the file-top comment). Not a mock to be "replaced
   * by a backend call" the way other mocks are: this is a UI-only
   * fallback for an edge case with no real request behind it, and
   * should remain a static placeholder even after FastAPI exists.
   */
  const req = requestData || {
    requestId: '[#GR-2026-035]',
    requestType: 'Grade Review Request',
    course: '[CS-301] - [Database Management Systems]',
    submittedDate: '[Feb 15, 2026]',
    estimatedProcessing: '[5-7 Working Days]',
    status: 'Pending Review',
    details: 'Final grade clerical audit request submitted.',
  };

  return (
    <div id="student-success-page" className="p-6 max-w-2xl mx-auto flex flex-col gap-6 items-center">
      {/* Centered Success Hero Card */}
      <div className="w-full bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-xs text-center flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-full bg-[#D1FAE5] text-[#059669] flex items-center justify-center shadow-inner">
          <CheckCircle className="w-12 h-12 stroke-[2.5]" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight mt-2">
          Request Submitted Successfully!
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] max-w-lg leading-relaxed">
          Your <strong className="text-[#059669] font-bold">{req.requestType}</strong> has been registered and routed to the Academic Committee.
        </p>
      </div>

      {/* Request Summary Box */}
      <div className="w-full bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
          <h2 className="text-sm font-bold text-[#1F2937]">Request Summary</h2>
          <span className="font-mono font-extrabold text-xs text-[#059669] bg-[#D1FAE5] px-3.5 py-1.5 rounded-xl">
            {req.requestId}
          </span>
        </div>

        {/* Request Details Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F9FAFB] p-5 rounded-2xl border border-[#E5E7EB] text-xs">
          <div>
            <span className="text-[#9CA3AF] text-[10px] uppercase font-bold block">Request Type</span>
            <span className="font-bold text-[#1F2937] mt-0.5 block">{req.requestType}</span>
          </div>

          <div>
            <span className="text-[#9CA3AF] text-[10px] uppercase font-bold block">Course / Program</span>
            <span className="font-semibold text-[#1F2937] mt-0.5 block">{req.course}</span>
          </div>

          <div>
            <span className="text-[#9CA3AF] text-[10px] uppercase font-bold block">Submitted</span>
            <span className="font-medium text-[#1F2937] mt-0.5 block">{req.submittedDate}</span>
          </div>

          <div>
            <span className="text-[#9CA3AF] text-[10px] uppercase font-bold block">Estimated Processing</span>
            <span className="font-bold text-[#059669] mt-0.5 block">{req.estimatedProcessing}</span>
          </div>

          <div className="sm:col-span-2 pt-2 border-t border-[#E5E7EB] flex items-center justify-between">
            <span className="text-[#9CA3AF] text-[10px] uppercase font-bold">Current Status</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#D97706] inline-flex items-center gap-1.5 border border-[#F59E0B]/30">
              <Clock className="w-3.5 h-3.5" />
              {req.status}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex items-center justify-center gap-3 pt-2">
        <button
          onClick={() => navigate('/student/history')}
          className="px-6 py-3 rounded-2xl border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] text-[#4B5563] text-xs font-bold shadow-xs transition-all flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>View Details</span>
        </button>

        <button
          onClick={() => navigate('/student/dashboard')}
          className="px-8 py-3 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </div>
  );
};
