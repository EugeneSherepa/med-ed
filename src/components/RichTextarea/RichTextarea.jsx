import { useRef, useEffect } from "react";
import "./RichTextarea.scss";

const FORMATS = [
  { cmd: "bold",         label: "B",        title: "Жирний",        cls: "b" },
  { cmd: "italic",       label: "I",        title: "Курсив",         cls: "i" },
  { cmd: "underline",    label: "U",        title: "Підкреслений",   cls: "u" },
  { cmd: "strikeThrough",label: "S",        title: "Закреслений",    cls: "s" },
];

const LISTS = [
  { cmd: "insertUnorderedList", label: "• Список",  title: "Маркований список" },
  { cmd: "insertOrderedList",   label: "1. Список", title: "Нумерований список" },
];

export const RichTextarea = ({ value, onChange, rows = 4, placeholder, className }) => {
  const ref = useRef(null);

  // Set content on mount
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = value || "";
  }, []);

  // Sync external value changes only when the editor is NOT focused
  // (e.g. loading a different record). When the user is typing, skip
  // the update so the cursor never jumps.
  useEffect(() => {
    const el = ref.current;
    if (!el || document.activeElement === el) return;
    if (el.innerHTML !== (value || "")) {
      el.innerHTML = value || "";
    }
  }, [value]);

  const emit = () => {
    onChange({ target: { value: ref.current?.innerHTML ?? "" } });
  };

  const applyCmd = (cmd) => {
    ref.current?.focus();
    document.execCommand(cmd, false, null);
    emit();
  };

  return (
    <div className="rich-textarea">
      <div className="rich-toolbar">
        {FORMATS.map(({ cmd, label, title, cls }) => (
          <button
            key={cmd}
            type="button"
            className={`rich-toolbar-btn rich-toolbar-btn--${cls}`}
            title={title}
            onMouseDown={(e) => { e.preventDefault(); applyCmd(cmd); }}
          >
            {label}
          </button>
        ))}
        <span className="rich-toolbar-divider" />
        {LISTS.map(({ cmd, label, title }) => (
          <button
            key={cmd}
            type="button"
            className="rich-toolbar-btn rich-toolbar-btn--list"
            title={title}
            onMouseDown={(e) => { e.preventDefault(); applyCmd(cmd); }}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className={`rich-editor ${className || ""}`}
        data-placeholder={placeholder}
        onInput={emit}
        onBlur={emit}
        style={{ minHeight: `${rows * 1.6}em` }}
      />
    </div>
  );
};
