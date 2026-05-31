import { useRef } from "react";
import "./RichTextarea.scss";

const FORMATS = [
  { tag: "b",   label: "B",   title: "Жирний" },
  { tag: "i",   label: "I",   title: "Курсив" },
  { tag: "u",   label: "U",   title: "Підкреслений" },
  { tag: "s",   label: "S",   title: "Закреслений" },
];

export const RichTextarea = ({ value, onChange, rows = 4, placeholder, className }) => {
  const ref = useRef(null);

  const applyFormat = (tag) => {
    const el = ref.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);

    let newValue;
    let cursorStart;
    let cursorEnd;

    if (selected) {
      const wrapped = `<${tag}>${selected}</${tag}>`;
      newValue = value.slice(0, start) + wrapped + value.slice(end);
      cursorStart = start;
      cursorEnd = start + wrapped.length;
    } else {
      const open = `<${tag}>`;
      const close = `</${tag}>`;
      newValue = value.slice(0, start) + open + close + value.slice(start);
      cursorStart = cursorEnd = start + open.length;
    }

    onChange({ target: { value: newValue } });

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  return (
    <div className="rich-textarea">
      <div className="rich-toolbar">
        {FORMATS.map(({ tag, label, title }) => (
          <button
            key={tag}
            type="button"
            className={`rich-toolbar-btn rich-toolbar-btn--${tag}`}
            title={title}
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormat(tag);
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
};
