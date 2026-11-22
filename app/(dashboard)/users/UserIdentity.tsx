type UserIdentityProps = {
  name: string | null;
  email: string;
};

export default function UserIdentity({
  name,
  email,
}: UserIdentityProps) {
  const displayName = name?.trim();

  const initials = displayName
    ? displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
    : null;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500"
      >
        {initials || (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
          </svg>
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate text-base font-semibold text-slate-900">
          {displayName || email}
        </p>

        {displayName && (
          <p className="mt-0.5 truncate text-[15px] text-slate-500">
            {email}
          </p>
        )}
      </div>
    </div>
  );
}