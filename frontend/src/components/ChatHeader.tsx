
interface ChatHeaderProps {
  onToggleSidebar: () => void;
}

export default function ChatHeader({ onToggleSidebar }: ChatHeaderProps) {
  return (
    <header className="h-12 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
      <button 
        onClick={onToggleSidebar}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </header>
  );
}