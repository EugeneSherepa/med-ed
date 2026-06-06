import { useRef, useEffect, useState } from "react";
import "./RichTextarea.scss";

const FORMATS = [
  { cmd: "bold",          label: "B", title: "Жирний",      cls: "b" },
  { cmd: "italic",        label: "I", title: "Курсив",       cls: "i" },
  { cmd: "underline",     label: "U", title: "Підкреслений", cls: "u" },
  { cmd: "strikeThrough", label: "S", title: "Закреслений",  cls: "s" },
];

const LISTS = [
  { cmd: "insertUnorderedList", label: "• Список",  title: "Маркований список" },
  { cmd: "insertOrderedList",   label: "1. Список", title: "Нумерований список" },
];

const BLOCK_OPTIONS = [
  { value: "p",  label: "Параграф" },
  { value: "h1", label: "Заголовок 1" },
  { value: "h2", label: "Заголовок 2" },
  { value: "h3", label: "Заголовок 3" },
];

// Recursively remove style/class/id/vendor attributes from a DOM node
const cleanNode = (node) => {
  if (node.nodeType !== Node.ELEMENT_NODE) return;

  node.removeAttribute("style");
  node.removeAttribute("class");
  node.removeAttribute("id");
  // Remove any data-* or vendor attributes like bis_skin_checked
  [...node.attributes].forEach((attr) => {
    if (attr.name.startsWith("data-") || attr.name.startsWith("bis_")) {
      node.removeAttribute(attr.name);
    }
  });

  [...node.childNodes].forEach(cleanNode);

  // Unwrap <span> and <font> — keep their children, remove the wrapper
  // Preserve <span class="kw"> (keyword markers)
  if (node.tagName === "FONT" || (node.tagName === "SPAN" && node.className !== "kw")) {
    const parent = node.parentNode;
    if (parent) {
      while (node.firstChild) parent.insertBefore(node.firstChild, node);
      parent.removeChild(node);
    }
  }
};

const KNOWN_BLOCKS = new Set(BLOCK_OPTIONS.map((o) => o.value));

export const RichTextarea = ({ value, onChange, rows = 4, placeholder, className, showKeywordButton }) => {
  const ref = useRef(null);
  const [blockFormat, setBlockFormat] = useState("p");
  const [activeFormats, setActiveFormats] = useState({});

  const syncState = () => {
    if (document.activeElement !== ref.current) return;
    const raw = document.queryCommandValue("formatBlock").toLowerCase();
    setBlockFormat(KNOWN_BLOCKS.has(raw) ? raw : "p");
    setActiveFormats({
      bold:          document.queryCommandState("bold"),
      italic:        document.queryCommandState("italic"),
      underline:     document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
    });
  };

  useEffect(() => {
    document.addEventListener("selectionchange", syncState);
    return () => document.removeEventListener("selectionchange", syncState);
  }, []);

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = value || "";
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || document.activeElement === el) return;
    if (el.innerHTML !== (value || "")) el.innerHTML = value || "";
  }, [value]);

  const emit = () => {
    onChange({ target: { value: ref.current?.innerHTML ?? "" } });
  };

  const applyCmd = (cmd) => {
    ref.current?.focus();
    document.execCommand(cmd, false, null);
    emit();
  };

  const applyBlock = (tag) => {
    ref.current?.focus();
    document.execCommand("formatBlock", false, tag);
    setBlockFormat(tag);
    emit();
  };

  const applyKeyword = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.className = "kw";
    try {
      range.surroundContents(span);
    } catch {
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
    }
    selection.removeAllRanges();
    emit();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");

    if (html) {
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      cleanNode(tmp);
      document.execCommand("insertHTML", false, tmp.innerHTML);
    } else {
      // Plain text: preserve line breaks as <br>
      const escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");
      document.execCommand("insertHTML", false, escaped);
    }
    emit();
  };

  return (
    <div className="rich-textarea">
      <div className="rich-toolbar">
        <select
          className="rich-toolbar-select"
          value={blockFormat}
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => { applyBlock(e.target.value); }}
          title="Формат блоку"
        >
          {BLOCK_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <span className="rich-toolbar-divider" />

        {FORMATS.map(({ cmd, label, title, cls }) => (
          <button
            key={cmd}
            type="button"
            className={`rich-toolbar-btn rich-toolbar-btn--${cls} ${activeFormats[cmd] ? "rich-toolbar-btn--active" : ""}`}
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

        {showKeywordButton && (
          <>
            <span className="rich-toolbar-divider" />
            <button
              type="button"
              className="rich-toolbar-btn rich-toolbar-btn--kw"
              title="Ключове слово (підкреслюється після відповіді)"
              onMouseDown={(e) => { e.preventDefault(); applyKeyword(); }}
            >
              КС
            </button>
          </>
        )}
      </div>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className={`rich-editor ${className || ""}`}
        data-placeholder={placeholder}
        onInput={emit}
        onBlur={emit}
        onPaste={handlePaste}
        style={{ minHeight: `${rows * 1.6}em` }}
      />
    </div>
  );
};
