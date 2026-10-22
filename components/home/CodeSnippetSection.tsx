"use client";

import { CodeTab, getCodeSnippet } from "@/utils/codeSnippets";
import { ArrowDown01Icon, Copy01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface CodeSnippetSectionProps {
  apiUrl: string;
}

const TAB_CONFIG: Record<CodeTab, { name: string; fileBadge: string; badgeLang: string }> = {
  curl: { name: "cURL", fileBadge: "POST /api/send", badgeLang: "HTTP" },
  js: { name: "JavaScript", fileBadge: "send.ts", badgeLang: "TS" },
  python: { name: "Python", fileBadge: "send.py", badgeLang: "PY" },
  go: { name: "Go", fileBadge: "main.go", badgeLang: "GO" },
  rust: { name: "Rust", fileBadge: "main.rs", badgeLang: "RS" },
  php: { name: "PHP", fileBadge: "send.php", badgeLang: "PHP" },
  net: { name: ".NET", fileBadge: "Program.cs", badgeLang: "C#" },
  java: { name: "Java", fileBadge: "SendEmail.java", badgeLang: "JAVA" },
};

type TokenType =
  | "comment"
  | "string"
  | "url"
  | "keyword"
  | "property"
  | "number"
  | "punctuation"
  | "operator"
  | "whitespace"
  | "plain";

interface Token {
  type: TokenType;
  text: string;
}

function tokenizeLine(line: string): Token[] {
  const regex =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#(?!\[)[^\n]*)|("""|""|"[^"]*"|''|'[^']*'|`[^`]*`|['"])|(https?:\/\/[^\s"',]+)|(\b(?:curl|import|from|export|default|function|return|await|async|const|let|var|package|func|def|new|class|public|static|void|use|fn|mut|struct|type|interface|case|switch|match|if|else|true|false|null|nil|POST|GET|string|int|bool)\b|-[XHd])|([a-zA-Z_][a-zA-Z0-9_]*(?=\s*:|\s*=>))|(\b\d+\b)|([{}()[\];,])|([^\s"'a-zA-Z0-9_{}()[\];,]+)|(\s+)|([a-zA-Z_][a-zA-Z0-9_]*)/g;

  const rawTokens: Token[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match[1]) rawTokens.push({ type: "comment", text: match[1] });
    else if (match[2]) rawTokens.push({ type: "string", text: match[2] });
    else if (match[3]) rawTokens.push({ type: "url", text: match[3] });
    else if (match[4]) rawTokens.push({ type: "keyword", text: match[4] });
    else if (match[5]) rawTokens.push({ type: "property", text: match[5] });
    else if (match[6]) rawTokens.push({ type: "number", text: match[6] });
    else if (match[7]) rawTokens.push({ type: "punctuation", text: match[7] });
    else if (match[8]) rawTokens.push({ type: "operator", text: match[8] });
    else if (match[9]) rawTokens.push({ type: "whitespace", text: match[9] });
    else if (match[10]) rawTokens.push({ type: "plain", text: match[10] });
  }

  // Detect strings that serve as JSON / object keys
  for (let i = 0; i < rawTokens.length; i++) {
    if (rawTokens[i].type === "string") {
      let j = i + 1;
      while (j < rawTokens.length && rawTokens[j].type === "whitespace") j++;
      if (j < rawTokens.length && (rawTokens[j].text === ":" || rawTokens[j].text === "=>")) {
        rawTokens[i].type = "property";
      }
    }
  }

  return rawTokens;
}

function getTokenColor(type: TokenType): string {
  switch (type) {
    case "comment":
      return "text-zinc-500 italic";
    case "string":
      return "text-emerald-300";
    case "url":
      return "text-cyan-400 underline decoration-cyan-400/30 underline-offset-2";
    case "keyword":
      return "text-purple-400 font-medium";
    case "property":
      return "text-sky-300 font-medium";
    case "number":
      return "text-amber-300";
    case "punctuation":
      return "text-zinc-500";
    case "operator":
      return "text-pink-400";
    case "plain":
      return "text-zinc-200";
    case "whitespace":
    default:
      return "";
  }
}

