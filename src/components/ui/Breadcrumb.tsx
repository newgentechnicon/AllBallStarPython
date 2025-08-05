import Link from 'next/link';

// Define the type for a single breadcrumb link
type BreadcrumbPath = {
  name: string;
  href?: string; // The link is optional for the last item
};

interface BreadcrumbProps {
  paths: BreadcrumbPath[];
  className?: string;
}

// SVG separator component
const SeparatorIcon = () => (
  <svg className="shrink-0 size-5 text-gray-400 dark:text-neutral-600 mx-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6 13L10 3" stroke="currentColor" strokeLinecap="round"></path>
  </svg>
);

/**
 * A reusable breadcrumb navigation component styled like Preline UI.
 * @param paths - An array of path objects with a name and optional href.
 */
export function Breadcrumb({ paths, className = '' }: BreadcrumbProps) {
  const linkClasses = "flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500";
  const activeClasses = "inline-flex items-center text-sm font-semibold text-gray-800 truncate dark:text-neutral-200";

  return (
    <ol className={`flex items-center whitespace-nowrap ${className}`}>
      {paths.map((path, index) => (
        <li key={path.name} className="inline-flex items-center text-sm font-medium text-[#4B5563]">
          {path.href ? (
            <Link href={path.href} className={linkClasses}>
              {path.name}
            </Link>
          ) : (
            <span className={activeClasses} aria-current="page">
              {path.name}
            </span>
          )}
          
          {/* Add separator if it's not the last item */}
          {index < paths.length - 1 && (
            <SeparatorIcon />
          )}
        </li>
      ))}
    </ol>
  );
}
