import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AdminImagePicker } from "../AdminImagePicker/AdminImagePicker";
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

const ALIGNS = [
  { cmd: "justifyLeft",   label: "←", title: "По лівому краю" },
  { cmd: "justifyCenter", label: "↔", title: "По центру" },
  { cmd: "justifyRight",  label: "→", title: "По правому краю" },
];

// Recursively remove style/class/id/vendor attributes from a DOM node
const cleanNode = (node) => {
  if (node.nodeType !== Node.ELEMENT_NODE) return;

  node.removeAttribute("style");
  node.removeAttribute("class");
  node.removeAttribute("id");
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

export const RichTextarea = ({
  value,
  onChange,
  rows = 4,
  placeholder,
  className,
  showKeywordButton,
  showImageButton,
}) => {
  const ref = useRef(null);
  const [blockFormat, setBlockFormat] = useState("p");
  const [activeFormats, setActiveFormats] = useState({});
  const [selectedImg, setSelectedImg] = useState(null);
  const [imgRect, setImgRect] = useState(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

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

  // Keep the resize overlay in sync with the image position
  useEffect(() => {
    if (!selectedImg) { setImgRect(null); return; }
    const update = () => {
      if (selectedImg?.isConnected) {
        const r = selectedImg.getBoundingClientRect();
        setImgRect({ left: r.left, top: r.top, width: r.width, height: r.height });
      } else {
        setSelectedImg(null);
      }
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [selectedImg]);

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
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    let node = range.commonAncestorContainer;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
    const kwSpan = node.closest?.(".kw");

    if (kwSpan) {
      const parent = kwSpan.parentNode;
      while (kwSpan.firstChild) parent.insertBefore(kwSpan.firstChild, kwSpan);
      parent.removeChild(kwSpan);
    } else {
      if (selection.isCollapsed) return;
      const span = document.createElement("span");
      span.className = "kw";
      try {
        range.surroundContents(span);
      } catch {
        const fragment = range.extractContents();
        span.appendChild(fragment);
        range.insertNode(span);
      }
    }

    selection.removeAllRanges();
    emit();
  };

  const insertImage = (url) => {
    ref.current?.focus();
    document.execCommand(
      "insertHTML",
      false,
      `<img src="${url}" class="rt-img" style="width:300px">`
    );
    setIsPickerOpen(false);
    emit();
  };

  const handleResizeMouseDown = (e) => {
    e.preventDefault();
    const img = selectedImg;
    const startX = e.clientX;
    const startWidth = img.offsetWidth;
    let rafId;

    const onMove = (me) => {
      const w = Math.max(50, startWidth + (me.clientX - startX));
      img.style.width = w + "px";
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const r = img.getBoundingClientRect();
        setImgRect({ left: r.left, top: r.top, width: r.width, height: r.height });
      });
    };

    const onUp = () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      emit();
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
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

        <span className="rich-toolbar-divider" />

        {ALIGNS.map(({ cmd, label, title }) => (
          <button
            key={cmd}
            type="button"
            className="rich-toolbar-btn rich-toolbar-btn--align"
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

        {showImageButton && (
          <>
            <span className="rich-toolbar-divider" />
            <button
              type="button"
              className="rich-toolbar-btn rich-toolbar-btn--img"
              title="Вставити зображення"
              onMouseDown={(e) => { e.preventDefault(); setIsPickerOpen(true); }}
            >
              📷
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
        onClick={(e) => {
          if (e.target.tagName === "IMG") {
            setSelectedImg(e.target);
          } else {
            setSelectedImg(null);
          }
        }}
        style={{ minHeight: `${rows * 1.6}em` }}
      />

      {/* Resize overlay — rendered as a portal so it appears above everything */}
      {selectedImg && imgRect && createPortal(
        <div
          style={{
            position: "fixed",
            left: imgRect.left - 2,
            top: imgRect.top - 2,
            width: imgRect.width + 4,
            height: imgRect.height + 4,
            border: "2px solid #2563eb",
            pointerEvents: "none",
            zIndex: 9999,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -6,
              bottom: -6,
              width: 12,
              height: 12,
              background: "#2563eb",
              border: "2px solid #fff",
              borderRadius: 2,
              cursor: "nwse-resize",
              pointerEvents: "all",
            }}
            onMouseDown={handleResizeMouseDown}
          />
        </div>,
        document.body
      )}

      {showImageButton && (
        <AdminImagePicker
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          onSelect={insertImage}
        />
      )}
    </div>
  );
};
