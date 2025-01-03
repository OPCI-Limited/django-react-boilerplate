import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface DropdownEditMenuProps {
  children: React.ReactNode;
}

const DropdownEditMenu: React.FC<DropdownEditMenuProps> = ({ children }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
          <span className="sr-only">Open menu</span>
          <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="2" />
            <circle cx="10" cy="16" r="2" />
            <circle cx="22" cy="16" r="2" />
          </svg>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="min-w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg z-50"
        sideOffset={8}
      >
        {children}
        <DropdownMenu.Arrow className="fill-current text-gray-200 dark:text-gray-700" />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default DropdownEditMenu;
