import type { ReactNode } from "react";

type Props = {
  title?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

export default function SectionCard({
  title,
  icon,
  action,
  children,
  className = "",
  bodyClassName = "",
}: Props) {
  return (
    <section className={`card ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
          <h3 className="section-title">
            {icon && <span className="text-slate-500">{icon}</span>}
            {title}
          </h3>
          {action && <div className="text-xs">{action}</div>}
        </header>
      )}
      <div className={`px-5 py-4 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
