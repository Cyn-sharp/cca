// A wrapper whose border and surface light up under the cursor.
// The glow itself is drawn in CSS (.spotlight in index.css); this only
// tells the CSS where the cursor is.
export default function Spotlight({ as: Tag = "div", className = "", children, ...rest }) {
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <Tag onPointerMove={handleMove} className={`spotlight ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
