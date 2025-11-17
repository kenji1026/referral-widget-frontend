import { ChevronLeft, X } from "lucide-react";

export interface AppHeaderProps {
  title: string;
  showBackButton: boolean;
  onBack?: () => void;
  onClose: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBackButton,
  onBack,
  onClose,
}) => (
  <header className="flex items-center justify-between">
    {showBackButton ? (
      <button
        onClick={onBack}
        className="rounded-full hover:bg-gray-200 transition-colors text-gray-400"
      >
        <ChevronLeft size={32} />
      </button>
    ) : (
      <div className="w-6" />
    )}
    <h1 className="text-lg font-bold text-gray-800">{title}</h1>
    <button
      onClick={onClose}
      className="rounded-full hover:bg-gray-200 transition-colors text-gray-400"
    >
      <X size={32} />
    </button>
  </header>
);
