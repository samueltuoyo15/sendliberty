"use client";

import { useMe } from "@/hooks/useAuth";
import { CodeTab, getCodeSnippet } from "@/utils/codeSnippets";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import TopNavBar from "@/components/home/TopNavBar";
import { GithubIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "framer-motion";

export default function HomeClient() {
  const { data: user } = useMe();
  const [apiUrl, setApiUrl] = useState("https://sendliberty.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setApiUrl(window.location.origin);
    }
  }, []);

  const [activeTab, setActiveTab] = useState<CodeTab>("curl");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const rotatingWords = [
    "Welcome Emails",
    "Payment Receipts",
    "Password Resets",
    "Auth Verification",
    "Order Confirmations",
    "User Notifications",
  ];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [rotatingWords.length]);

  const faqs = [
    {
      color: "bg-indigo-500",
      question: "Do I need to verify my domain or configure DNS records?",
      answer:
        "No! Because Sendliberty routes your email relay requests securely through your already verified, connected Google accounts, there is absolutely zero DNS configuration required. You do not need to add SPF, DKIM, MX, or TXT records to start sending immediately.",
    },
    {
      color: "bg-purple-500",
      question: "Can I send from my custom domain (e.g. hello@mycompany.com)?",
      answer: (
        <>
          Yes! If your custom company domain is connected to Google Workspace, simply link that
          account to Sendliberty via Google OAuth. Sendliberty will send transactional emails
          directly from your custom domain (e.g.{" "}
          <code className="bg-surface-variant/80 px-1.5 py-0.5 rounded text-xs">
            hello@mycompany.com
          </code>
          ) with zero extra DNS or SPF configuration required on Sendliberty. Plus, Google Workspace
          accounts get up to <strong>1,000 emails/day on Free</strong> (2,000/day on Pro) per
          account!
        </>
      ),
    },
    {
      color: "bg-emerald-500",
      question: "Will my emails land in the inbox?",
      answer:
        "Sendliberty submits messages through Google's official Gmail API, but no email service can guarantee inbox placement. Gmail and the recipient's provider still classify each accepted message using sender reputation, content, authentication, recipient engagement, and other signals.",
    },
    {
      color: "bg-pink-500",
      question: "How does this compare to the free tier of Resend, Mailgun, or SendGrid?",
      answer: (
        <>
          Other platforms limit you to only 100 free emails per day on their free plans and require
          strict domain verification. With Sendliberty, you can send up to{" "}
          <strong>200 emails/day</strong> per connected personal Gmail account (500/day on Pro), or
          up to <strong>1,000 emails/day</strong> per connected Google Workspace account (2,000/day
          on Pro).
        </>
      ),
    },
    {
      color: "bg-amber-500",
      question: "Can I send attachments and CC/BCC recipients?",
      answer:
        "Yes, our REST API supports complete transactional payloads. You can specify a custom Reply-To header, carbon copies (CC), blind carbon copies (BCC), and pass an array of base64-encoded attachments.",
    },
    {
      color: "bg-blue-500",
      question: "Is my Google account password secure?",
      answer:
        "We never see, ask for, or store your Google password. Authorization is done entirely through standard, secure Google OAuth2 credentials. We only store encrypted access and refresh tokens, which you can manually revoke from your Google Account settings page at any time.",
    },
  ];

  const handleCopyCode = () => {
    const code = getCodeSnippet(activeTab, isExpanded, apiUrl);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(code);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-background-sendlib text-on-background font-body-md overflow-x-hidden">
      <TopNavBar />

      <main className="flex-grow overflow-x-hidden">
        {/* Hero Section */}
        <section className="w-full relative bg-background-sendlib pt-28 pb-16 md:pt-48 md:pb-32 px-4 md:px-margin-desktop flex flex-col items-center justify-center overflow-hidden">
          <div className="relative w-full max-w-8xl mx-auto flex flex-col items-center justify-center rounded-[2.5rem] md:rounded-none bg-surface-container md:bg-transparent border border-white/10 md:border-none shadow-2xl md:shadow-none overflow-hidden md:overflow-visible px-6 py-16 md:p-0">
            {/* Ambient Background Blurred Blocks - Floating out-of-focus clouds */}
            <motion.div
              className="absolute left-[5%] top-[15%] w-[350px] h-[350px] pointer-events-none opacity-10 md:opacity-30 blur-md md:blur-lg z-0"
              animate={{
                y: [0, -14, 10, -6, 0],
                x: [0, 8, -6, 4, 0],
                scale: [1, 1.05, 0.96, 1.02, 1],
                rotate: [-15, -12, -18, -14, -15],
              }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/block.svg"
                alt=""
                fill
                priority
                aria-hidden
                style={{ objectFit: "contain" }}
              />
            </motion.div>
            <motion.div
              className="absolute left-[25%] top-[-10%] w-[250px] h-[250px] pointer-events-none opacity-15 md:opacity-40 blur-sm md:blur-md z-0"
              animate={{
                y: [0, 12, -10, 6, 0],
                x: [0, -8, 6, -4, 0],
                scale: [1, 0.95, 1.06, 0.98, 1],
                rotate: [45, 48, 42, 46, 45],
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <Image
                src="/block.svg"
                alt=""
                fill
                priority
                aria-hidden
                style={{ objectFit: "contain" }}
              />
            </motion.div>
            <motion.div
              className="absolute left-[30%] bottom-[5%] w-[400px] h-[400px] pointer-events-none opacity-10 md:opacity-20 blur-lg md:blur-xl z-0"
              animate={{
                y: [0, -18, 12, -8, 0],
                x: [0, 10, -10, 6, 0],
                scale: [1, 1.07, 0.94, 1.02, 1],
                rotate: [90, 94, 87, 91, 90],
              }}
              transition={{
                duration: 19,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2,
              }}
            >
              <Image
                src="/block.svg"
                alt=""
                fill
                priority
                aria-hidden
                style={{ objectFit: "contain" }}
              />
            </motion.div>
            <motion.div
              className="absolute right-[10%] top-[-5%] w-[300px] h-[300px] pointer-events-none opacity-10 md:opacity-30 blur-md md:blur-lg z-0"
              animate={{
                y: [0, 15, -12, 8, 0],
                x: [0, -10, 8, -5, 0],
                scale: [1, 0.96, 1.06, 0.98, 1],
                rotate: [-45, -42, -49, -44, -45],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8,
              }}
            >
              <Image
                src="/block.svg"
                alt=""
                fill
                priority
                aria-hidden
                style={{ objectFit: "contain" }}
              />
            </motion.div>
            <motion.div
              className="absolute right-[25%] bottom-[15%] w-[280px] h-[280px] pointer-events-none opacity-15 md:opacity-40 blur-sm md:blur-md z-0"
              animate={{
                y: [0, -12, 14, -8, 0],
                x: [0, 8, -6, 5, 0],
                scale: [1, 1.06, 0.95, 1.03, 1],
                rotate: [120, 124, 116, 121, 120],
              }}
              transition={{
                duration: 17,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            >
              <Image
                src="/block.svg"
                alt=""
                fill
                priority
                aria-hidden
                style={{ objectFit: "contain" }}
              />
            </motion.div>
            <motion.div
              className="absolute right-[15%] top-[35%] w-[350px] h-[350px] pointer-events-none opacity-10 md:opacity-20 blur-lg md:blur-xl z-0"
              animate={{
                y: [0, 14, -15, 8, 0],
                x: [0, -10, 8, -4, 0],
                scale: [1, 0.96, 1.06, 0.98, 1],
                rotate: [180, 184, 176, 181, 180],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            >
              <Image
                src="/block.svg"
                alt=""
                fill
                priority
                aria-hidden
                style={{ objectFit: "contain" }}
              />
            </motion.div>

            {/* Sharp Edge Foreground Blocks - Left & Right Side Clouds in Organic Motion */}
            <div className="absolute left-0 top-[7%] -translate-x-[45%] w-[350px] h-[350px] md:w-[600px] md:h-[600px] pointer-events-none opacity-90 hidden sm:block z-0">
              <motion.div
                className="w-full h-full relative"
                animate={{
                  y: [0, -22, 14, -8, 0],
                  x: [0, 12, -10, 6, 0],
                  rotate: [0, 2.8, -2.2, 1.2, 0],
                  scaleX: [-1, -1.06, -0.95, -1.02, -1],
                  scaleY: [1, 0.94, 1.06, 0.98, 1],
                  skewX: [0, 2, -1.8, 1, 0],
                  skewY: [0, -1.6, 2.2, -0.8, 0],
                  opacity: [0.88, 0.96, 0.9, 0.95, 0.88],
                }}
                transition={{
                  duration: 11,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/block.svg"
                  alt=""
                  fill
                  priority
                  aria-hidden
                  style={{ objectFit: "contain" }}
                />
              </motion.div>
            </div>
            <div className="absolute right-0 top-[-5%] translate-x-[55%] w-[350px] h-[350px] md:w-[600px] md:h-[600px] pointer-events-none opacity-90 hidden sm:block z-0">
              <motion.div
                className="w-full h-full relative"
                animate={{
                  y: [0, 20, -16, 10, 0],
                  x: [0, -12, 12, -7, 0],
                  rotate: [0, -3.2, 2.4, -1.4, 0],
                  scaleX: [1, 0.94, 1.07, 0.97, 1],
                  scaleY: [1, 1.06, 0.94, 1.02, 1],
                  skewX: [0, -2.2, 1.8, -1, 0],
                  skewY: [0, 1.8, -2, 0.8, 0],
                  opacity: [0.9, 0.86, 0.96, 0.89, 0.9],
                }}
                transition={{
                  duration: 13,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.9,
                }}
              >
                <Image
                  src="/block.svg"
                  alt=""
                  fill
                  priority
                  aria-hidden
                  style={{ objectFit: "contain" }}
                />
              </motion.div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center w-full">
              <h1 className="text-3xl leading-tight sm:text-4xl md:text-[56px] lg:text-[64px] md:leading-[1.15] font-headline-lg-mobile text-center text-white font-extrabold tracking-tight mb-6">
                {/* Mobile: Rock-solid static headline without awkward word wrapping or layout shifts */}
                <span className="md:hidden">
                  Send Transactional Emails
                  <br />
                  Without Needing a Domain.
                </span>

                {/* Desktop: Dynamic rotating words with full width */}
                <span className="hidden md:inline">
                  Send{" "}
                  <span className="inline-block relative overflow-hidden align-top text-emerald-400 min-w-[420px] text-center">
                    <span
                      key={wordIndex}
                      className="inline-block animate-in fade-in slide-in-from-bottom-2 duration-300"
                    >
                      {rotatingWords[wordIndex]}
                    </span>
                  </span>
                  <br />
                  Without Needing a Domain.
                </span>
              </h1>

              <p className="font-body-lg text-base md:text-lg max-w-[620px] text-center text-secondary leading-relaxed mb-10 px-4 md:px-0">
                Deploying to Render or hosts where outbound SMTP ports are blocked? Sendliberty
                turns your product&apos;s existing Gmail into a reliable email API. Send up to 500
                emails a day with zero DNS friction.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 mb-4 md:mb-16 w-full">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="hidden md:inline-block bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-white border border-white/25 px-10 py-4 rounded-xl font-label-sm text-label-sm transition-all active:scale-95 backdrop-blur-md text-center w-full sm:w-auto"
                  >
                    Open Console
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="hidden md:inline-block bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-white border border-white/25 px-10 py-4 rounded-xl font-label-sm text-label-sm transition-all active:scale-95 backdrop-blur-md text-center w-full sm:w-auto"
                  >
                    Get Started For Free
                  </Link>
                )}
                <Link
                  href="/docs"
                  className="bg-emerald-500 hover:bg-emerald-600 border-0 text-black font-bold px-8 py-3.5 md:px-10 md:py-4 rounded-full md:rounded-xl font-label-sm text-label-sm transition-all active:scale-95 text-center inline-block w-auto"
                >
                  Read Documentation
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Code Snippet Section */}
        <section className="w-full bg-background-sendlib pb-24 px-margin-mobile md:px-margin-desktop relative z-20">
          <div className="max-w-6xl mx-auto">
            <div className="w-full bg-[#090a0f] text-white rounded-2xl font-mono border border-zinc-800 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col transition-all hover:border-zinc-700 text-left">
              <div className="flex justify-between items-center px-4 py-3 bg-[#12131a] border-b border-zinc-800 gap-2">
                <div className="flex items-center rounded-xl bg-[#07080c] border border-zinc-800/80 p-1 text-xs overflow-x-auto max-w-full flex-1 [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {(["curl", "js", "python", "go", "rust", "php", "net", "java"] as const).map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap font-sans text-xs md:text-sm font-medium ${
                          activeTab === tab
                            ? "bg-zinc-800 text-white shadow-sm font-bold"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                        }`}
                      >
                        {tab === "curl"
                          ? "cURL"
                          : tab === "js"
                            ? "JavaScript"
                            : tab === "python"
                              ? "Python"
                              : tab === "go"
                                ? "Go"
                                : tab === "rust"
                                  ? "Rust"
                                  : tab === "php"
                                    ? "PHP"
                                    : tab === "net"
                                      ? ".NET"
                                      : "Java"}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="text-xs md:text-sm font-sans font-medium text-zinc-300 hover:text-white bg-[#07080c] border border-zinc-800 hover:bg-zinc-800 px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  {isCopied ? "✓ Copied" : "Copy Code"}
                </button>
              </div>
              <pre className="text-xs md:text-[15px] overflow-auto max-h-[500px] leading-loose text-white p-6 md:p-8 custom-scrollbar font-mono">
                {getCodeSnippet(activeTab, isExpanded, apiUrl)}
              </pre>
              <div className="flex justify-between items-center border-t border-zinc-800 text-xs px-6 py-4 bg-[#12131a]">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer flex items-center gap-1.5 transition-colors outline-none font-sans"
                >
                  {isExpanded
                    ? "Collapse Parameters ▲"
                    : "Show All Parameters (CC, BCC, Attachments) ▼"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section
          id="features"
          className="py-16 md:py-24 bg-surface-container-lowest border-b border-outline-variant/60"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center text-center mb-12 space-y-3 w-full">
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary-sendlib">
                Stop worrying about domains. Just send.
              </h2>
              <p className="text-secondary w-full max-w-2xl mx-auto text-base leading-relaxed">
                Traditional email APIs force you to configure DNS records and custom domains before
                sending a single email. Sendliberty uses the Gmail account your product already has.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-outline-variant shadow-sm bg-surface-container-lowest">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant text-on-background">
                    <th className="px-6 py-4 font-bold text-secondary w-2/5">Feature</th>
                    <th className="px-6 py-4 text-center w-3/10 bg-primary-sendlib/5 border-x border-outline-variant/40">
                      <span className="bg-white text-black text-xs font-extrabold px-3.5 py-1 rounded-full shadow-xs inline-block">
                        Sendliberty
                      </span>
                    </th>
                    <th className="px-6 py-4 text-center font-bold text-secondary w-3/10">
                      Traditional Email APIs
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                  {[
                    {
                      feature: "Zero Domain Verification",
                      sendlib: "Instant (No domain needed)",
                      others: "Required (DNS verification)",
                    },
                    {
                      feature: "Free Emails Per Day",
                      sendlib: "200 to 1,000 / account",
                      others: "100 / day",
                    },
                    {
                      feature: "Uses Existing Product Gmail",
                      sendlib: "Yes (Google OAuth2)",
                      others: "No (Requires SMTP server)",
                    },
                  ].map((row) => (
                    <tr
                      key={row.feature}
                      className="hover:bg-surface-container-lowest/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-on-background">{row.feature}</td>
                      <td className="px-6 py-4 text-center font-bold text-emerald-600 bg-primary-sendlib/5 border-x border-outline-variant/40 text-xs sm:text-sm">
                        {row.sendlib}
                      </td>
                      <td className="px-6 py-4 text-center text-secondary text-xs sm:text-sm">
                        {row.others}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          className="w-full py-xl md:py-32 bg-surface-container border-b border-outline-variant/60"
          id="pricing"
        >
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-12 space-y-3">
              <h2 className="font-headline-lg text-headline-lg text-primary-sendlib font-extrabold">
                Simple, Honest Pricing
              </h2>
              <p className="text-secondary font-body-lg max-w-2xl mx-auto">
                Start for free, no credit card required.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
              {/* Free Card */}
              <div className="rounded-2xl border-2 border-primary-sendlib bg-surface-container-lowest shadow-lg p-8 flex flex-col gap-6 relative">
                {(!user || user.plan !== "pro") && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                      CURRENT PLAN
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-extrabold text-primary-sendlib">Free</h3>
                  <div className="flex items-end gap-1 mt-1">
                    <span className="text-4xl font-extrabold text-primary-sendlib">$0</span>
                    <span className="text-secondary mb-1">/ forever</span>
                  </div>
                  <p className="text-sm text-secondary mt-2">
                    No credit card. No expiry. No catch.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-secondary flex-1">
                  {[
                    "Up to 200 emails/day per connected Gmail",
                    "Up to 1,000 emails/day per Workspace account",
                    "Max 3,500 emails/month total",
                    "No custom domain needed",
                    "Up to 3 connected Gmail accounts",
                    "5 API keys",
                    "30 API requests / minute",
                    "2MB HTML body · 1MB text body",
                    "Up to 5 attachments · 1MB per file",
                    "50 recipients per field (to/cc/bcc)",
                    "5 days email log retention",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="block w-full text-center bg-surface-container-low border border-outline-variant/60 hover:bg-surface-container text-white font-bold py-3 rounded-xl transition-all active:scale-95"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Pro Card */}
              <div className="rounded-2xl border-2 border-primary-sendlib/80 bg-surface-container-lowest shadow-xl p-8 flex flex-col gap-6 relative">
                <div className="absolute -top-3 left-6">
                  <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                    {user?.plan === "pro" ? "CURRENT PLAN" : "PRO PLAN"}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-primary-sendlib">Pro</h3>
                  <div className="flex items-end gap-1 mt-1">
                    <span className="text-4xl font-extrabold text-primary-sendlib">₦4,000</span>
                    <span className="text-secondary mb-1">/ month</span>
                  </div>
                  <p className="text-sm text-secondary mt-2">
                    Higher limits & scale for growing applications.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-secondary flex-1">
                  {[
                    "Up to 500 emails/day per connected Gmail",
                    "Up to 2,000 emails/day per Workspace account",
                    "Unlimited emails/month total",
                    "Everything in Free (with higher limits)",
                    "Up to 50 connected Gmail accounts",
                    "Up to 100 API keys",
                    "300 API requests / minute",
                    "5MB HTML body · 2MB text body",
                    "Up to 20 attachments · 10MB per file",
                    "90 days email log retention",
                    "Batch email sending",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={user ? "/dashboard/settings" : "/login"}
                  className="block w-full text-center bg-surface-container-low border border-outline-variant/60 hover:bg-surface-container text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-md"
                >
                  {user?.plan === "pro"
                    ? "Manage Subscription"
                    : user
                      ? "Upgrade to Pro (₦4,000/mo)"
                      : "Get Started Pro (₦4,000/mo)"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="py-xl md:py-32 bg-surface-container-low border-t border-outline-variant/60"
        >
          <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-16 space-y-3">
              <h2 className="font-headline-lg text-headline-lg text-primary-sendlib">
                Frequently Asked Questions
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[600px] mx-auto">
                Got questions about how Sendliberty is different from other transactional email
                sending platforms? We have answers.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className={`p-5 md:p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${isOpen ? "bg-surface-container-lowest border-outline-variant/60 shadow-md" : "border-outline-variant/40 bg-surface-container-lowest/40 hover:bg-surface-container-lowest/70"}`}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-bold text-base text-on-background flex items-start md:items-center gap-3">
                        <span className="flex-1">{faq.question}</span>
                      </h3>
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-low text-secondary transition-transform duration-300">
                        <svg
                          className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] mt-4 opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm md:text-base text-secondary leading-relaxed pl-0 md:pl-5">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto bg-[#0a0a0a] border-t border-white/10 relative overflow-hidden">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-28 md:pb-36">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16">
            {/* Left Brand Column */}
            <div className="flex flex-col items-start text-left w-full lg:w-72 lg:shrink-0">
              <Link href="/" className="flex items-center gap-2.5 mb-4 group">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/icon.png"
                    alt="Sendliberty"
                    width={22}
                    height={22}
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Sendliberty
                </span>
              </Link>

              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Send receipts, welcome notes, and auth emails straight through your existing Gmail
                without verifying custom domains or fighting blocked outbound SMTP ports.
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs text-zinc-300 font-medium mb-6">
                <span>🇺🇸</span>
                <span>English (US)</span>
              </div>

              <p className="text-xs text-zinc-500">© 2026 Sendliberty Inc. All rights reserved.</p>
            </div>

            {/* Right Links Columns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 lg:gap-16 text-left">
              {/* Product */}
              <div className="flex flex-col gap-3 min-w-[110px]">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  PRODUCT
                </span>
                <Link
                  href="#features"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#pricing"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  How it works
                </Link>
                <Link
                  href="/login"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <a
                  href="https://github.com/samueltuoyo15/sendliberty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <HugeiconsIcon icon={GithubIcon} size={14} />
                  GitHub
                </a>
              </div>

              {/* Company */}
              <div className="flex flex-col gap-3 min-w-[110px]">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  COMPANY
                </span>
                <Link
                  href="#features"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/docs"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Changelog
                </Link>
                <a
                  href="mailto:hello@samueltuoyo.com?subject=Careers"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Careers
                </a>
                <a
                  href="mailto:hello@samueltuoyo.com"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </div>

              {/* Support */}
              <div className="flex flex-col gap-3 min-w-[110px]">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  SUPPORT
                </span>
                <Link
                  href="/docs"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Help Center
                </Link>
                <Link
                  href="/docs/quickstart"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Contact Support
                </Link>
                <a
                  href="mailto:hello@samueltuoyo.com"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Email Support
                </a>
              </div>

              {/* Legal */}
              <div className="flex flex-col gap-3 min-w-[110px]">
                <span className="text-xs font-bold uppercase tracking-wider text-white">LEGAL</span>
                <Link
                  href="/terms-of-service"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/refund"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Refund Policy
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Large Background Watermark Text - Subtle and anchored cleanly at bottom */}
        <div className="pointer-events-none absolute bottom-[-30%] left-1/2 -translate-x-1/2 select-none text-[15vw] font-black tracking-tight text-white/[0.07] leading-none whitespace-nowrap z-0">
          SENDLIBERTY
        </div>
      </footer>
    </div>
  );
}
