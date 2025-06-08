import { Button } from "#components/ui/button";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: SimplePaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => onPageChange(1)}
          disabled={!canGoPrevious || isLoading}
        >
          <span className="sr-only">Go to first page</span>
          <DoubleArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious || isLoading}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext || isLoading}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext || isLoading}
        >
          <span className="sr-only">Go to last page</span>
          <DoubleArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 