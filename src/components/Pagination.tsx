// src/components/Pagination.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-3 rounded-full bg-background shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] hover:-translate-y-0.5 active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed text-on-surface-variant hover:text-primary transition-all duration-300"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <span className="font-medium text-on-surface">
        Page <span className="font-bold text-primary">{currentPage}</span> of <span className="font-bold text-primary">{totalPages}</span>
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-3 rounded-full bg-background shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] hover:-translate-y-0.5 active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed text-on-surface-variant hover:text-primary transition-all duration-300"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}