export default function CodeSnippetSection({ apiUrl }: CodeSnippetSectionProps) {
  const [activeTab, setActiveTab] = useState<CodeTab>("curl");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const rawCode = useMemo(
    () => getCodeSnippet(activeTab, isExpanded, apiUrl),
    [activeTab, isExpanded, apiUrl]
  );

  const tokenizedLines = useMemo(() => {
    return rawCode.split("\n").map((line) => tokenizeLine(line));
  }, [rawCode]);

  const handleCopyCode = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(rawCode);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = rawCode;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
    setIsCopied(true);
    toast.success("Snippet copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const currentTabMeta = TAB_CONFIG[activeTab];

  return (
    <section className="w-full bg-background-sendlib pb-24 px-margin-mobile md:px-margin-desktop relative z-20">
      <div className="max-w-6xl mx-auto">
        <div className="w-full bg-[#090a0f] text-white rounded-2xl font-mono border border-zinc-800/90 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col transition-all hover:border-zinc-700/80 text-left">
          <div className="flex justify-between items-center px-3.5 py-2.5 bg-[#12131a] border-b border-zinc-800/80 gap-3">
            <div className="flex items-center gap-2 overflow-x-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-1 py-0.5">
              <span className="hidden sm:inline-flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-xs select-none shrink-0 shadow-inner">
                &gt;_
              </span>

              <div className="flex items-center rounded-xl bg-[#07080c] border border-zinc-800/80 p-1 text-xs shrink-0">
                {(
                  [
                    "curl",
                    "js",
                    "python",
                    "go",
                    "rust",
                    "php",
                    "net",
                    "java",
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap font-sans text-xs md:text-sm font-medium ${
                      activeTab === tab
                        ? "text-white font-semibold"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {activeTab === tab && (
                      <motion.span
                        layoutId="activeCodeTab"
                        className="absolute inset-0 rounded-lg bg-zinc-800 shadow-sm"
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 35,
                        }}
                      />
                    )}
                    <span className="relative z-10">{TAB_CONFIG[tab].name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-zinc-400">
                <span className="text-[10px] px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold uppercase tracking-wider">
                  {currentTabMeta.badgeLang}
                </span>
                <span>{currentTabMeta.fileBadge}</span>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                aria-label="Copy code"
                className="p-2 rounded-lg text-zinc-300 hover:text-white bg-[#07080c] hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-sm"
                title="Copy code"
              >
                {isCopied ? (
                  <HugeiconsIcon
                    icon={Tick01Icon}
                    size={16}
                    className="text-emerald-400"
                  />
                ) : (
                  <HugeiconsIcon icon={Copy01Icon} size={16} />
                )}
              </button>
            </div>
          </div>

          <motion.div
            layout
            transition={{
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.15 }}
                className="flex py-5 overflow-x-auto max-h-[550px] custom-scrollbar"
              >
                <div
                  aria-hidden
                  className="w-10 sm:w-12 shrink-0 select-none text-zinc-600 font-mono text-xs md:text-sm text-right pr-3.5 pl-3 border-r border-zinc-800/60 leading-6 md:leading-relaxed"
                >
                  {tokenizedLines.map((_, i) => (
                    <div key={`line-${i + 1}`} className="tabular-nums">
                      {i + 1}
                    </div>
                  ))}
                </div>

                <div className="flex-1 pl-4 pr-6 font-mono text-xs md:text-sm leading-6 md:leading-relaxed text-zinc-200 overflow-x-auto whitespace-pre custom-scrollbar">
                  {tokenizedLines.map((lineTokens, i) => (
                    <div key={`content-${i + 1}`} className="min-w-full">
                      {lineTokens.map((token, j) => (
                        <span key={`token-${i + 1}-${j + 1}`} className={getTokenColor(token.type)}>
                          {token.text}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="flex justify-between items-center border-t border-zinc-800/80 px-6 py-3.5 bg-[#12131a] text-xs">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="group flex items-center gap-2 text-xs md:text-sm font-sans font-medium text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer outline-none"
            >
              <span>
                {isExpanded ? "Collapse parameters" : "Show all parameters (CC, BCC, Attachments)"}
              </span>
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="inline-flex items-center text-emerald-400 group-hover:text-emerald-300"
              >
                <HugeiconsIcon icon={ArrowDown01Icon} size={15} />
              </motion.span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
