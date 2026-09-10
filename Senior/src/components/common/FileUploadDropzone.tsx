import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploadDropzoneProps {
  fileName: string;
  placeholderText: string;
  hintText: string;
}

/**
 * Static file-upload dropzone box shared by StudentRaiseCapacityForm
 * and StudentIncompleteExamForm (identical markup before this
 * extraction; only placeholder/hint text differ). Purely
 * presentational — no click handler or real file input is wired up
 * in either original, and none was added here. Actual upload/storage
 * behavior (Supabase Storage or otherwise) remains future backend
 * work, not in scope for this frontend refactor.
 */
export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  fileName,
  placeholderText,
  hintText,
}) => (
  <div className="p-4 rounded-xl border-2 border-dashed border-[#D1D5DB] hover:border-[#059669] bg-[#F9FAFB] flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
    <Upload className="w-6 h-6 text-[#9CA3AF] mb-1.5" />
    <p className="text-xs font-semibold text-[#1F2937]">{fileName ? fileName : placeholderText}</p>
    <p className="text-[10px] text-[#9CA3AF] mt-0.5">{hintText}</p>
  </div>
);
