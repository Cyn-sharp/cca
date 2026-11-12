// Section header in the console's visual language: a hairline, a numbered
// module line on the left, a system path on the right, then huge display type.
export default function ModuleHeading({ chapter, label, code, title, as: Tag = "h2", children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 border-t border-paper/10 pt-4 font-mono text-[10px] tracking-[0.3em] text-muted sm:text-[11px]">
        <p className="min-w-0 truncate">
          <span className="text-accent">CHAPTER {chapter}</span>
          <span className="mx-2 text-paper/25">/</span>
          {label}
        </p>
        {code && <p className="hidden shrink-0 text-paper/30 sm:block">{code}</p>}
      </div>
      <Tag className="mt-6 font-display text-5xl font-extrabold leading-[0.98] tracking-[-0.03em] text-paper sm:text-6xl md:text-7xl">
        {title}
        <span className="text-accent">.</span>
      </Tag>
      {children && (
        <div className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {children}
        </div>
      )}
    </div>
  );
}
