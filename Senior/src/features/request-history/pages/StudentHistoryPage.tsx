import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { AcademicRequest } from '../../../types';
import { sampleStudentHistory } from '../../../mocks/requests.mock';
import { FilterTab } from '../../../components/common/FilterTab';
import { ModalShell } from '../../../components/common/ModalShell';
import { HistoryStatusBadge } from '../components/HistoryStatusBadge';

interface StudentHistoryPageProps {
  searchQuery: string;
}

export const StudentHistoryPage: React.FC<StudentHistoryPageProps> = ({
  searchQuery,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCard, setSelectedCard] = useState<AcademicRequest | null>(null);

  const filters = [
    'All',
    'Raise Capacity',
    'Incomplete Exam',
    'Course Equivalency',
    'Grade Review',
    'Program Change',
    'Clear Filters',
  ];

  const handleFilterClick = (filter: string) => {
    if (filter === 'Clear Filters') {
      setSelectedFilter('All');
      setLocalSearch('');
    } else {
      setSelectedFilter(filter);
    }
  };

  const effectiveSearch = localSearch || searchQuery;

  const filteredHistory = sampleStudentHistory.filter((item) => {
    const matchesFilter =
      selectedFilter === 'All' ||
      selectedFilter === 'Clear Filters' ||
      item.type.toLowerCase().includes(selectedFilter.toLowerCase()) ||
      item.courseName.toLowerCase().includes(selectedFilter.toLowerCase());

    const matchesSearch =
      !effectiveSearch ||
      item.id.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      item.type.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      item.courseName.toLowerCase().includes(effectiveSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div id="student-history-page" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header & Local Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
            Request History
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Review the status and outcomes of all your submitted academic requests
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by request type or course..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {filters.map((filter) => (
          <FilterTab
            key={filter}
            label={filter}
            active={selectedFilter === filter}
            onClick={() => handleFilterClick(filter)}
            variant="bordered"
            clear={filter === 'Clear Filters'}
          />
        ))}
      </div>

      {/* Request History Cards Grid (4 items) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHistory.map((req, idx) => {
          return (
            <div
              key={idx}
              id={`student-history-card-${idx}`}
              onClick={() => setSelectedCard(req)}
              className="bg-white p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#059669] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono font-bold text-xs text-[#059669]">
                    {req.id}
                  </span>
                  <h3 className="font-bold text-sm text-[#1F2937] mt-1 group-hover:text-[#059669] transition-colors">
                    {req.type}
                  </h3>
                </div>

                <HistoryStatusBadge status={req.status} />
              </div>

              <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#6B7280]">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] text-[#9CA3AF] block uppercase font-medium">Submitted</span>
                    <span className="font-medium text-[#1F2937]">{req.submittedDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9CA3AF] block uppercase font-medium">Processed</span>
                    <span className="font-medium text-[#1F2937]">{req.processedDate}</span>
                  </div>
                </div>

                <button
                  className="p-2 rounded-xl bg-[#F9FAFB] group-hover:bg-[#059669] group-hover:text-white text-[#4B5563] transition-all"
                  aria-label="View request history details"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7280]">
        <div>
          Showing <span className="font-bold text-[#1F2937]">4</span> of{' '}
          <span className="font-bold text-[#1F2937]">24</span> requests
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                currentPage === num
                  ? 'bg-[#059669] text-white'
                  : 'bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3F4F6]'
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
            disabled={currentPage === 3}
            className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal View */}
      {selectedCard && (
        <ModalShell>
          <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
            <span className="font-mono font-bold text-xs text-[#059669]">
              {selectedCard.id}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                selectedCard.status === 'Approved'
                  ? 'bg-[#D1FAE5] text-[#059669]'
                  : selectedCard.status === 'Rejected'
                  ? 'bg-[#FEE2E2] text-[#EF4444]'
                  : 'bg-[#FEF3C7] text-[#D97706]'
              }`}
            >
              {selectedCard.status}
            </span>
          </div>
          <div className="my-4 flex flex-col gap-2 text-xs">
            <h4 className="font-bold text-sm text-[#1F2937]">{selectedCard.type}</h4>
            <p className="text-[#6B7280]">
              Submitted Date: <strong>{selectedCard.submittedDate}</strong>
            </p>
            <p className="text-[#6B7280]">
              Decision Date / Next Step: <strong>{selectedCard.processedDate}</strong>
            </p>
            <div className="p-3 bg-[#F9FAFB] rounded-xl text-[11px] text-[#4B5563]">
              {selectedCard.status === 'Approved'
                ? 'Request approved. Course enrollment / records have been updated automatically.'
                : selectedCard.status === 'Rejected'
                ? 'Request rejected. Contact your academic advisor for alternative schedule planning.'
                : 'Your request is currently being reviewed by the department head and committee.'}
            </div>
          </div>
          <div className="flex justify-end pt-3 border-t border-[#F3F4F6]">
            <button
              onClick={() => setSelectedCard(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#059669] text-white"
            >
              Close
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
};
