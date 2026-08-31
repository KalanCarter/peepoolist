import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Plus,
  Trash2,
  Inbox,
  Check,
  X,
  Home,
  Crown,
  Lock,
  Send,
  LogOut,
  Mail,
  AlertTriangle,
  ArrowUpDown,
  GripVertical,
  Pencil,
  ImagePlus,
  Save,
  UserCircle,
  Bell,
  KeyRound,
  UserCog,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Button({ className = "", variant = "default", type = "button", ...props }) {
  const variants = {
    default: "bg-slate-100 text-slate-950 hover:bg-white",
    secondary: "bg-white/10 text-slate-100 hover:bg-white/15",
    destructive: "bg-red-600 text-white hover:bg-red-500",
  };

  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  );
}

function Card({ className = "", ...props }) {
  return <div className={cn("border bg-slate-900", className)} {...props} />;
}

function CardContent({ className = "", ...props }) {
  return <div className={className} {...props} />;
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={cn(
        "flex h-10 w-full px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={cn(
        "flex w-full px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

function Badge({ className = "", ...props }) {
  return <span className={cn("inline-flex items-center px-2.5 py-1 text-xs font-semibold", className)} {...props} />;
}

const SAMPLE_LEVELS = {
  pooplist: [
    {
      id: "sample-1",
      rank: 1,
      name: "Thinking Space II",
      creator: "CairoX",
      verifier: "Zoink",
      thumbnail_url: "",
      level_url: "",
      list_type: "pooplist",
    },
    {
      id: "sample-2",
      rank: 2,
      name: "Silent Corridor",
      creator: "PlungerX",
      verifier: "FlushMaster",
      thumbnail_url: "",
      level_url: "",
      list_type: "pooplist",
    },
    {
      id: "sample-3",
      rank: 3,
      name: "Brown Blizzard",
      creator: "DookieDemon",
      verifier: "WetWipeWarrior",
      thumbnail_url: "",
      level_url: "",
      list_type: "pooplist",
    },
  ],
  peelist: [
    {
      id: "sample-4",
      rank: 1,
      name: "Golden Corridor",
      creator: "PuddleBoy",
      verifier: "UNVERIFIED",
      thumbnail_url: "",
      level_url: "",
      list_type: "peelist",
    },
    {
      id: "sample-5",
      rank: 2,
      name: "Urinal Abyss",
      creator: "PorcelainKing",
      verifier: "IMPOSSIBLE",
      thumbnail_url: "",
      level_url: "",
      list_type: "peelist",
    },
  ],
};

function escapeXml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function normalizeUrl(url) {
  const trimmed = String(url || "").trim();
  if (!trimmed) return "";
  if (/^(javascript|data):/i.test(trimmed)) return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function openLevelUrl(url) {
  const safeUrl = normalizeUrl(url);
  if (!safeUrl) return;
  window.open(safeUrl, "_blank", "noopener,noreferrer");
}

const MESSAGE_COOLDOWN_MS = 10000;

function validatePublicMessage(value) {
  const clean = String(value || "").trim().replace(/\s+/g, " ").slice(0, 280);

  if (!clean) {
    return { ok: false, message: "Type a message first.", clean: "" };
  }

  if (clean.length < 2) {
    return { ok: false, message: "Message is too short.", clean };
  }

  if (/(.)\1{24,}/i.test(clean.replace(/\s/g, ""))) {
    return { ok: false, message: "Message looks too spammy.", clean };
  }

  const linkCount = (clean.match(/https?:\/\//gi) || []).length;
  if (linkCount > 1) {
    return { ok: false, message: "Only one link per message.", clean };
  }

  return { ok: true, message: "", clean };
}

function cooldownSecondsLeft(lastSentAt) {
  const remainingMs = MESSAGE_COOLDOWN_MS - (Date.now() - Number(lastSentAt || 0));
  return Math.max(0, Math.ceil(remainingMs / 1000));
}

function levelDetailTab(levelId) {
  return `level:${String(levelId || "")}`;
}

function userProfileTab(handleOrUserId) {
  return `user:${String(handleOrUserId || "")}`;
}

function normalizeHandle(value = "") {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 24);
}

function profileLabel(profile, user) {
  const name = String(profile?.display_name || "").trim();
  if (name) return name;
  const handle = String(profile?.handle || "").trim();
  if (handle) return `@${handle}`;
  const email = String(user?.email || "").trim();
  if (email) return email.split("@")[0];
  return "PeePooList user";
}

function profileHandle(profile, user) {
  const handle = String(profile?.handle || "").trim();
  if (handle) return handle;
  return String(user?.id || profile?.user_id || "").slice(0, 8);
}

function profileAvatarUrl(profile) {
  return String(profile?.avatar_url || "").trim();
}

function ProfileAvatar({ profile, user, className = "h-10 w-10", textClassName = "text-lg" }) {
  const avatar = profileAvatarUrl(profile);
  const initial = String(profileLabel(profile, user)).slice(0, 1).toUpperCase() || "P";

  return (
    <div className={cn("grid shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-[#c0ffbf] font-black text-white shadow-lg shadow-black/25", className)}>
      {avatar ? (
        <img src={avatar} alt={`${profileLabel(profile, user)} avatar`} className="h-full w-full object-cover" />
      ) : (
        <span className={textClassName} style={{ textShadow: "1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000" }}>
          {initial}
        </span>
      )}
    </div>
  );
}

function roleName(role) {
  if (role === "admin") return "Admin";
  if (role === "priority") return "Priority";
  return "Viewer";
}

function roleBadgeClass(role) {
  if (role === "admin") return "rounded-xl bg-emerald-500/20 text-emerald-200";
  if (role === "priority") return "rounded-xl bg-fuchsia-500/20 text-fuchsia-200";
  return "rounded-xl bg-slate-700 text-slate-200";
}

function badgeColorClass(color = "emerald") {
  const colors = {
    emerald: "border-emerald-300/30 bg-emerald-500/10 text-emerald-100",
    yellow: "border-yellow-300/30 bg-yellow-300/10 text-yellow-100",
    cyan: "border-cyan-300/30 bg-cyan-500/10 text-cyan-100",
    purple: "border-fuchsia-300/30 bg-fuchsia-500/10 text-fuchsia-100",
    red: "border-red-300/30 bg-red-500/10 text-red-100",
    slate: "border-white/10 bg-white/[0.04] text-slate-100",
  };
  return colors[color] || colors.emerald;
}

function achievementList(profile, badges = []) {
  const achievements = [
    { key: "account", label: "Account Created", description: "Made a PeePooList account.", color: "cyan" },
  ];

  if (profile?.display_name || profile?.handle || profile?.bio) {
    achievements.push({ key: "custom_profile", label: "Custom Profile", description: "Set up a username, handle, or bio.", color: "emerald" });
  }

  if (profile?.role === "priority") {
    achievements.push({ key: "priority", label: "Priority Viewer", description: "Has priority request status.", color: "purple" });
  }

  if (profile?.role === "admin") {
    achievements.push({ key: "admin", label: "Admin", description: "Can moderate and manage PeePooList.", color: "yellow" });
  }

  if ((badges || []).length > 0) {
    achievements.push({ key: "badge_collector", label: "Badge Collector", description: "Has at least one custom badge.", color: "emerald" });
  }

  return achievements;
}

function initialTabFromHash() {
  if (typeof window === "undefined") return "home";
  const levelMatch = window.location.hash.match(/^#\/level\/([^?#]+)/);
  if (levelMatch) return levelDetailTab(decodeURIComponent(levelMatch[1]));
  const profileMatch = window.location.hash.match(/^#\/u\/([^?#]+)/);
  if (profileMatch) return userProfileTab(decodeURIComponent(profileMatch[1]));
  return "home";
}

function levelShareUrl(levelId) {
  if (typeof window === "undefined") return "";
  const path = `${window.location.origin}${window.location.pathname}`;
  return `${path}#/level/${encodeURIComponent(String(levelId || ""))}`;
}

function profileShareUrl(handleOrUserId) {
  if (typeof window === "undefined") return "";
  const path = `${window.location.origin}${window.location.pathname}`;
  return `${path}#/u/${encodeURIComponent(String(handleOrUserId || ""))}`;
}

function imageFor(level, index, listType) {
  if (level.thumbnail_url) return level.thumbnail_url;
  const colors = listType === "pooplist" ? ["#7c3f16", "#f59e0b"] : ["#b7791f", "#fde047"];
  const safeName = escapeXml(level.name || "Unnamed Level").slice(0, 22);
  const svg = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='480' height='220' viewBox='0 0 480 220'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop stop-color='${colors[0]}' offset='0'/>
          <stop stop-color='${colors[1]}' offset='1'/>
        </linearGradient>
      </defs>
      <rect width='480' height='220' fill='url(#g)'/>
      <circle cx='390' cy='42' r='110' fill='white' opacity='.12'/>
      <circle cx='60' cy='190' r='120' fill='black' opacity='.2'/>
      <text x='28' y='62' font-family='Arial Black, Impact, sans-serif' font-size='34' fill='white' opacity='.9'>#${index + 1}</text>
      <text x='28' y='123' font-family='Arial Black, Impact, sans-serif' font-size='40' fill='white'>${safeName}</text>
      <text x='30' y='168' font-family='Arial, sans-serif' font-size='20' fill='white' opacity='.8'>${listType === "pooplist" ? "POSSIBLE" : "IMPOSSIBLE"} LEVEL</text>
    </svg>
  `);
  return `data:image/svg+xml,${svg}`;
}

function groupLevels(rows = []) {
  return {
    pooplist: rows.filter((row) => row.list_type === "pooplist").sort((a, b) => a.rank - b.rank),
    peelist: rows.filter((row) => row.list_type === "peelist").sort((a, b) => a.rank - b.rank),
  };
}

function clampRank(position, listLength) {
  const rank = Number.parseInt(position, 10);
  if (Number.isNaN(rank)) return 1;
  return Math.max(1, Math.min(rank, Math.max(listLength, 1)));
}

function moveLevelInList(list, levelId, targetIndex) {
  const currentIndex = list.findIndex((level) => level.id === levelId);
  if (currentIndex === -1) return list;

  const next = [...list];
  const [moving] = next.splice(currentIndex, 1);
  const safeIndex = Math.max(0, Math.min(targetIndex, next.length));
  next.splice(safeIndex, 0, moving);
  return next.map((level, index) => ({ ...level, rank: index + 1 }));
}

function cleanLevelForSave(level, index) {
  return {
    ...level,
    rank: index + 1,
    name: String(level.name || "Unnamed Level").trim(),
    creator: String(level.creator || "Unknown").trim(),
    verifier: String(level.verifier || "Unknown").trim(),
    thumbnail_url: String(level.thumbnail_url || "").trim(),
    level_url: String(level.level_url || "").trim(),
  };
}

function hasLevelChanged(original, edited, index) {
  if (!original || !edited) return true;
  return (
    String(original.name || "") !== String(edited.name || "") ||
    String(original.creator || "") !== String(edited.creator || "") ||
    String(original.verifier || "") !== String(edited.verifier || "") ||
    String(original.thumbnail_url || "") !== String(edited.thumbnail_url || "") ||
    String(original.level_url || "") !== String(edited.level_url || "") ||
    Number(original.rank || index + 1) !== index + 1
  );
}

const dragSwing = [
  0, 1.9, 3.7, 5.5, 7.1, 8.5, 9.7, 10.7, 11.5, 11.9, 12,
  11.9, 11.5, 10.7, 9.7, 8.5, 7.1, 5.5, 3.7, 1.9, 0,
  -1.9, -3.7, -5.5, -7.1, -8.5, -9.7, -10.7, -11.5, -11.9, -12,
  -11.9, -11.5, -10.7, -9.7, -8.5, -7.1, -5.5, -3.7, -1.9, 0,
];


function isValidEmailAddress(email) {
  const value = String(email || "").trim();
  const atCount = (value.match(/@/g) || []).length;
  if (atCount !== 1) return false;

  const [localPart, domain] = value.split("@");
  if (!localPart || !domain || domain.includes("..") || !domain.includes(".")) return false;

  const ending = domain.split(".").pop();
  if (!ending || ending.length < 2) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
}

function roleFromRequestedStatus(status) {
  if (status === "admin") return "admin";
  if (status === "priority") return "priority";
  return "user";
}

function readableStatus(status) {
  if (status === "admin") return "Admin";
  if (status === "priority") return "Priority";
  return "Viewer";
}

function formatDateTime(value) {
  if (!value) return "Unknown time";
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return String(value);
  }
}

function ChangeEmailPanel({ user, onCancel, onChangeEmail }) {
  const [step, setStep] = useState(0);
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const validEmail = isValidEmailAddress(newEmail);
  const emailsMatch = newEmail.trim().toLowerCase() === confirmEmail.trim().toLowerCase();

  function beginChange() {
    setError("");
    setStep(1);
  }

  function continueFromNewEmail() {
    if (!validEmail) {
      setError("Invalid email");
      return;
    }

    setError("");
    setStep(2);
  }

  function continueFromConfirmEmail() {
    if (!emailsMatch) {
      setError("Emails dont match");
      return;
    }

    setError("");
  }

  async function confirmChange() {
    if (!validEmail) {
      setError("Invalid email");
      setStep(1);
      return;
    }

    if (!emailsMatch) {
      setError("Emails dont match");
      setStep(2);
      return;
    }

    setIsSaving(true);
    setError("");
    const result = await onChangeEmail(newEmail.trim());
    setIsSaving(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setSuccess(`Confirmation email sent to ${newEmail.trim()}.`);
    setStep(3);
    window.setTimeout(() => onCancel(), 5000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 14, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 14, scale: 0.98 }}
      className="absolute right-[17rem] top-12 z-50 w-[330px] rounded-[2rem] border border-white/10 bg-slate-950/95 p-5 text-slate-100 shadow-2xl shadow-black/50 backdrop-blur-xl max-md:right-0 max-md:top-[21rem]"
    >
      <h3 className="text-lg font-black">Change Email</h3>
      <p className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-300">
        Current Email: <span className="font-semibold text-white">{user?.email || "Not signed in"}</span>
      </p>

      {step >= 1 && (
        <div className="mt-4">
          <label className="mb-2 block text-sm font-bold text-slate-200">Type in new email</label>
          {error === "Invalid email" && <p className="mb-2 text-xs font-bold text-red-300">Invalid email</p>}
          <Input
            type="email"
            value={newEmail}
            onChange={(event) => {
              setNewEmail(event.target.value);
              if (error) setError("");
            }}
            placeholder="new@email.com"
            className="rounded-2xl border-white/10 bg-white/10"
          />
        </div>
      )}

      {step >= 2 && (
        <div className="mt-4">
          <label className="mb-2 block text-sm font-bold text-slate-200">Confirm email</label>
          {error === "Emails dont match" && <p className="mb-2 text-xs font-bold text-red-300">Emails dont match</p>}
          <Input
            type="email"
            value={confirmEmail}
            onChange={(event) => {
              setConfirmEmail(event.target.value);
              if (error) setError("");
            }}
            placeholder="new@email.com"
            className="rounded-2xl border-white/10 bg-white/10"
          />
        </div>
      )}

      {step === 3 && (
        <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4">
          <p className="text-sm font-bold text-emerald-200">{success}</p>
          <p className="mt-2 text-xs text-emerald-100/80">
            Supabase sends the secure confirmation email. Click the link in that email to finish the change.
          </p>
        </div>
      )}

      {error && !["Invalid email", "Emails dont match"].includes(error) && (
        <p className="mt-3 text-xs font-bold text-red-300">{error}</p>
      )}

      <div className="mt-5 flex justify-between gap-3">
        <Button variant="secondary" onClick={onCancel} className="rounded-2xl">
          Cancel
        </Button>

        {step === 0 && (
          <Button onClick={beginChange} className="rounded-2xl">
            Change
          </Button>
        )}

        {step === 1 && (
          <Button onClick={continueFromNewEmail} className="rounded-2xl">
            Continue
          </Button>
        )}

        {step === 2 && emailsMatch && validEmail ? (
          <Button onClick={confirmChange} disabled={isSaving} className="rounded-2xl">
            {isSaving ? "Sending..." : "Confirm"}
          </Button>
        ) : step === 2 ? (
          <Button onClick={continueFromConfirmEmail} className="rounded-2xl">
            Continue
          </Button>
        ) : null}
      </div>
    </motion.div>
  );
}

function ChangePasswordPanel({ onCancel, onChangePassword }) {
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function continueToConfirm() {
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setStep(2);
  }

  async function confirmChange() {
    if (newPassword !== confirmPassword) {
      setError("Passwords dont match");
      return;
    }

    setIsSaving(true);
    setError("");
    const result = await onChangePassword(newPassword);
    setIsSaving(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setSuccess("Password changed.");
    window.setTimeout(() => onCancel(), 5000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 14, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 14, scale: 0.98 }}
      className="absolute right-[17rem] top-12 z-50 w-[330px] rounded-[2rem] border border-white/10 bg-slate-950/95 p-5 text-slate-100 shadow-2xl shadow-black/50 backdrop-blur-xl max-md:right-0 max-md:top-[21rem]"
    >
      <h3 className="text-lg font-black">Change Password</h3>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-bold text-slate-200">Type in new password</label>
        <Input
          type="password"
          value={newPassword}
          onChange={(event) => {
            setNewPassword(event.target.value);
            if (error) setError("");
          }}
          placeholder="New password"
          className="rounded-2xl border-white/10 bg-white/10"
        />
      </div>

      {step >= 2 && (
        <div className="mt-4">
          <label className="mb-2 block text-sm font-bold text-slate-200">Confirm password</label>
          {error === "Passwords dont match" && <p className="mb-2 text-xs font-bold text-red-300">Passwords dont match</p>}
          <Input
            type="password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              if (error) setError("");
            }}
            placeholder="Confirm password"
            className="rounded-2xl border-white/10 bg-white/10"
          />
        </div>
      )}

      {error && error !== "Passwords dont match" && <p className="mt-3 text-xs font-bold text-red-300">{error}</p>}
      {success && <p className="mt-3 text-xs font-bold text-emerald-300">{success}</p>}

      <div className="mt-5 flex justify-between gap-3">
        <Button variant="secondary" onClick={onCancel} className="rounded-2xl">
          Cancel
        </Button>
        {step === 1 ? (
          <Button onClick={continueToConfirm} className="rounded-2xl">
            Continue
          </Button>
        ) : (
          <Button onClick={confirmChange} disabled={isSaving || !confirmPassword} className="rounded-2xl">
            {isSaving ? "Saving..." : "Confirm"}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

function StatusRequestPanel({ onCancel, onSubmitStatusRequest }) {
  const [requestedStatus, setRequestedStatus] = useState("admin");
  const [reason, setReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function submit() {
    setIsSaving(true);
    const result = await onSubmitStatusRequest({
      requested_status: requestedStatus,
      reason: reason.trim(),
    });
    setIsSaving(false);

    if (result?.error) {
      setMessage(result.error);
      return;
    }

    setMessage("Status request sent.");
    window.setTimeout(() => onCancel(), 1200);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 14, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 14, scale: 0.98 }}
      className="absolute right-[17rem] top-12 z-50 w-[360px] rounded-[2rem] border border-white/10 bg-slate-950/95 p-5 text-slate-100 shadow-2xl shadow-black/50 backdrop-blur-xl max-md:right-0 max-md:top-[21rem]"
    >
      <div className="flex items-center gap-3">
        <label className="text-sm font-black text-slate-200">Request:</label>
        <select
          value={requestedStatus}
          onChange={(event) => setRequestedStatus(event.target.value)}
          className="flex-1 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none"
        >
          <option value="viewer" className="bg-slate-900">Viewer</option>
          <option value="priority" className="bg-slate-900">Priority</option>
          <option value="admin" className="bg-slate-900">Admin</option>
        </select>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-bold text-slate-200">Reasoning (optional)</label>
        <Textarea
          value={reason}
          maxLength={1000}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Explain why you should get this status..."
          className="min-h-28 resize-y rounded-2xl border-white/10 bg-white/10 pr-4"
        />
        <p className="mt-1 text-xs text-slate-500">{reason.length}/1000</p>
      </div>

      {message && <p className={cn("mt-3 text-xs font-bold", message.includes("sent") ? "text-emerald-300" : "text-red-300")}>{message}</p>}

      <div className="mt-5 flex justify-between gap-3">
        <Button variant="secondary" onClick={onCancel} className="rounded-2xl">
          Cancel
        </Button>
        <Button onClick={submit} disabled={isSaving} className="rounded-2xl">
          {isSaving ? "Sending..." : "Confirm"}
        </Button>
      </div>
    </motion.div>
  );
}

function PublicProfilePanel({ user, profile, onCancel, onUpdateProfile, onUploadAvatar }) {
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [handle, setHandle] = useState(profile?.handle || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event) {
    event.preventDefault();
    setIsSaving(true);

    let finalAvatarUrl = avatarUrl;

    if (avatarFile && onUploadAvatar) {
      finalAvatarUrl = await onUploadAvatar(avatarFile);
      if (!finalAvatarUrl) {
        setIsSaving(false);
        setMessage("Could not upload avatar.");
        return;
      }
    }

    const result = await onUpdateProfile({
      display_name: displayName,
      handle,
      bio,
      avatar_url: finalAvatarUrl,
    });
    setIsSaving(false);

    if (result?.error) {
      setMessage(result.error);
      return;
    }

    setMessage("Profile saved.");
    window.setTimeout(() => onCancel(), 900);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 14, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 14, scale: 0.98 }}
      className="absolute right-[17rem] top-12 z-50 w-[390px] rounded-[2rem] border border-white/10 bg-slate-950/95 p-5 text-slate-100 shadow-2xl shadow-black/50 backdrop-blur-xl max-md:right-0 max-md:top-[21rem]"
    >
      <h3 className="text-xl font-black">Edit public profile</h3>
      <p className="mt-1 text-xs text-slate-400">This is what other visitors can see on your PeePooList profile.</p>

      <form onSubmit={submit} className="mt-4 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-200">Avatar</label>
          <div className="flex items-center gap-4">
            <ProfileAvatar profile={{ ...profile, avatar_url: avatarPreview }} user={user} className="h-16 w-16 rounded-[1.4rem]" textClassName="text-2xl" />
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setAvatarFile(file);
                  setAvatarPreview(file ? URL.createObjectURL(file) : avatarUrl);
                }}
                className="rounded-2xl border-white/10 bg-white/10"
              />
              <p className="mt-1 text-xs text-slate-500">Square images work best. PNG, JPG, or WebP is fine.</p>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-200">Username</label>
          <Input
            value={displayName}
            maxLength={40}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder={user?.email?.split("@")[0] || "PeePooList user"}
            className="rounded-2xl border-white/10 bg-white/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-200">Handle</label>
          <div className="flex items-center overflow-hidden rounded-2xl border border-white/10 bg-white/10">
            <span className="px-3 text-slate-400">@</span>
            <input
              value={handle}
              maxLength={24}
              onChange={(event) => setHandle(normalizeHandle(event.target.value))}
              placeholder="your_handle"
              className="h-10 flex-1 bg-transparent px-1 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none"
            />
          </div>
          <p className="mt-1 text-xs text-slate-500">3–24 characters. Lowercase letters, numbers, and underscores only.</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-200">Bio</label>
          <Textarea
            value={bio}
            maxLength={240}
            onChange={(event) => setBio(event.target.value)}
            placeholder="Write a tiny bio..."
            className="min-h-24 resize-y rounded-2xl border-white/10 bg-white/10"
          />
          <p className="mt-1 text-xs text-slate-500">{bio.length}/240</p>
        </div>

        {message && <p className={cn("text-xs font-bold", message.includes("saved") ? "text-emerald-300" : "text-red-300")}>{message}</p>}

        <div className="flex justify-between gap-3">
          <Button variant="secondary" onClick={onCancel} className="rounded-2xl">Cancel</Button>
          <Button type="submit" disabled={isSaving} className="rounded-2xl">{isSaving ? "Saving..." : "Save profile"}</Button>
        </div>
      </form>
    </motion.div>
  );
}


function MoreMenu({ tab, setTab, user, isAdmin }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [tab]);

  const items = [
    { tab: "changelog", label: "Changelog + Chat", show: true },
    { tab: "my-requests", label: "My Requests", show: Boolean(user) },
    { tab: "rules", label: "Rules", show: true },
    { tab: "about", label: "About", show: true },
    { tab: "privacy", label: "Privacy Policy", show: true },
    { tab: "contact", label: "Contact", show: true },
    { tab: "admin", label: "Admin", show: Boolean(isAdmin) },
  ].filter((item) => item.show);

  return (
    <div className="relative">
      <Button onClick={() => setOpen((value) => !value)} variant="secondary" className="rounded-2xl">
        Menu <ChevronDown className="ml-2 h-4 w-4" />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="absolute right-0 top-12 z-50 w-56 rounded-[1.5rem] border border-white/10 bg-slate-950/95 p-2 text-slate-100 shadow-2xl shadow-black/50 backdrop-blur-xl"
          >
            {items.map((item) => (
              <button
                key={item.tab}
                onClick={() => {
                  setTab(item.tab);
                  setOpen(false);
                }}
                className={cn(
                  "block w-full rounded-2xl px-4 py-3 text-left text-sm font-bold transition hover:bg-white/10",
                  tab === item.tab ? "bg-white text-slate-950 hover:bg-white" : "text-slate-200"
                )}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileMenu({ tab, user, isAdmin, profile, onSignOut, onDeleteAccount, onChangeEmail, onChangePassword, onSubmitStatusRequest, onUpdateProfile, onUploadAvatar, onOpenProfile }) {
  const [open, setOpen] = useState(false);
  const [activePanel, setActivePanel] = useState("");

  useEffect(() => {
    setOpen(false);
    setActivePanel("");
  }, [tab]);

  function closeSidePanel() {
    setActivePanel("");
  }

  return (
    <div className="relative">
      <Button
        onClick={() => {
          setOpen((value) => !value);
          setActivePanel("");
        }}
        variant="secondary"
        className="rounded-2xl"
      >
        {user ? (
          <ProfileAvatar profile={profile} user={user} className="mr-2 h-5 w-5 rounded-lg" textClassName="text-xs" />
        ) : (
          <UserCircle className="mr-2 h-4 w-4" />
        )}
        Profile
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="absolute right-0 top-12 z-50 w-64 rounded-[2rem] border border-white/10 bg-slate-950/95 p-4 text-slate-100 shadow-2xl shadow-black/50 backdrop-blur-xl"
          >
            {user ? (
              <>
                <div className="mb-3 flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <ProfileAvatar profile={profile} user={user} className="h-11 w-11 rounded-xl" textClassName="text-lg" />
                  <div className="min-w-0">
                    <p className="break-words text-sm font-bold text-white">{profileLabel(profile, user)}</p>
                    <p className="mt-1 text-xs text-emerald-200">@{profileHandle(profile, user)}</p>
                    <p className="mt-1 break-all text-[11px] text-slate-500">{user.email}</p>
                    <p className="mt-1 text-xs text-slate-400">Status: {roleName(profile?.role)}</p>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setOpen(false);
                      setActivePanel("");
                      onOpenProfile();
                    }}
                    className="justify-start rounded-2xl"
                  >
                    <UserCircle className="mr-2 h-4 w-4" /> View Profile
                  </Button>
                  <Button variant="secondary" onClick={() => setActivePanel("public-profile")} className="justify-start rounded-2xl">
                    <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                  <Button variant="secondary" onClick={() => setActivePanel("email")} className="justify-start rounded-2xl">
                    <Mail className="mr-2 h-4 w-4" /> Change Email
                  </Button>
                  <Button variant="secondary" onClick={() => setActivePanel("password")} className="justify-start rounded-2xl">
                    <KeyRound className="mr-2 h-4 w-4" /> Change Password
                  </Button>
                  <Button variant="secondary" onClick={() => setActivePanel("status")} className="justify-start rounded-2xl">
                    <UserCog className="mr-2 h-4 w-4" /> Request Admin
                  </Button>
                  <Button onClick={onSignOut} variant="secondary" className="mt-2 justify-start rounded-2xl">
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </Button>
                  <Button onClick={onDeleteAccount} variant="destructive" className="justify-start rounded-2xl">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete account
                  </Button>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
                Sign in on the Home page to use profile settings.
              </div>
            )}
          </motion.div>
        )}

        {open && activePanel === "public-profile" && user && (
          <PublicProfilePanel user={user} profile={profile} onCancel={closeSidePanel} onUpdateProfile={onUpdateProfile} onUploadAvatar={onUploadAvatar} />
        )}

        {open && activePanel === "email" && user && (
          <ChangeEmailPanel user={user} onCancel={closeSidePanel} onChangeEmail={onChangeEmail} />
        )}

        {open && activePanel === "password" && user && (
          <ChangePasswordPanel onCancel={closeSidePanel} onChangePassword={onChangePassword} />
        )}

        {open && activePanel === "status" && user && (
          <StatusRequestPanel onCancel={closeSidePanel} onSubmitStatusRequest={onSubmitStatusRequest} />
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationsMenu({ tab, user, isAdmin, requests, statusRequests, reports, notifications, onMarkNotificationsRead }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [tab]);

  const adminItems = [
    ...(requests || []).map((request) => ({
      id: `level-${request.id}`,
      title: "New level request",
      message: `${request.requester_email || "Someone"} requested ${request.action} on ${request.list_type}: ${request.name || "Unnamed level"}.`,
    })),
    ...(statusRequests || []).map((request) => ({
      id: `status-${request.id}`,
      title: "New status request",
      message: `${request.requester_email || "Someone"} requested ${readableStatus(request.requested_status)} status.`,
    })),
    ...(reports || []).filter((report) => report.status === "pending").map((report) => ({
      id: `report-${report.id}`,
      title: "New report",
      message: `${report.reporter_email || "Someone"} reported ${report.level_name || "a level"} for ${String(report.reason_type || "other").replaceAll("_", " ")}.`,
    })),
  ];

  const userItems = notifications || [];
  const unreadCount = isAdmin ? adminItems.length : userItems.filter((item) => !item.is_read).length;
  const displayCount = unreadCount > 9 ? "9+" : String(unreadCount);

  return (
    <div className="relative">
      <Button onClick={() => setOpen((value) => !value)} variant="secondary" className="relative rounded-2xl">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -bottom-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white">
            {displayCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="absolute right-0 top-12 z-50 w-80 rounded-[2rem] border border-white/10 bg-slate-950/95 p-4 text-slate-100 shadow-2xl shadow-black/50 backdrop-blur-xl"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-lg font-black">Notifications</h3>
              {!isAdmin && userItems.some((item) => !item.is_read) && (
                <button onClick={onMarkNotificationsRead} className="text-xs font-bold text-yellow-200 hover:text-yellow-100">
                  Mark read
                </button>
              )}
            </div>

            {!user ? (
              <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-400">Sign in to view notifications.</p>
            ) : isAdmin ? (
              adminItems.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-400">No new admin requests.</p>
              ) : (
                <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                  {adminItems.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                      <p className="text-sm font-black text-white">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-300">{item.message}</p>
                    </div>
                  ))}
                </div>
              )
            ) : userItems.length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-400">No notifications yet.</p>
            ) : (
              <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {userItems.map((item) => (
                  <div key={item.id} className={cn("rounded-2xl border p-3", item.is_read ? "border-white/10 bg-white/[0.03]" : "border-yellow-300/30 bg-yellow-300/10")}>
                    <p className="text-sm font-black text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-300">{item.message}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusRequestsPanel({ statusRequests, onApprove, onDeny }) {
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState("");

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 text-slate-300">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-black text-white">Admin status requests</h3>
          <p className="mt-1 text-sm text-slate-400">Review requests for Viewer, Priority, and Admin access.</p>
        </div>
        <Button onClick={() => setOpen((value) => !value)} variant="secondary" className="rounded-2xl">
          <Inbox className="mr-2 h-4 w-4" /> View status change requests ({statusRequests.length})
        </Button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mt-5 space-y-3">
            {statusRequests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-slate-400">No pending status change requests.</div>
            ) : (
              statusRequests.map((request) => {
                const isExpanded = expandedId === request.id;

                return (
                  <div key={request.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <button
                      onClick={() => setExpandedId(isExpanded ? "" : request.id)}
                      className="flex w-full items-center gap-3 text-left"
                    >
                      <span className="max-w-[55%] truncate rounded-xl bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-200">
                        {request.requester_email || "Unknown email"}
                      </span>
                      <span className="rounded-xl bg-blue-500/20 px-2.5 py-1 text-xs font-bold text-blue-200">
                        {readableStatus(request.requested_status)}
                      </span>
                      <span className="ml-auto rounded-xl bg-white/10 p-2 text-slate-200">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </span>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-sm text-slate-300">{request.reason || "No reasoning provided."}</p>
                            <div className="mt-4 flex justify-between gap-3">
                              <Button onClick={() => onDeny(request)} variant="destructive" className="rounded-2xl">
                                Decline
                              </Button>
                              <Button onClick={() => onApprove(request)} className="rounded-2xl bg-emerald-600 hover:bg-emerald-500">
                                Accept
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function SiteShell({ children, tab, setTab, isAdmin, user, profile, signOut, deleteAccount, changeEmail, changePassword, submitStatusRequest, updateProfile, uploadAvatar, requests, statusRequests, reports, notifications, markNotificationsRead }) {
  return (
    <div className="min-h-screen bg-[#090d18] text-slate-100 selection:bg-yellow-300 selection:text-black">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0c1220]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <button onClick={() => setTab("home")} className="group flex items-center gap-3 text-left">
            <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-[#007a55] shadow-lg shadow-emerald-900/30 transition group-hover:scale-105">
              <img src="/logo.png" alt="PeePooList logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight md:text-3xl">PeePooList</h1>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">peepoolist.com</p>
            </div>
          </button>

          <nav className="flex flex-wrap items-center gap-2">
            <Button variant={tab === "home" ? "default" : "secondary"} onClick={() => setTab("home")} className="rounded-2xl">
              <Home className="mr-2 h-4 w-4" /> Home
            </Button>
            <Button variant={tab === "pooplist" ? "default" : "secondary"} onClick={() => setTab("pooplist")} className="rounded-2xl">
              The Pooplist
            </Button>
            <Button variant={tab === "peelist" ? "default" : "secondary"} onClick={() => setTab("peelist")} className="rounded-2xl">
              The Peelist
            </Button>
            <Button variant={tab === "stats" ? "default" : "secondary"} onClick={() => setTab("stats")} className="rounded-2xl">
              Stats
            </Button>
            <MoreMenu tab={tab} setTab={setTab} user={user} isAdmin={isAdmin} />
            <NotificationsMenu
              tab={tab}
              user={user}
              isAdmin={isAdmin}
              requests={requests}
              statusRequests={statusRequests}
              reports={reports}
              notifications={notifications}
              onMarkNotificationsRead={markNotificationsRead}
            />
            <ProfileMenu
              tab={tab}
              user={user}
              isAdmin={isAdmin}
              profile={profile}
              onSignOut={signOut}
              onDeleteAccount={deleteAccount}
              onChangeEmail={changeEmail}
              onChangePassword={changePassword}
              onSubmitStatusRequest={submitStatusRequest}
              onUpdateProfile={updateProfile}
              onUploadAvatar={uploadAvatar}
              onOpenProfile={() => setTab(userProfileTab(profile?.handle || user?.id))}
            />
          </nav>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-8">{children}</main>

      <footer className="relative mx-auto max-w-6xl px-4 pb-8">
        <div className="flex flex-wrap items-center justify-center gap-3 rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-400">
          <button onClick={() => setTab("about")} className="font-semibold text-slate-200 hover:text-white">
            About
          </button>
          <span className="text-slate-700">•</span>
          <button onClick={() => setTab("rules")} className="font-semibold text-slate-200 hover:text-white">
            Rules
          </button>
          <span className="text-slate-700">•</span>
          <button onClick={() => setTab("changelog")} className="font-semibold text-slate-200 hover:text-white">
            Changelog
          </button>
          <span className="text-slate-700">•</span>
          <button onClick={() => setTab("stats")} className="font-semibold text-slate-200 hover:text-white">
            Stats
          </button>
          {isAdmin && (
            <>
              <span className="text-slate-700">•</span>
              <button onClick={() => setTab("admin")} className="font-semibold text-slate-200 hover:text-white">
                Admin
              </button>
            </>
          )}
          <span className="text-slate-700">•</span>
          <button onClick={() => setTab("privacy")} className="font-semibold text-slate-200 hover:text-white">
            Privacy Policy
          </button>
          <span className="text-slate-700">•</span>
          <button onClick={() => setTab("contact")} className="font-semibold text-slate-200 hover:text-white">
            Contact
          </button>
          <span className="hidden text-slate-700 sm:inline">•</span>
          <span className="w-full text-center sm:w-auto">PeePooList is a parody Geometry Dash ranking site.</span>
        </div>
      </footer>
    </div>
  );
}

function AuthBox({ user, isAdmin, signIn, signUp, signInWithGoogle, signInWithGithub, signOut, authEmail, setAuthEmail, authPassword, setAuthPassword, authMessage, isConfigured }) {
  return (
    <Card className="rounded-[2rem] border-white/10 bg-slate-950/70 text-slate-100 shadow-2xl shadow-black/30">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
            {isAdmin ? <ShieldCheck className="h-5 w-5 text-emerald-300" /> : <Mail className="h-5 w-5 text-yellow-200" />}
          </div>
          <div>
            <h3 className="text-xl font-bold">Secure sign in</h3>
            <p className="text-sm text-slate-400">Admin access is checked by the database, not a page password.</p>
          </div>
        </div>

        {!isConfigured && (
          <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
            Supabase is not configured yet. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables to enable secure login and live data.
          </div>
        )}

        {user ? (
          <>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
              Signed in as <span className="font-semibold text-white">{user.email}</span>
              <div className={isAdmin ? "mt-2 text-emerald-300" : "mt-2 text-slate-400"}>
                {isAdmin ? "Admin permissions active." : "Standard user permissions active."}
              </div>
            </div>
            <Button onClick={signOut} variant="secondary" className="w-full rounded-2xl">
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </>
        ) : (
          <>
            <Input
              type="email"
              placeholder="Email address"
              value={authEmail}
              onChange={(event) => setAuthEmail(event.target.value)}
              className="rounded-2xl border-white/10 bg-white/10"
              disabled={!isConfigured}
            />
            <Input
              type="password"
              placeholder="Password"
              value={authPassword}
              onChange={(event) => setAuthPassword(event.target.value)}
              className="rounded-2xl border-white/10 bg-white/10"
              disabled={!isConfigured}
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <Button onClick={signIn} className="w-full rounded-2xl" disabled={!isConfigured || !authEmail.trim() || !authPassword}>
                Sign in
              </Button>
              <Button onClick={signUp} variant="secondary" className="w-full rounded-2xl" disabled={!isConfigured || !authEmail.trim() || !authPassword}>
                Create account
              </Button>
            </div>
            <Button onClick={signInWithGoogle} variant="secondary" className="w-full rounded-2xl" disabled={!isConfigured}>
              <span className="mr-2 grid h-5 w-5 place-items-center rounded-full bg-white text-sm font-black text-slate-950">G</span>
              Sign in with Google
            </Button>
            <Button onClick={signInWithGithub} variant="secondary" className="w-full rounded-2xl" disabled={!isConfigured}>
              <span className="mr-2 grid h-5 w-5 place-items-center rounded-full bg-white text-sm font-black text-slate-950">⌘</span>
              Sign in with GitHub
            </Button>
          </>
        )}

        {authMessage && <p className="text-sm text-slate-300">{authMessage}</p>}
      </CardContent>
    </Card>
  );
}

function HomePage({ user, isAdmin, signIn, signUp, signInWithGoogle, signInWithGithub, signOut, authEmail, setAuthEmail, authPassword, setAuthPassword, authMessage, requestCount, statusRequests, approveStatusRequest, denyStatusRequest, isConfigured, levels, changelogEntries, chatMessages, publicProfiles, userBadges, setTab }) {
  const poopLevels = levels?.pooplist || [];
  const peeLevels = levels?.peelist || [];
  const allLevels = [
    ...poopLevels.map((level) => ({ ...level, list_name: "Pooplist" })),
    ...peeLevels.map((level) => ({ ...level, list_name: "Peelist" })),
  ];
  const newestLevel = [...allLevels].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))[0];
  const latestUpdate = [...(changelogEntries || [])].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))[0];
  const recentChat = (chatMessages || []).slice(0, 3);
  const totalBadges = (userBadges || []).length;

  const homeStats = [
    ["Pooplist", poopLevels.length, "possible levels", "pooplist"],
    ["Peelist", peeLevels.length, "impossible levels", "peelist"],
    ["Profiles", (publicProfiles || []).length, "public users", "stats"],
    ["Badges", totalBadges, "earned/awarded", "stats"],
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
        <Card className="overflow-hidden rounded-[2rem] border-white/10 bg-white/[0.04] text-slate-100 shadow-2xl shadow-black/30">
          <CardContent className="p-7 md:p-10">
            <Badge className="mb-5 rounded-xl bg-yellow-300 text-black">Geometry Dash challenge rankings</Badge>
            <h2 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">A Geometry Dash level list for PeePooList rankings.</h2>
            <p className="mt-5 max-w-2xl text-lg text-slate-300">
              PeePooList ranks Geometry Dash levels in two categories: possible levels on <b>The Pooplist</b> and impossible levels on <b>The Peelist</b>. Browse the ranked lists, submit change requests, check updates, and talk about the placements.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Button onClick={() => setTab("pooplist")} className="rounded-2xl bg-[#c0ffbf] text-slate-950 hover:bg-[#d3ffd2]">
                View The Pooplist
              </Button>
              <Button onClick={() => setTab("peelist")} variant="secondary" className="rounded-2xl">
                View The Peelist
              </Button>
              <Button onClick={() => setTab("changelog")} variant="secondary" className="rounded-2xl">
                Changelog + Chat
              </Button>
              <Button onClick={() => setTab("stats")} variant="secondary" className="rounded-2xl">
                Site Stats
              </Button>
            </div>
          </CardContent>
        </Card>

        <AuthBox
          user={user}
          isAdmin={isAdmin}
          signIn={signIn}
          signUp={signUp}
          signInWithGoogle={signInWithGoogle}
          signInWithGithub={signInWithGithub}
          signOut={signOut}
          authEmail={authEmail}
          setAuthEmail={setAuthEmail}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          authMessage={authMessage}
          isConfigured={isConfigured}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {homeStats.map(([label, value, body, target]) => (
          <button
            key={label}
            onClick={() => setTab(target)}
            className="rounded-[1.7rem] border border-white/10 bg-slate-950/70 p-5 text-left transition hover:-translate-y-0.5 hover:bg-white/[0.06]"
          >
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">{label}</p>
            <p className="mt-2 text-4xl font-black text-white">{value}</p>
            <p className="mt-1 text-sm text-slate-400">{body}</p>
          </button>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-[2rem] border-white/10 bg-slate-950/80 text-slate-100 shadow-2xl shadow-black/30">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black">Newest level</h3>
            {newestLevel ? (
              <div className="mt-4">
                <img src={imageFor(newestLevel, Math.max(0, Number(newestLevel.rank || 1) - 1), newestLevel.list_type)} alt={`${newestLevel.name} thumbnail`} className="h-36 w-full rounded-2xl border border-white/10 object-cover" />
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">{newestLevel.list_name} · #{newestLevel.rank}</p>
                <h4 className="mt-1 text-xl font-black">{newestLevel.name}</h4>
                <p className="mt-1 text-sm text-slate-400">Creator: {newestLevel.creator || "Unknown"}</p>
                <Button onClick={() => setTab(levelDetailTab(newestLevel.id))} variant="secondary" className="mt-4 w-full rounded-2xl">
                  Open level page
                </Button>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">No levels loaded yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/10 bg-slate-950/80 text-slate-100 shadow-2xl shadow-black/30">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black">Latest update</h3>
            {latestUpdate ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <Badge className="rounded-xl bg-cyan-500/20 text-cyan-200">{latestUpdate.kind || "update"}</Badge>
                <h4 className="mt-3 text-xl font-black">{latestUpdate.title}</h4>
                {latestUpdate.body && <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-300">{latestUpdate.body}</p>}
                <p className="mt-3 text-xs text-slate-500">{formatDateTime(latestUpdate.created_at)}</p>
                <Button onClick={() => setTab("changelog")} variant="secondary" className="mt-4 w-full rounded-2xl">
                  View changelog
                </Button>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">No changelog updates yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/10 bg-slate-950/80 text-slate-100 shadow-2xl shadow-black/30">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black">Recent chat</h3>
            <div className="mt-4 space-y-3">
              {recentChat.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 p-5 text-center text-sm text-slate-500">No chat messages yet.</div>
              ) : (
                recentChat.map((message) => (
                  <div key={message.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs text-slate-500">{message.display_name || "User"} · {formatDateTime(message.created_at)}</p>
                    <p className="mt-1 line-clamp-3 text-sm text-slate-200">{message.message}</p>
                  </div>
                ))
              )}
            </div>
            <Button onClick={() => setTab("changelog")} variant="secondary" className="mt-4 w-full rounded-2xl">
              Open chat
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["💩", "Pooplist", "Ranked levels that are considered possible."],
          ["💧", "Peelist", "Ranked levels that are considered impossible."],
          ["🧻", "Requests", "Signed-in users can suggest additions, removals, reports, and edits for admin review."],
        ].map(([emoji, title, body]) => (
          <Card key={title} className="rounded-[1.7rem] border-white/10 bg-white/[0.04] text-slate-100">
            <CardContent className="p-6">
              <div className="mb-4 text-4xl">{emoji}</div>
              <h3 className="text-2xl font-black">{title}</h3>
              <p className="mt-2 text-slate-400">{body}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 text-slate-300">
        <h3 className="text-xl font-black text-white">Safety and moderation</h3>
        <p className="mt-2 text-sm leading-6">
          Level editing, reports, comments, profiles, and chat are protected by Supabase Auth and database Row Level Security. New chat messages and level comments also have cooldown limits to slow down spam.
        </p>
        <p className="mt-3 text-sm text-slate-400">Pending requests visible to admins: <span className="font-bold text-white">{requestCount}</span></p>
      </section>

      {isAdmin && (
        <StatusRequestsPanel
          statusRequests={statusRequests}
          onApprove={approveStatusRequest}
          onDeny={denyStatusRequest}
        />
      )}

      <footer className="rounded-[2rem] border border-yellow-300/30 bg-yellow-300/10 p-6 text-yellow-100">
        <h3 className="text-xl font-black">Disclaimer</h3>
        <p className="mt-2 text-sm leading-6">
          This website is a joke. The PeePooList, The Pooplist, and The Peelist are parody rankings and should not be taken seriously, used for drama, or treated as an actual official Geometry Dash Demonlist. Please laugh responsibly.
        </p>
      </footer>
    </motion.div>
  );
}


function InfoPageShell({ title, eyebrow, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 md:p-8">
        <Badge className="mb-4 rounded-xl bg-emerald-500/20 text-emerald-200">{eyebrow}</Badge>
        <h2 className="text-4xl font-black tracking-tight md:text-6xl">{title}</h2>
      </section>

      <Card className="rounded-[2rem] border-white/10 bg-slate-950/80 text-slate-100 shadow-2xl shadow-black/30">
        <CardContent className="space-y-5 p-6 leading-7 text-slate-300 md:p-8">{children}</CardContent>
      </Card>
    </motion.div>
  );
}

function AboutPage() {
  return (
    <InfoPageShell title="About PeePooList" eyebrow="About">
      <p>
        PeePooList is a parody Geometry Dash ranking website. It organizes levels into two joke categories:
        <b className="text-white"> The Pooplist</b> for possible levels and <b className="text-white">The Peelist</b> for impossible levels.
      </p>
      <p>
        The site lets visitors browse rankings and lets signed-in users submit level additions, removals, or edits for admin review.
      </p>
      <p>
        PeePooList is not an official Geometry Dash Demonlist, RobTop Games website, or competitive authority. It is made for entertainment.
      </p>
    </InfoPageShell>
  );
}

function PrivacyPolicyPage() {
  return (
    <InfoPageShell title="Privacy Policy" eyebrow="Privacy">
      <p>
        Last updated: August 30, 2026
      </p>

      <div>
        <h3 className="text-xl font-black text-white">Information we collect</h3>
        <p className="mt-2">
          PeePooList uses Supabase for accounts, login, user roles, level requests, notifications, and uploaded thumbnails.
          If you create an account, we may store your email address, user ID, profile role, submitted requests, uploaded images, and related timestamps.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-black text-white">How we use information</h3>
        <p className="mt-2">
          We use account and request information to run the site, show the ranked lists, review submissions, prevent abuse, and keep admin features secure.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-black text-white">Ads and cookies</h3>
        <p className="mt-2">
          PeePooList may use Google AdSense to show ads. Third parties, including Google, may place and read cookies on your browser,
          or use web beacons, IP addresses, and similar technologies to collect information as a result of ad serving on this site.
          Google may use this information to show personalized or non-personalized ads.
        </p>
        <p className="mt-2">
          You can learn more about how Google uses information from sites that use its services at
          <a className="break-words font-semibold text-emerald-200 hover:text-emerald-100" href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer"> Google’s partner sites page</a>,
          and you can manage ad personalization at
          <a className="break-words font-semibold text-emerald-200 hover:text-emerald-100" href="https://adssettings.google.com/" target="_blank" rel="noreferrer"> Google Ad Settings</a>.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-black text-white">User-submitted content</h3>
        <p className="mt-2">
          Users may submit level names, creator names, verifier names, links, reasons, and thumbnails. Do not submit private information,
          copyrighted images you do not have permission to use, malware links, or abusive content.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-black text-white">Account deletion</h3>
        <p className="mt-2">
          Signed-in users can request account deletion from the account area. Deleting an account removes the login account, but some public list changes
          or moderation records may remain if needed to keep the site working and prevent abuse.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-black text-white">Contact</h3>
        <p className="mt-2">
          For privacy or site questions, contact the site owner at
          <a className="ml-1 font-semibold text-emerald-200 hover:text-emerald-100" href="mailto:peepoolistvercelapp@gmail.com">peepoolistvercelapp@gmail.com</a>.
        </p>
      </div>
    </InfoPageShell>
  );
}

function ContactPage() {
  return (
    <InfoPageShell title="Contact" eyebrow="Contact">
      <p>
        For PeePooList questions, bug reports, privacy questions, or site issues, email:
      </p>
      <p>
        <a className="break-words text-2xl font-black text-emerald-200 hover:text-emerald-100" href="mailto:peepoolistvercelapp@gmail.com">
          peepoolistvercelapp@gmail.com
        </a>
      </p>
      <p>
        For level changes, signed-in users should use the request and edit buttons on The Pooplist or The Peelist pages.
      </p>
    </InfoPageShell>
  );
}

function RulesPage() {
  return (
    <InfoPageShell title="List Rules" eyebrow="Rules">
      <div>
        <h3 className="text-xl font-black text-white">What the lists mean</h3>
        <p className="mt-2">
          <b className="text-white">The Pooplist</b> is for levels that are treated as possible. <b className="text-white">The Peelist</b> is for levels that are treated as impossible or not reasonably verified.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-black text-white">Submitting changes</h3>
        <p className="mt-2">
          Signed-in users can submit additions, removals, and edits. Requests are reviewed before they change the public lists.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-black text-white">Allowed content</h3>
        <p className="mt-2">
          Submissions should be about Geometry Dash levels. Do not submit private information, malware links, shock content, hateful content, sexual content, or thumbnails you do not have permission to use.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-black text-white">Placement decisions</h3>
        <p className="mt-2">
          Rankings are handled by the site admin. PeePooList is a parody site, so placements are not official competitive rulings.
        </p>
      </div>
    </InfoPageShell>
  );
}

function MyRequestsPage({ requests, user, setTab }) {
  if (!user) {
    return (
      <InfoPageShell title="My Requests" eyebrow="Account">
        <p>Sign in before checking your submitted requests.</p>
        <Button onClick={() => setTab("home")} className="rounded-2xl">Go to sign in</Button>
      </InfoPageShell>
    );
  }

  const statusStyles = {
    pending: "bg-yellow-300/20 text-yellow-100",
    approved: "bg-emerald-500/20 text-emerald-200",
    denied: "bg-red-500/20 text-red-200",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 md:p-8">
        <Badge className="mb-4 rounded-xl bg-blue-500/20 text-blue-200">Account</Badge>
        <h2 className="text-4xl font-black tracking-tight md:text-6xl">My Requests</h2>
        <p className="mt-3 max-w-2xl text-slate-300">Track the level changes you submitted for admin review.</p>
      </section>

      {requests.length === 0 ? (
        <Card className="rounded-[2rem] border-white/10 bg-slate-950/80 text-slate-100">
          <CardContent className="p-8 text-center text-slate-400">
            You have not submitted any level requests yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <Card key={request.id} className="rounded-[1.5rem] border-white/10 bg-slate-950/80 text-slate-100">
              <CardContent className="p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="rounded-xl bg-white/10 text-white">{String(request.action || "request").toUpperCase()}</Badge>
                      <Badge className="rounded-xl bg-white/10 text-white">{request.list_type === "pooplist" ? "Pooplist" : "Peelist"}</Badge>
                      <Badge className={cn("rounded-xl", statusStyles[request.status] || "bg-slate-700 text-slate-200")}>{String(request.status || "pending").toUpperCase()}</Badge>
                    </div>
                    <h3 className="mt-3 text-2xl font-black">{request.name || "Unnamed level"}</h3>
                    <p className="mt-1 text-sm text-slate-400">Top #{request.rank || 1} · Creator: {request.creator || "Unknown"} · Verifier: {request.verifier || "Unknown"}</p>
                    {request.reason && <p className="mt-3 text-sm text-slate-300">“{request.reason}”</p>}
                  </div>
                  <p className="text-xs text-slate-500">{request.created_at ? new Date(request.created_at).toLocaleString() : ""}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}



function UserProfilePage({ profile, badges, viewer, isAdmin, onBack, onAwardBadge, onDeleteBadge }) {
  const [badgeForm, setBadgeForm] = useState({ label: "", description: "", color: "emerald" });
  const [isSavingBadge, setIsSavingBadge] = useState(false);
  const [message, setMessage] = useState("");
  const userBadges = badges || [];
  const achievements = achievementList(profile, userBadges);
  const isOwnProfile = viewer?.id === profile?.user_id;
  const shareUrl = profileShareUrl(profile?.handle || profile?.user_id);

  async function copyProfileLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setMessage("Profile link copied.");
    } catch {
      setMessage(shareUrl);
    }
  }

  async function submitBadge(event) {
    event.preventDefault();
    if (!isAdmin || !badgeForm.label.trim()) return;
    setIsSavingBadge(true);
    const result = await onAwardBadge(profile.user_id, badgeForm);
    setIsSavingBadge(false);

    if (result?.error) {
      setMessage(result.error);
      return;
    }

    setBadgeForm({ label: "", description: "", color: "emerald" });
    setMessage("Badge awarded.");
  }

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/50 shadow-2xl shadow-black/25">
        <div className="p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <ProfileAvatar profile={profile} className="h-20 w-20 rounded-[1.7rem]" textClassName="text-3xl" />
              <div>
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge className={roleBadgeClass(profile?.role)}>{roleName(profile?.role)}</Badge>
                  {isOwnProfile && <Badge className="rounded-xl bg-blue-500/20 text-blue-200">You</Badge>}
                </div>
                <h2 className="break-words text-4xl font-black tracking-tight md:text-6xl">{profileLabel(profile)}</h2>
                <p className="mt-2 text-lg font-bold text-emerald-200">@{profileHandle(profile)}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={copyProfileLink} variant="secondary" className="rounded-2xl">Copy profile link</Button>
              <Button onClick={onBack} variant="secondary" className="rounded-2xl">Back</Button>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Bio</h3>
            <p className="mt-2 whitespace-pre-wrap text-slate-200">{profile?.bio?.trim() || "This user has not written a bio yet."}</p>
          </div>

          {message && <p className="mt-4 text-sm font-bold text-emerald-200">{message}</p>}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card className="rounded-[2rem] border-white/10 bg-slate-950/80 text-slate-100 shadow-2xl shadow-black/30">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black">Badges</h3>
            <p className="mt-1 text-sm text-slate-400">Custom badges awarded by admins.</p>

            {userBadges.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-white/15 p-8 text-center text-slate-500">No custom badges yet.</div>
            ) : (
              <div className="mt-5 grid gap-3">
                {userBadges.map((badge) => (
                  <div key={badge.id} className={cn("rounded-2xl border p-4", badgeColorClass(badge.badge_color))}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-lg font-black">{badge.badge_label}</h4>
                        {badge.badge_description && <p className="mt-1 text-sm opacity-80">{badge.badge_description}</p>}
                        <p className="mt-2 text-xs opacity-60">Awarded {formatDateTime(badge.awarded_at)}</p>
                      </div>
                      {isAdmin && (
                        <button onClick={() => onDeleteBadge(badge.id)} className="rounded-xl bg-black/25 px-3 py-1 text-xs font-bold text-white hover:bg-black/40">
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/10 bg-slate-950/80 text-slate-100 shadow-2xl shadow-black/30">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black">Achievements</h3>
            <p className="mt-1 text-sm text-slate-400">Automatic profile milestones.</p>
            <div className="mt-5 grid gap-3">
              {achievements.map((achievement) => (
                <div key={achievement.key} className={cn("rounded-2xl border p-4", badgeColorClass(achievement.color))}>
                  <h4 className="text-lg font-black">{achievement.label}</h4>
                  <p className="mt-1 text-sm opacity-80">{achievement.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {isAdmin && (
        <Card className="rounded-[2rem] border-yellow-300/30 bg-yellow-300/10 text-yellow-50 shadow-2xl shadow-black/30">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black">Award a badge</h3>
            <form onSubmit={submitBadge} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_160px_auto]">
              <Input value={badgeForm.label} onChange={(event) => setBadgeForm((current) => ({ ...current, label: event.target.value }))} placeholder="Badge name" className="rounded-2xl border-white/10 bg-black/20" />
              <Input value={badgeForm.description} onChange={(event) => setBadgeForm((current) => ({ ...current, description: event.target.value }))} placeholder="Description" className="rounded-2xl border-white/10 bg-black/20" />
              <select value={badgeForm.color} onChange={(event) => setBadgeForm((current) => ({ ...current, color: event.target.value }))} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none">
                <option value="emerald" className="bg-slate-900">Green</option>
                <option value="yellow" className="bg-slate-900">Yellow</option>
                <option value="cyan" className="bg-slate-900">Cyan</option>
                <option value="purple" className="bg-slate-900">Purple</option>
                <option value="red" className="bg-slate-900">Red</option>
                <option value="slate" className="bg-slate-900">Slate</option>
              </select>
              <Button type="submit" disabled={isSavingBadge || !badgeForm.label.trim()} className="rounded-2xl">
                {isSavingBadge ? "Awarding..." : "Award"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

function ReportLevelPanel({ level, user, onSubmit, onCancel }) {
  const [reasonType, setReasonType] = useState("broken_link");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    await onSubmit(level, reasonType, details);
    setIsSubmitting(false);
    onCancel();
  }

  return (
    <Card className="mx-auto max-w-[800px] rounded-[2rem] border-red-400/30 bg-red-950/40 text-slate-100 shadow-2xl shadow-black/30">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black">Report {level?.name || "level"}</h3>
            <p className="mt-1 text-sm text-slate-300">Reports go to admins for review. Use this for broken links, bad thumbnails, wrong info, or unsafe content.</p>
          </div>
          <Button onClick={onCancel} variant="secondary" className="rounded-2xl">Close</Button>
        </div>

        {!user && (
          <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
            Sign in before reporting a level.
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Reason</label>
            <select
              value={reasonType}
              onChange={(event) => setReasonType(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-white outline-none"
            >
              <option value="bad_thumbnail" className="bg-slate-900">Bad thumbnail</option>
              <option value="broken_link" className="bg-slate-900">Broken link</option>
              <option value="wrong_info" className="bg-slate-900">Wrong information</option>
              <option value="inappropriate_content" className="bg-slate-900">Inappropriate content</option>
              <option value="spam" className="bg-slate-900">Spam</option>
              <option value="other" className="bg-slate-900">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Details</label>
            <Textarea
              value={details}
              onChange={(event) => setDetails(event.target.value.slice(0, 1000))}
              placeholder="Explain what is wrong..."
              className="min-h-28 rounded-2xl border-white/10 bg-white/10"
            />
            <p className="mt-1 text-xs text-slate-500">{details.length}/1000</p>
          </div>

          <Button type="submit" disabled={!user || isSubmitting} variant="destructive" className="w-full rounded-2xl">
            <AlertTriangle className="mr-2 h-4 w-4" />
            {isSubmitting ? "Submitting report..." : "Submit report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ReportsPanel({ reports, onResolve, onDismiss }) {
  return (
    <Card className="rounded-[2rem] border-white/10 bg-slate-950/95 text-slate-100 shadow-2xl shadow-black/30">
      <CardContent className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-red-300" />
          <div>
            <h3 className="text-2xl font-black">Level reports</h3>
            <p className="text-sm text-slate-400">Resolve reports after fixing the problem, or dismiss reports that are not valid.</p>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-slate-400">No pending reports.</div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="rounded-xl bg-red-500/20 text-red-200">{String(report.reason_type || "other").replaceAll("_", " ").toUpperCase()}</Badge>
                      <Badge className="rounded-xl bg-white/10 text-white">{report.list_type === "pooplist" ? "Pooplist" : "Peelist"}</Badge>
                    </div>
                    <h4 className="mt-2 text-xl font-black">{report.level_name || "Unnamed level"}</h4>
                    <p className="text-sm text-slate-400">Reporter: {report.reporter_email || "Unknown"} · {formatDateTime(report.created_at)}</p>
                    {report.details && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">“{report.details}”</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => onResolve(report)} className="rounded-2xl bg-emerald-600 hover:bg-emerald-500"><Check className="mr-2 h-4 w-4" />Resolved</Button>
                    <Button onClick={() => onDismiss(report)} variant="secondary" className="rounded-2xl"><X className="mr-2 h-4 w-4" />Dismiss</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ChangelogPage({ entries, chatMessages, user, isAdmin, onAddEntry, onDeleteEntry, onSendChatMessage, onHideChatMessage }) {
  const [entryForm, setEntryForm] = useState({ kind: "update", title: "", body: "" });
  const [chatText, setChatText] = useState("");
  const [isPostingEntry, setIsPostingEntry] = useState(false);
  const [isPostingChat, setIsPostingChat] = useState(false);

  async function submitEntry(event) {
    event.preventDefault();
    if (!isAdmin || !entryForm.title.trim()) return;
    setIsPostingEntry(true);
    const ok = await onAddEntry(entryForm);
    setIsPostingEntry(false);
    if (ok) setEntryForm({ kind: "update", title: "", body: "" });
  }

  async function submitChat(event) {
    event.preventDefault();
    if (!user || !chatText.trim()) return;
    setIsPostingChat(true);
    const ok = await onSendChatMessage(chatText);
    setIsPostingChat(false);
    if (ok) setChatText("");
  }

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 md:p-8">
        <Badge className="mb-4 rounded-xl bg-cyan-500/20 text-cyan-200">Updates and chat</Badge>
        <h2 className="text-5xl font-black tracking-tight md:text-7xl">Changelog</h2>
        <p className="mt-3 max-w-2xl text-slate-300">Public updates for site changes, list changes, and a simple signed-in public chat.</p>
      </section>

      {isAdmin && (
        <Card className="rounded-[2rem] border-white/10 bg-slate-950/90 text-slate-100 shadow-2xl shadow-black/30">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black">Post changelog entry</h3>
            <form onSubmit={submitEntry} className="mt-4 grid gap-3">
              <select
                value={entryForm.kind}
                onChange={(event) => setEntryForm((current) => ({ ...current, kind: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-white outline-none"
              >
                <option value="update" className="bg-slate-900">Site update</option>
                <option value="level" className="bg-slate-900">List change</option>
                <option value="announcement" className="bg-slate-900">Announcement</option>
              </select>
              <Input
                value={entryForm.title}
                onChange={(event) => setEntryForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Title"
                className="rounded-2xl border-white/10 bg-white/10"
              />
              <Textarea
                value={entryForm.body}
                onChange={(event) => setEntryForm((current) => ({ ...current, body: event.target.value }))}
                placeholder="What changed?"
                className="min-h-24 rounded-2xl border-white/10 bg-white/10"
              />
              <Button type="submit" disabled={isPostingEntry || !entryForm.title.trim()} className="rounded-2xl">
                <Plus className="mr-2 h-4 w-4" />
                {isPostingEntry ? "Posting..." : "Post update"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
        <Card className="rounded-[2rem] border-white/10 bg-slate-950/80 text-slate-100 shadow-2xl shadow-black/30">
          <CardContent className="p-6">
            <h3 className="mb-4 text-2xl font-black">Recent changes</h3>
            {entries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-slate-400">No changelog entries yet.</div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <article key={entry.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Badge className="rounded-xl bg-cyan-500/20 text-cyan-200">{String(entry.kind || "update").toUpperCase()}</Badge>
                        <h4 className="mt-2 text-xl font-black">{entry.title}</h4>
                        <p className="mt-1 text-xs text-slate-500">{formatDateTime(entry.created_at)}</p>
                      </div>
                      {isAdmin && (
                        <Button onClick={() => onDeleteEntry(entry)} variant="destructive" className="rounded-2xl px-3">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {entry.body && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">{entry.body}</p>}
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/10 bg-slate-950/80 text-slate-100 shadow-2xl shadow-black/30">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black">Public chat</h3>
            <p className="mt-1 text-sm text-slate-400">Keep it clean. Admins can remove messages.</p>

            {user ? (
              <form onSubmit={submitChat} className="mt-4 space-y-3">
                <Textarea
                  value={chatText}
                  onChange={(event) => setChatText(event.target.value.slice(0, 280))}
                  placeholder="Say something..."
                  className="min-h-20 rounded-2xl border-white/10 bg-white/10"
                />
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">{chatText.length}/280</p>
                  <Button type="submit" disabled={isPostingChat || !chatText.trim()} className="rounded-2xl">
                    <Send className="mr-2 h-4 w-4" />
                    {isPostingChat ? "Posting..." : "Send"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="mt-4 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
                Sign in to chat.
              </div>
            )}

            <div className="mt-5 max-h-[560px] space-y-3 overflow-y-auto pr-1">
              {chatMessages.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-slate-400">No chat messages yet.</div>
              ) : (
                chatMessages.map((message) => (
                  <div key={message.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-white">{message.display_name || "PeePooList user"}</p>
                        <p className="text-xs text-slate-500">{formatDateTime(message.created_at)}</p>
                      </div>
                      {isAdmin && (
                        <Button onClick={() => onHideChatMessage(message)} variant="destructive" className="rounded-2xl px-3">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">{message.message}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </motion.div>
  );
}



function StatCard({ label, value, body, tone = "slate" }) {
  const tones = {
    slate: "border-white/10 bg-white/[0.04] text-slate-200",
    emerald: "border-emerald-300/20 bg-emerald-500/10 text-emerald-100",
    yellow: "border-yellow-300/20 bg-yellow-300/10 text-yellow-100",
    cyan: "border-cyan-300/20 bg-cyan-500/10 text-cyan-100",
    red: "border-red-300/20 bg-red-500/10 text-red-100",
    purple: "border-purple-300/20 bg-purple-500/10 text-purple-100",
  };

  return (
    <Card className={cn("rounded-[1.7rem] text-slate-100", tones[tone] || tones.slate)}>
      <CardContent className="p-5">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">{label}</p>
        <p className="mt-2 text-4xl font-black text-white">{value}</p>
        {body && <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>}
      </CardContent>
    </Card>
  );
}

function StatsPage({ levels, requests, reports, statusRequests, changelogEntries, chatMessages, publicProfiles, userBadges, isAdmin, setTab }) {
  const poopLevels = levels.pooplist || [];
  const peeLevels = levels.peelist || [];
  const allLevels = [
    ...poopLevels.map((level) => ({ ...level, list_name: "Pooplist" })),
    ...peeLevels.map((level) => ({ ...level, list_name: "Peelist" })),
  ];
  const newestLevel = [...allLevels].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))[0];
  const newestChange = [...(changelogEntries || [])].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))[0];
  const pendingReports = (reports || []).filter((report) => report.status === "pending");
  const pendingRequests = (requests || []).filter((request) => request.status === "pending");
  const pendingStatus = statusRequests || [];
  const totalBadges = (userBadges || []).length;
  const badgeLeaders = [...(publicProfiles || [])]
    .map((profile) => ({
      ...profile,
      badgeCount: (userBadges || []).filter((badge) => String(badge.user_id) === String(profile.user_id)).length,
    }))
    .sort((a, b) => b.badgeCount - a.badgeCount)
    .slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 md:p-8">
        <Badge className="mb-4 rounded-xl bg-purple-500/20 text-purple-200">Site stats</Badge>
        <h2 className="text-5xl font-black tracking-tight md:text-7xl">Stats</h2>
        <p className="mt-3 max-w-2xl text-slate-300">A live-ish dashboard for PeePooList levels, profiles, updates, chat, and moderation activity.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pooplist levels" value={poopLevels.length} tone="yellow" body="Possible levels currently ranked." />
        <StatCard label="Peelist levels" value={peeLevels.length} tone="cyan" body="Impossible levels currently ranked." />
        <StatCard label="Public profiles" value={(publicProfiles || []).length} tone="emerald" body="Users with site profiles loaded." />
        <StatCard label="Badges awarded" value={totalBadges} tone="purple" body="Admin badges plus achievement badges." />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Changelog posts" value={(changelogEntries || []).length} body="Site updates and list changes." />
        <StatCard label="Chat messages" value={(chatMessages || []).length} body="Visible public chat messages." />
        <StatCard label="Pending reports" value={isAdmin ? pendingReports.length : "Admin"} tone={pendingReports.length ? "red" : "slate"} body={isAdmin ? "Reports waiting for review." : "Only admins can see this count."} />
        <StatCard label="Pending requests" value={isAdmin ? pendingRequests.length + pendingStatus.length : "Admin"} tone={pendingRequests.length + pendingStatus.length ? "yellow" : "slate"} body={isAdmin ? "Level and status requests waiting." : "Only admins can see this count."} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[2rem] border-white/10 bg-slate-950/80 text-slate-100 shadow-2xl shadow-black/30">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black">Newest level</h3>
            {newestLevel ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <Badge className="rounded-xl bg-white/10 text-white">{newestLevel.list_name}</Badge>
                <h4 className="mt-2 text-2xl font-black text-white">#{newestLevel.rank} {newestLevel.name}</h4>
                <p className="mt-1 text-sm text-slate-400">Creator: {newestLevel.creator || "Unknown"} · Verifier: {newestLevel.verifier || "Unknown"}</p>
                <Button onClick={() => setTab(levelDetailTab(newestLevel.id))} className="mt-4 rounded-2xl">View level page</Button>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-white/15 p-6 text-center text-slate-500">No levels loaded yet.</div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/10 bg-slate-950/80 text-slate-100 shadow-2xl shadow-black/30">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black">Newest update</h3>
            {newestChange ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <Badge className="rounded-xl bg-cyan-500/20 text-cyan-200">{String(newestChange.kind || "update").toUpperCase()}</Badge>
                <h4 className="mt-2 text-2xl font-black text-white">{newestChange.title}</h4>
                <p className="mt-1 text-xs text-slate-500">{formatDateTime(newestChange.created_at)}</p>
                {newestChange.body && <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">{newestChange.body}</p>}
                <Button onClick={() => setTab("changelog")} variant="secondary" className="mt-4 rounded-2xl">Open changelog</Button>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-white/15 p-6 text-center text-slate-500">No changelog entries yet.</div>
            )}
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-[2rem] border-white/10 bg-slate-950/80 text-slate-100 shadow-2xl shadow-black/30">
        <CardContent className="p-6">
          <h3 className="text-2xl font-black">Badge leaders</h3>
          <p className="mt-1 text-sm text-slate-400">Users with the most awarded badges.</p>
          <div className="mt-4 space-y-3">
            {badgeLeaders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 p-6 text-center text-slate-500">No public profiles yet.</div>
            ) : (
              badgeLeaders.map((profile) => (
                <button key={profile.user_id} onClick={() => setTab(userProfileTab(profile.handle || profile.user_id))} className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:bg-white/[0.07]">
                  <div>
                    <p className="font-black text-white">{profile.display_name || profile.handle || "Unnamed user"}</p>
                    <p className="text-sm text-slate-500">{profile.handle ? `@${profile.handle}` : profile.user_id}</p>
                  </div>
                  <Badge className="rounded-xl bg-purple-500/20 text-purple-200">{profile.badgeCount} badge{profile.badgeCount === 1 ? "" : "s"}</Badge>
                </button>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AdminDashboardPage({ isAdmin, levels, requests, statusRequests, reports, chatMessages, changelogEntries, publicProfiles, userBadges, setTab, onApproveRequest, onDenyRequest, onApproveStatusRequest, onDenyStatusRequest, onResolveReport, onDismissReport, onHideChatMessage, onDeleteChangelogEntry }) {
  if (!isAdmin) {
    return (
      <InfoPageShell title="Admin only" eyebrow="Locked">
        <p>You need admin access to view the PeePooList admin dashboard.</p>
        <Button onClick={() => setTab("home")} className="rounded-2xl">Back home</Button>
      </InfoPageShell>
    );
  }

  const pendingLevelRequests = (requests || []).filter((request) => request.status === "pending");
  const pendingReports = (reports || []).filter((report) => report.status === "pending");
  const recentChat = (chatMessages || []).slice(0, 8);
  const recentUpdates = (changelogEntries || []).slice(0, 6);
  const totalLevels = (levels.pooplist || []).length + (levels.peelist || []).length;
  const profilesWithBadges = (publicProfiles || []).filter((profile) => (userBadges || []).some((badge) => String(badge.user_id) === String(profile.user_id)));

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 md:p-8">
        <Badge className="mb-4 rounded-xl bg-yellow-300 text-black">Admin dashboard</Badge>
        <h2 className="text-5xl font-black tracking-tight md:text-7xl">Admin</h2>
        <p className="mt-3 max-w-2xl text-slate-300">One place for moderation, request queues, reports, chat cleanup, and quick site checks.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total levels" value={totalLevels} tone="cyan" />
        <StatCard label="Level requests" value={pendingLevelRequests.length} tone={pendingLevelRequests.length ? "yellow" : "slate"} />
        <StatCard label="Status requests" value={(statusRequests || []).length} tone={(statusRequests || []).length ? "yellow" : "slate"} />
        <StatCard label="Reports" value={pendingReports.length} tone={pendingReports.length ? "red" : "slate"} />
      </section>

      <section className="grid gap-3 md:grid-cols-5">
        <Button onClick={() => setTab("pooplist")} className="rounded-2xl">Pooplist tools</Button>
        <Button onClick={() => setTab("peelist")} className="rounded-2xl">Peelist tools</Button>
        <Button onClick={() => setTab("changelog")} variant="secondary" className="rounded-2xl">Post update</Button>
        <Button onClick={() => setTab("stats")} variant="secondary" className="rounded-2xl">View stats</Button>
        <Button onClick={() => setTab("home")} variant="secondary" className="rounded-2xl">Home</Button>
      </section>

      <RequestsPanel requests={pendingLevelRequests} onApprove={onApproveRequest} onDeny={onDenyRequest} />
      <StatusRequestsPanel statusRequests={statusRequests || []} onApprove={onApproveStatusRequest} onDeny={onDenyStatusRequest} />
      <ReportsPanel reports={pendingReports} onResolve={onResolveReport} onDismiss={onDismissReport} />

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[2rem] border-white/10 bg-slate-950/80 text-slate-100 shadow-2xl shadow-black/30">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black">Recent public chat</h3>
            <p className="mt-1 text-sm text-slate-400">Quick moderation for the public chat.</p>
            <div className="mt-4 space-y-3">
              {recentChat.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 p-6 text-center text-slate-500">No chat messages yet.</div>
              ) : (
                recentChat.map((message) => (
                  <div key={message.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-500">{message.display_name || "User"} · {formatDateTime(message.created_at)}</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-slate-200">{message.message}</p>
                      </div>
                      <Button onClick={() => onHideChatMessage(message)} variant="destructive" className="rounded-2xl px-3">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/10 bg-slate-950/80 text-slate-100 shadow-2xl shadow-black/30">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black">Recent changelog</h3>
            <p className="mt-1 text-sm text-slate-400">Delete mistaken update posts here.</p>
            <div className="mt-4 space-y-3">
              {recentUpdates.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 p-6 text-center text-slate-500">No updates yet.</div>
              ) : (
                recentUpdates.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Badge className="rounded-xl bg-cyan-500/20 text-cyan-200">{String(entry.kind || "update").toUpperCase()}</Badge>
                        <h4 className="mt-2 font-black text-white">{entry.title}</h4>
                        <p className="mt-1 text-xs text-slate-500">{formatDateTime(entry.created_at)}</p>
                      </div>
                      <Button onClick={() => onDeleteChangelogEntry(entry)} variant="destructive" className="rounded-2xl px-3">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-[2rem] border-white/10 bg-slate-950/80 text-slate-100 shadow-2xl shadow-black/30">
        <CardContent className="p-6">
          <h3 className="text-2xl font-black">User/profile overview</h3>
          <p className="mt-1 text-sm text-slate-400">Profiles loaded: {(publicProfiles || []).length}. Profiles with badges: {profilesWithBadges.length}.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {(publicProfiles || []).slice(0, 8).map((profile) => (
              <button key={profile.user_id} onClick={() => setTab(userProfileTab(profile.handle || profile.user_id))} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:bg-white/[0.07]">
                <p className="font-black text-white">{profile.display_name || profile.handle || "Unnamed user"}</p>
                <p className="text-sm text-slate-500">{profile.handle ? `@${profile.handle}` : profile.user_id}</p>
                <p className="mt-2 text-xs text-slate-400">{(userBadges || []).filter((badge) => String(badge.user_id) === String(profile.user_id)).length} badge{(userBadges || []).filter((badge) => String(badge.user_id) === String(profile.user_id)).length === 1 ? "" : "s"}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LevelDetailPage({ level, index, listType, changelogEntries, comments, user, isAdmin, onBack, onSubmitReport, onSendComment, onHideComment }) {
  const [copied, setCopied] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [commentMessage, setCommentMessage] = useState("");
  const listName = listType === "pooplist" ? "The Pooplist" : "The Peelist";
  const statusText = listType === "pooplist" ? "Possible level" : "Impossible level";
  const rank = Number(level?.rank || index + 1 || 1);
  const relatedChanges = (changelogEntries || [])
    .filter((entry) => `${entry.title || ""} ${entry.body || ""}`.toLowerCase().includes(String(level?.name || "").toLowerCase()))
    .slice(0, 5);
  const levelComments = (comments || [])
    .filter((comment) => String(comment.level_id) === String(level?.id))
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  async function copyShareLink() {
    const url = levelShareUrl(level.id);
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      window.prompt("Copy this level link:", url);
    }
  }

  async function submitComment(event) {
    event.preventDefault();
    if (!user || !commentText.trim()) return;

    setIsPostingComment(true);
    const ok = await onSendComment?.(level, listType, commentText);
    setIsPostingComment(false);

    if (ok) {
      setCommentText("");
      setCommentMessage("Comment posted.");
      window.setTimeout(() => setCommentMessage(""), 1400);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/25">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="relative min-h-[260px] overflow-hidden lg:min-h-[520px]">
            <img src={imageFor(level, index, listType)} alt={`${level.name} thumbnail`} className="h-full min-h-[260px] w-full object-cover lg:min-h-[520px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090d18] via-[#090d18]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <Badge className={listType === "pooplist" ? "mb-4 rounded-xl bg-amber-500/20 text-amber-200" : "mb-4 rounded-xl bg-yellow-300/20 text-yellow-100"}>
                {listName} · #{rank}
              </Badge>
              <h2 className="break-words text-4xl font-black leading-tight text-white md:text-7xl">{level.name}</h2>
              <p className="mt-3 max-w-2xl text-slate-300">{statusText} detail page for sharing, checking info, and reporting problems.</p>
            </div>
          </div>

          <aside className="space-y-4 border-t border-white/10 bg-slate-950/85 p-6 lg:border-l lg:border-t-0">
            <Button onClick={onBack} variant="secondary" className="w-full rounded-2xl">
              Back to {listName}
            </Button>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Rank</p>
              <p className="mt-1 text-5xl font-black text-white">#{rank}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Creator</p>
                <p className="mt-1 break-words text-lg font-black text-cyan-100">{level.creator || "Unknown"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Verifier</p>
                <p className="mt-1 break-words text-lg font-black text-emerald-100">{level.verifier || "Unknown"}</p>
              </div>
            </div>

            {level.level_url ? (
              <button
                type="button"
                onClick={() => openLevelUrl(level.level_url)}
                className="inline-flex w-full items-center justify-center rounded-2xl border-2 border-black px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-950/40 transition hover:brightness-110"
                style={{
                  backgroundColor: "#c0ffbf",
                  textShadow: "1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000",
                }}
              >
                Open level link
              </button>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/15 p-4 text-center text-sm text-slate-500">No level link added yet.</div>
            )}

            <Button onClick={copyShareLink} variant="secondary" className="w-full rounded-2xl">
              {copied ? "Copied share link" : "Copy share link"}
            </Button>

            <Button onClick={() => setIsReporting(true)} variant="destructive" className="w-full rounded-2xl">
              <AlertTriangle className="mr-2 h-4 w-4" /> Report this level
            </Button>
          </aside>
        </div>
      </section>

      <AnimatePresence>
        {isReporting && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <ReportLevelPanel
              level={level}
              user={user}
              onSubmit={(reportLevel, reasonType, details) => onSubmitReport?.(reportLevel, reasonType, details)}
              onCancel={() => setIsReporting(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-[1.7rem] border-white/10 bg-slate-950/70 text-slate-100">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black">List status</h3>
            <p className="mt-2 text-slate-400">{level.name} is currently listed as a {statusText.toLowerCase()} on {listName}.</p>
          </CardContent>
        </Card>
        <Card className="rounded-[1.7rem] border-white/10 bg-slate-950/70 text-slate-100">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black">Shareable page</h3>
            <p className="mt-2 text-slate-400">Use the copy button to share this exact level page instead of the whole list.</p>
          </CardContent>
        </Card>
        <Card className="rounded-[1.7rem] border-white/10 bg-slate-950/70 text-slate-100">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black">Corrections</h3>
            <p className="mt-2 text-slate-400">Use Submit edit on the list page for fixes, or Report this level for unsafe or broken content.</p>
          </CardContent>
        </Card>
      </section>


      <Card className="rounded-[2rem] border-white/10 bg-slate-950/80 text-slate-100 shadow-2xl shadow-black/30">
        <CardContent className="p-6">
          <h3 className="text-2xl font-black">Comments</h3>
          <p className="mt-1 text-sm text-slate-400">Signed-in users can comment on this level. Admins can remove bad comments.</p>

          {user ? (
            <form onSubmit={submitComment} className="mt-4 space-y-3">
              <Textarea
                value={commentText}
                maxLength={280}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder={`Comment on ${level.name}...`}
                className="min-h-24 rounded-2xl border-white/10 bg-white/10"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-500">{commentText.length}/280</p>
                <Button type="submit" disabled={isPostingComment || !commentText.trim()} className="rounded-2xl">
                  {isPostingComment ? "Posting..." : "Post comment"}
                </Button>
              </div>
              {commentMessage && <p className="text-sm font-bold text-emerald-200">{commentMessage}</p>}
            </form>
          ) : (
            <div className="mt-4 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
              Sign in on the Home page to comment.
            </div>
          )}

          <div className="mt-5 space-y-3">
            {levelComments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 p-6 text-center text-slate-500">No comments yet.</div>
            ) : (
              levelComments.map((comment) => (
                <div key={comment.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-white">{comment.display_name || "PeePooList user"}</p>
                      <p className="text-xs text-slate-500">{formatDateTime(comment.created_at)}</p>
                    </div>
                    {isAdmin && (
                      <button onClick={() => onHideComment?.(comment)} className="rounded-xl bg-red-500/20 px-3 py-1 text-xs font-bold text-red-200 hover:bg-red-500/30">
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-200">{comment.message}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-white/10 bg-slate-950/80 text-slate-100 shadow-2xl shadow-black/30">
        <CardContent className="p-6">
          <h3 className="text-2xl font-black">Related changelog entries</h3>
          <p className="mt-1 text-sm text-slate-400">Entries that mention this level name.</p>
          <div className="mt-4 space-y-3">
            {relatedChanges.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 p-6 text-center text-slate-500">No related changelog entries yet.</div>
            ) : (
              relatedChanges.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-black text-white">{entry.title}</h4>
                    <span className="text-xs text-slate-500">{formatDateTime(entry.created_at)}</span>
                  </div>
                  {entry.body && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">{entry.body}</p>}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LevelCard({ level, index, listType, removeMode, onRemove, onReport, onOpenDetails, reorderMode, draggable, isDragging, onDragStart, onDragOver, onDrop, onDragEnd }) {
  const colors = listType === "pooplist" ? "from-amber-950/80 to-slate-900" : "from-yellow-950/70 to-slate-900";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={
        isDragging
          ? { opacity: 0.96, y: 0, scale: 1.1, rotate: dragSwing }
          : { opacity: 1, y: 0, scale: 1, rotate: 0 }
      }
      transition={
        isDragging
          ? {
              scale: { duration: 0.12 },
              rotate: { duration: 1.875, repeat: Infinity, ease: "linear" },
              layout: { duration: 0.16 },
            }
          : { layout: { duration: 0.16 } }
      }
      style={{ transformOrigin: "50% 50%" }}
      exit={{ opacity: 0, scale: 0.96 }}
      draggable={draggable}
      onDragStart={(event) => {
        if (!draggable) return;
        event.dataTransfer.effectAllowed = "move";
        onDragStart?.(event);
      }}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onClick={() => {
        if (removeMode || reorderMode || isDragging) return;
        onOpenDetails?.(level);
      }}
      className={`group relative mx-auto flex min-h-[300px] w-full max-w-[800px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${colors} shadow-2xl shadow-black/25 md:min-h-[300px] md:flex-row ${draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"} ${isDragging ? "z-30 ring-2 ring-yellow-300/70" : ""}`}
    >
      {reorderMode && (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-2xl bg-black/55 px-3 py-2 text-xs font-bold text-yellow-100 backdrop-blur">
          <GripVertical className="h-4 w-4" /> Drag to reorder
        </div>
      )}

      {removeMode && (
        <button
          onClick={() => onRemove(level.id)}
          className="absolute inset-0 z-20 grid place-items-center bg-red-950/70 text-center opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
        >
          <span className="rounded-2xl bg-red-500 px-5 py-3 text-lg font-black text-white shadow-xl">
            Remove #{index + 1} {level.name}
          </span>
        </button>
      )}

      <div className="flex w-full flex-col justify-center gap-3 p-5 md:w-[230px] md:p-7">
        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.28em] text-slate-400">
          <Crown className="h-4 w-4 text-yellow-300" /> Top
        </div>
        <div className="text-7xl font-black leading-none text-white drop-shadow-lg">#{index + 1}</div>
      </div>

      <div className="relative h-48 overflow-hidden border-y border-white/10 md:min-h-[300px] md:w-[260px] md:self-stretch md:border-x md:border-y-0">
        <img src={imageFor(level, index, listType)} alt={`${level.name} thumbnail`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="flex flex-1 flex-col justify-center p-6">
        <h3
          className="font-black leading-tight break-words [overflow-wrap:anywhere]"
          style={{
            fontSize: `clamp(1.25rem, ${Math.max(1.25, Math.min(2.35, 2.55 - String(level.name || "").length * 0.025))}rem, 2.35rem)`,
          }}
        >
          {level.name}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Badge className="rounded-xl bg-cyan-500/20 text-cyan-200">Creator: {level.creator || "Unknown"}</Badge>
          <Badge className="rounded-xl bg-emerald-500/20 text-emerald-200">Verifier: {level.verifier || "Unknown"}</Badge>
          <Badge className="rounded-xl bg-blue-500/20 text-blue-200">Click to view details</Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onOpenDetails?.(level);
            }}
            className="inline-flex items-center rounded-xl border border-blue-300/20 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-200 transition hover:bg-blue-500/20"
          >
            Details
          </button>
          {level.level_url && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                openLevelUrl(level.level_url);
              }}
              className="inline-flex items-center rounded-xl border border-emerald-300/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-200 transition hover:bg-emerald-500/20"
            >
              Open link
            </button>
          )}
          <button
            onClick={(event) => {
              event.stopPropagation();
              onReport?.(level);
            }}
            className="inline-flex items-center rounded-xl border border-red-300/20 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-200 transition hover:bg-red-500/20"
          >
            <AlertTriangle className="mr-1 h-3 w-3" /> Report
          </button>
        </div>
        <p className="mt-4 text-sm text-slate-400">
          {listType === "pooplist" ? "Marked as possible and currently placed on the ranked list." : "Marked as impossible and currently placed on the ranked list."}
        </p>
      </div>
    </motion.div>
  );
}

function LevelEditCard({ level, index, listType, draggable, isDragging, onDragStart, onDragOver, onDrop, onDragEnd, onChange, onImageFile }) {
  const colors = listType === "pooplist" ? "from-amber-950/80 to-slate-900" : "from-yellow-950/70 to-slate-900";
  const fileInputId = `thumbnail-${level.id}`;

  return (
    <div className="mx-auto grid w-full max-w-[1120px] gap-3 lg:grid-cols-[minmax(0,800px)_minmax(220px,1fr)]">
      <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={isDragging ? { opacity: 0.96, y: 0, scale: 1.1, rotate: dragSwing } : { opacity: 1, y: 0, scale: 1, rotate: 0 }}
        transition={
          isDragging
            ? { scale: { duration: 0.12 }, rotate: { duration: 1.875, repeat: Infinity, ease: "linear" }, layout: { duration: 0.16 } }
            : { layout: { duration: 0.16 } }
        }
        style={{ transformOrigin: "50% 50%" }}
        draggable={draggable}
        onDragStart={(event) => {
          event.dataTransfer.effectAllowed = "move";
          onDragStart?.(event);
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
        className={`group relative flex min-h-[300px] w-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${colors} shadow-2xl shadow-black/25 md:min-h-[300px] md:flex-row ${draggable ? "cursor-grab active:cursor-grabbing" : ""} ${isDragging ? "z-30 ring-2 ring-yellow-300/70" : ""}`}
      >
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-2xl bg-black/55 px-3 py-2 text-xs font-bold text-yellow-100 backdrop-blur">
          <GripVertical className="h-4 w-4" /> Drag to reorder
        </div>

        <div className="flex w-full flex-col justify-center gap-3 p-5 md:w-[190px] md:p-7">
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.28em] text-slate-400">
            <Crown className="h-4 w-4 text-yellow-300" /> Top
          </div>
          <div className="text-6xl font-black leading-none text-white drop-shadow-lg">#{index + 1}</div>
        </div>

        <label htmlFor={fileInputId} className="relative h-48 cursor-pointer overflow-hidden border-y border-white/10 md:min-h-[300px] md:w-[240px] md:self-stretch md:border-x md:border-y-0">
          <img src={imageFor(level, index, listType)} alt={`${level.name} thumbnail`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 grid place-items-center bg-black/45 opacity-0 transition group-hover:opacity-100">
            <span className="inline-flex items-center rounded-2xl bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur">
              <ImagePlus className="mr-2 h-4 w-4" /> Change image
            </span>
          </div>
          <input
            id={fileInputId}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => onImageFile(level.id, event.target.files?.[0] || null)}
          />
        </label>

        <div className="flex flex-1 flex-col justify-center gap-3 p-6">
          <Input value={level.name || ""} onChange={(event) => onChange(level.id, { name: event.target.value })} className="h-auto rounded-2xl border-white/10 bg-white/10 py-3 text-2xl font-black" placeholder="Level name" />
          <Input value={level.creator || ""} onChange={(event) => onChange(level.id, { creator: event.target.value })} className="rounded-2xl border-white/10 bg-white/10" placeholder="Creator" />
          <Input value={level.verifier || ""} onChange={(event) => onChange(level.id, { verifier: event.target.value })} className="rounded-2xl border-white/10 bg-white/10" placeholder="Verifier" />
        </div>
      </motion.div>

      <Card className="rounded-[2rem] border-white/10 bg-slate-950/95 text-slate-100">
        <CardContent className="flex h-full flex-col justify-center gap-3 p-4">
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Level link</label>
          <Input value={level.level_url || ""} onChange={(event) => onChange(level.id, { level_url: event.target.value })} placeholder="https://example.com" className="rounded-2xl border-white/10 bg-white/10" />
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Thumbnail URL</label>
          <Input value={level.thumbnail_url || ""} onChange={(event) => onChange(level.id, { thumbnail_url: event.target.value })} placeholder="Optional image URL" className="rounded-2xl border-white/10 bg-white/10" />
          <p className="text-xs text-slate-500">Click the image on the card to pick a file from your computer.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function AddRemoveRequestForm({ listType, onSubmit, onCancel, mode = "admin", user, uploadThumbnail }) {
  const [form, setForm] = useState({
    action: mode === "admin" ? "add" : "add",
    name: "",
    position: "1",
    creator: "",
    verifier: "",
    thumbnail_url: "",
    level_url: "",
    reason: "",
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event) {
    event.preventDefault();
    if (!form.name.trim()) return;
    if (mode === "request" && !user) return;

    let thumbnailUrl = form.thumbnail_url;

    if (thumbnailFile && uploadThumbnail) {
      setIsUploadingThumbnail(true);
      thumbnailUrl = await uploadThumbnail(thumbnailFile);
      setIsUploadingThumbnail(false);
      if (!thumbnailUrl) return;
    }

    onSubmit({ ...form, thumbnail_url: thumbnailUrl, listType });
    setForm({ action: "add", name: "", position: "1", creator: "", verifier: "", thumbnail_url: "", level_url: "", reason: "" });
    setThumbnailFile(null);
    setThumbnailPreview("");
  }

  return (
    <Card className="rounded-[2rem] border-white/10 bg-slate-950/95 text-slate-100 shadow-2xl shadow-black/30">
      <CardContent className="p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black">{mode === "admin" ? "Add a level" : "Submit a list request"}</h3>
            <p className="text-sm text-slate-400">
              {mode === "admin" ? "Admin changes update the database immediately." : "Requests wait for admin approval before changing the public list."}
            </p>
          </div>
          {onCancel && <Button variant="secondary" onClick={onCancel} className="rounded-2xl">Close</Button>}
        </div>

        {mode === "request" && !user && (
          <div className="mb-4 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
            Sign in on the Home page before submitting requests.
          </div>
        )}

        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          {mode === "request" && (
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-300">Request type</label>
              <select
                value={form.action}
                onChange={(event) => update("action", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-white outline-none"
              >
                <option value="add" className="bg-slate-900">Add level</option>
                <option value="remove" className="bg-slate-900">Remove level</option>
              </select>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Level name</label>
            <Input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Level name" className="rounded-2xl border-white/10 bg-white/10" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Top position</label>
            <Input type="number" min="1" value={form.position} onChange={(event) => update("position", event.target.value)} className="rounded-2xl border-white/10 bg-white/10" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Creator</label>
            <Input value={form.creator} onChange={(event) => update("creator", event.target.value)} placeholder="Creator" className="rounded-2xl border-white/10 bg-white/10" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Verifier</label>
            <Input value={form.verifier} onChange={(event) => update("verifier", event.target.value)} placeholder="Verifier" className="rounded-2xl border-white/10 bg-white/10" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-300">Level link, optional</label>
            <Input value={form.level_url} onChange={(event) => update("level_url", event.target.value)} placeholder="https://example.com/level-page" className="rounded-2xl border-white/10 bg-white/10" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-300">Thumbnail, optional</label>
            <div className="grid gap-3 md:grid-cols-2">
              <Input value={form.thumbnail_url} onChange={(event) => update("thumbnail_url", event.target.value)} placeholder="Paste image URL, or upload a file" className="rounded-2xl border-white/10 bg-white/10" />
              <Input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setThumbnailFile(file || null);
                  setThumbnailPreview(file ? URL.createObjectURL(file) : "");
                }}
                className="rounded-2xl border-white/10 bg-white/10"
              />
            </div>
            {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail preview" className="mt-3 h-32 w-56 rounded-2xl border border-white/10 object-cover" />}
          </div>

          {mode === "request" && (
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-300">Reason</label>
              <Textarea value={form.reason} onChange={(event) => update("reason", event.target.value)} placeholder="Optional reason" className="min-h-24 rounded-2xl border-white/10 bg-white/10" />
            </div>
          )}

          <div className="md:col-span-2">
            <Button type="submit" className="w-full rounded-2xl" disabled={(mode === "request" && !user) || isUploadingThumbnail}>
              {mode === "admin" ? <Plus className="mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
              {isUploadingThumbnail ? "Uploading thumbnail..." : mode === "admin" ? "Add level now" : "Submit request"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function EditLevelsPanel({ listType, levels, isAdmin, user, uploadThumbnail, onAdminSave, onViewerSubmit, onCancel }) {
  const [editLevels, setEditLevels] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [manualPosition, setManualPosition] = useState("1");
  const [draggingId, setDraggingId] = useState(null);
  const [imageFiles, setImageFiles] = useState({});
  const [reason, setReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fresh = levels.map((level, index) => cleanLevelForSave(level, index));
    setEditLevels(fresh);
    setSelectedId(fresh[0]?.id || "");
    setManualPosition("1");
    setDraggingId(null);
    setImageFiles({});
    setReason("");
  }, [levels, listType]);

  const selectedLevel = editLevels.find((level) => level.id === selectedId);

  function updateLevel(id, changes) {
    setEditLevels((current) => current.map((level) => (level.id === id ? { ...level, ...changes } : level)));
  }

  function setImageFile(id, file) {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setImageFiles((current) => ({ ...current, [id]: file }));
    updateLevel(id, { thumbnail_url: preview });
  }

  function moveSelected() {
    if (!selectedId) return;
    const targetIndex = clampRank(manualPosition, editLevels.length) - 1;
    setEditLevels((current) => moveLevelInList(current, selectedId, targetIndex));
  }

  function beginDrag(id) {
    setDraggingId(id);
    setSelectedId(id);
  }

  function hoverDrag(id) {
    if (!draggingId || draggingId === id) return;
    setEditLevels((current) => {
      const targetIndex = current.findIndex((level) => level.id === id);
      return moveLevelInList(current, draggingId, targetIndex);
    });
  }

  async function submitChanges() {
    if (!isAdmin && !user) return;
    setIsSaving(true);
    if (isAdmin) {
      await onAdminSave(listType, editLevels, imageFiles);
    } else {
      await onViewerSubmit(listType, editLevels, imageFiles, reason);
    }
    setIsSaving(false);
  }

  return (
    <Card className="rounded-[2rem] border-white/10 bg-slate-950/95 text-slate-100 shadow-2xl shadow-black/30">
      <CardContent className="space-y-6 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-2xl font-black">{isAdmin ? "Edit levels" : "Submit level edits"}</h3>
            <p className="mt-1 text-sm text-slate-400">
              Select one level and edit its fields, or edit directly inside every visible level card. Drag cards to change positions.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={submitChanges} disabled={isSaving || (!isAdmin && !user)} className="rounded-2xl">
              {isAdmin ? <Save className="mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
              {isSaving ? "Saving..." : isAdmin ? "Save Changes?" : "Submit Edit?"}
            </Button>
            <Button variant="secondary" onClick={onCancel} className="rounded-2xl">Close</Button>
          </div>
        </div>

        {!isAdmin && !user && (
          <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
            Sign in on the Home page before submitting edit requests.
          </div>
        )}

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-4 flex items-center gap-3">
            <Pencil className="h-5 w-5 text-yellow-200" />
            <div>
              <h4 className="text-xl font-black">Single-level editor</h4>
              <p className="text-sm text-slate-400">Pick a level, change its details, and optionally type a new rank.</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_120px_auto]">
            <select
              value={selectedId}
              onChange={(event) => {
                const id = event.target.value;
                setSelectedId(id);
                const index = editLevels.findIndex((level) => level.id === id);
                setManualPosition(String(index + 1 || 1));
              }}
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-white outline-none"
            >
              {editLevels.map((level, index) => (
                <option key={level.id} value={level.id} className="bg-slate-900">#{index + 1} — {level.name}</option>
              ))}
            </select>
            <Input type="number" min="1" max={Math.max(editLevels.length, 1)} value={manualPosition} onChange={(event) => setManualPosition(event.target.value)} className="rounded-2xl border-white/10 bg-white/10" />
            <Button onClick={moveSelected} variant="secondary" className="rounded-2xl" disabled={!selectedId}>Move</Button>
          </div>

          {selectedLevel && (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Input value={selectedLevel.name || ""} onChange={(event) => updateLevel(selectedId, { name: event.target.value })} placeholder="Name" className="rounded-2xl border-white/10 bg-white/10" />
              <Input value={selectedLevel.creator || ""} onChange={(event) => updateLevel(selectedId, { creator: event.target.value })} placeholder="Creator" className="rounded-2xl border-white/10 bg-white/10" />
              <Input value={selectedLevel.verifier || ""} onChange={(event) => updateLevel(selectedId, { verifier: event.target.value })} placeholder="Verifier" className="rounded-2xl border-white/10 bg-white/10" />
              <Input value={selectedLevel.level_url || ""} onChange={(event) => updateLevel(selectedId, { level_url: event.target.value })} placeholder="Level link" className="rounded-2xl border-white/10 bg-white/10" />
              <Input value={selectedLevel.thumbnail_url || ""} onChange={(event) => updateLevel(selectedId, { thumbnail_url: event.target.value })} placeholder="Thumbnail URL" className="rounded-2xl border-white/10 bg-white/10" />
              <Input type="file" accept="image/*" onChange={(event) => setImageFile(selectedId, event.target.files?.[0] || null)} className="rounded-2xl border-white/10 bg-white/10" />
            </div>
          )}

          {!isAdmin && (
            <div className="mt-4">
              <label className="mb-2 block text-sm font-semibold text-slate-300">Reason</label>
              <Textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Optional reason for the edit request" className="min-h-20 rounded-2xl border-white/10 bg-white/10" />
            </div>
          )}
        </div>

        <div className="space-y-5">
          <AnimatePresence>
            {editLevels.map((level, index) => (
              <LevelEditCard
                key={level.id}
                level={level}
                index={index}
                listType={listType}
                draggable={true}
                isDragging={draggingId === level.id}
                onChange={updateLevel}
                onImageFile={setImageFile}
                onDragStart={() => beginDrag(level.id)}
                onDragOver={(event) => {
                  event.preventDefault();
                  hoverDrag(level.id);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setDraggingId(null);
                }}
                onDragEnd={() => setDraggingId(null)}
              />
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

function RequestsPanel({ requests, onApprove, onDeny }) {
  return (
    <Card className="rounded-[2rem] border-white/10 bg-slate-950/95 text-slate-100 shadow-2xl shadow-black/30">
      <CardContent className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <Inbox className="h-6 w-6 text-yellow-200" />
          <div>
            <h3 className="text-2xl font-black">Level requests</h3>
            <p className="text-sm text-slate-400">Approve to apply the request. Deny to close it.</p>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-slate-400">No pending requests.</div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <div key={request.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={request.action === "add" ? "rounded-xl bg-emerald-500/20 text-emerald-200" : request.action === "edit" ? "rounded-xl bg-blue-500/20 text-blue-200" : "rounded-xl bg-red-500/20 text-red-200"}>
                        {String(request.action).toUpperCase()}
                      </Badge>
                      <Badge className="rounded-xl bg-white/10 text-white">{request.list_type === "pooplist" ? "Pooplist" : "Peelist"}</Badge>
                      {request.request_priority && <Badge className="rounded-xl bg-yellow-300/20 text-yellow-100">PRIORITY</Badge>}
                      {request.requester_email && <Badge className="rounded-xl bg-emerald-500/20 text-emerald-200">{request.requester_email}</Badge>}
                    </div>
                    <h4 className="mt-2 text-xl font-black">{request.name || "Unnamed level"}</h4>
                    <p className="text-sm text-slate-400">Top #{request.rank} · Creator: {request.creator || "Unknown"} · Verifier: {request.verifier || "Unknown"}</p>
                    {request.level_url && <p className="mt-1 break-all text-xs text-blue-200">Link: {request.level_url}</p>}
                    {request.reason && <p className="mt-2 text-sm text-slate-300">“{request.reason}”</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => onApprove(request)} className="rounded-2xl bg-emerald-600 hover:bg-emerald-500"><Check className="mr-2 h-4 w-4" />Approve</Button>
                    <Button onClick={() => onDeny(request)} variant="destructive" className="rounded-2xl"><X className="mr-2 h-4 w-4" />Deny</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ListPage({ listType, levels, isAdmin, user, requests, reports, addLevel, removeLevel, saveEditedLevels, submitRequest, submitEditRequests, submitReport, resolveReport, dismissReport, approveRequest, denyRequest, statusMessage, isConfigured, uploadThumbnail, onOpenLevel }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [reportingLevel, setReportingLevel] = useState(null);

  const title = listType === "pooplist" ? "The Pooplist" : "The Peelist";
  const subtitle = listType === "pooplist" ? "Possible levels ranked by placement, verification, and list status." : "Impossible levels ranked by placement, difficulty, and list status.";
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredLevels = normalizedSearch
    ? levels.filter((level) =>
        [level.name, level.creator, level.verifier, level.level_url]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedSearch))
      )
    : levels;

  const submitAdminAdd = async (form) => {
    await addLevel(listType, form);
    setShowAdd(false);
  };

  const submitUserRequest = async (form) => {
    await submitRequest(listType, form);
    setShowRequest(false);
  };

  const submitRemove = async (id) => {
    await removeLevel(listType, id);
    setRemoveMode(false);
  };

  const listRequests = requests.filter((request) => request.list_type === listType || request.listType === listType);
  const listReports = (reports || []).filter((report) => (report.list_type === listType || report.listType === listType) && report.status === "pending");

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className={listType === "pooplist" ? "mb-4 rounded-xl bg-amber-500/20 text-amber-200" : "mb-4 rounded-xl bg-yellow-300/20 text-yellow-100"}>
              {searchTerm ? `${filteredLevels.length}/${levels.length}` : levels.length} ranked levels
            </Badge>
            <h2 className="text-5xl font-black tracking-tight md:text-7xl">{title}</h2>
            <p className="mt-3 max-w-2xl text-slate-300">{subtitle}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setShowRequest((value) => !value)} variant="secondary" className="rounded-2xl">
              <Send className="mr-2 h-4 w-4" />Submit request
            </Button>
            <Button onClick={() => setShowEdit((value) => !value)} variant={showEdit ? "default" : "secondary"} className="rounded-2xl">
              <Pencil className="mr-2 h-4 w-4" />{isAdmin ? "Edit levels" : "Submit edit"}
            </Button>
            {isAdmin && (
              <>
                <Button onClick={() => setShowAdd((value) => !value)} className="rounded-2xl"><Plus className="mr-2 h-4 w-4" />Add level</Button>
                <Button onClick={() => setRemoveMode((value) => !value)} variant={removeMode ? "destructive" : "secondary"} className="rounded-2xl"><Trash2 className="mr-2 h-4 w-4" />{removeMode ? "Cancel remove" : "Remove level"}</Button>
                <Button onClick={() => setShowRequests((value) => !value)} variant="secondary" className="rounded-2xl"><Inbox className="mr-2 h-4 w-4" />View requests ({listRequests.length})</Button>
                <Button onClick={() => setShowReports((value) => !value)} variant="secondary" className="rounded-2xl"><AlertTriangle className="mr-2 h-4 w-4" />View reports ({listReports.length})</Button>
              </>
            )}
          </div>
        </div>
      </section>

      {!isConfigured && (
        <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
          <AlertTriangle className="mr-2 inline h-4 w-4" /> Live database security is not active until Supabase environment variables and database policies are set up.
        </div>
      )}

      {statusMessage && <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">{statusMessage}</div>}

      <Card className="rounded-[1.5rem] border-white/10 bg-slate-950/80 text-slate-100">
        <CardContent className="grid gap-3 p-4 md:grid-cols-[1fr_auto] md:items-center">
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by level, creator, verifier, or link..."
            className="rounded-2xl border-white/10 bg-white/10"
          />
          {searchTerm && (
            <Button onClick={() => setSearchTerm("")} variant="secondary" className="rounded-2xl">
              Clear search
            </Button>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {showAdd && isAdmin && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <AddRemoveRequestForm listType={listType} onSubmit={submitAdminAdd} onCancel={() => setShowAdd(false)} mode="admin" user={user} uploadThumbnail={uploadThumbnail} />
          </motion.div>
        )}
        {showRequest && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <AddRemoveRequestForm listType={listType} onSubmit={submitUserRequest} onCancel={() => setShowRequest(false)} mode="request" user={user} uploadThumbnail={uploadThumbnail} />
          </motion.div>
        )}
        {showEdit && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <EditLevelsPanel
              listType={listType}
              levels={levels}
              isAdmin={isAdmin}
              user={user}
              uploadThumbnail={uploadThumbnail}
              onAdminSave={saveEditedLevels}
              onViewerSubmit={submitEditRequests}
              onCancel={() => setShowEdit(false)}
            />
          </motion.div>
        )}
        {reportingLevel && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <ReportLevelPanel
              level={reportingLevel}
              user={user}
              onSubmit={(level, reasonType, details) => submitReport(listType, level, reasonType, details)}
              onCancel={() => setReportingLevel(null)}
            />
          </motion.div>
        )}
        {showRequests && isAdmin && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <RequestsPanel requests={listRequests} onApprove={approveRequest} onDeny={denyRequest} />
          </motion.div>
        )}
        {showReports && isAdmin && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <ReportsPanel reports={listReports} onResolve={resolveReport} onDismiss={dismissReport} />
          </motion.div>
        )}
      </AnimatePresence>

      {removeMode && isAdmin && (
        <div className="mx-auto max-w-[800px] rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
          Remove mode is on. Click or hover a level to remove it. The rankings will automatically close the gap.
        </div>
      )}

      <div className="space-y-5 pb-20">
        {filteredLevels.length === 0 && (
          <div className="mx-auto max-w-[800px] rounded-[2rem] border border-dashed border-white/15 p-8 text-center text-slate-400">
            No levels matched your search.
          </div>
        )}
        <AnimatePresence>
          {filteredLevels.map((level, index) => (
            <LevelCard key={level.id} level={level} index={index} listType={listType} removeMode={isAdmin && removeMode} onRemove={submitRemove} onReport={setReportingLevel} onOpenDetails={onOpenLevel} reorderMode={false} draggable={false} />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function PeePooListWebsite() {
  const [tab, setTabState] = useState(initialTabFromHash);

  function setTab(nextTab) {
    const safeTab = String(nextTab || "home");
    setTabState(safeTab);

    if (typeof window !== "undefined") {
      const basePath = `${window.location.pathname}${window.location.search}`;
      if (safeTab.startsWith("level:")) {
        const levelId = safeTab.slice("level:".length);
        window.history.replaceState({}, document.title, `${basePath}#/level/${encodeURIComponent(levelId)}`);
      } else if (safeTab.startsWith("user:")) {
        const profileId = safeTab.slice("user:".length);
        window.history.replaceState({}, document.title, `${basePath}#/u/${encodeURIComponent(profileId)}`);
      } else if (window.location.hash.startsWith("#/level/") || window.location.hash.startsWith("#/u/")) {
        window.history.replaceState({}, document.title, basePath);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [levels, setLevels] = useState(SAMPLE_LEVELS);
  const [requests, setRequests] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [statusRequests, setStatusRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [changelogEntries, setChangelogEntries] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [levelComments, setLevelComments] = useState([]);
  const [lastChatSentAt, setLastChatSentAt] = useState(0);
  const [lastLevelCommentSentAt, setLastLevelCommentSentAt] = useState(0);

  const isAdmin = profile?.role === "admin";
  const isPriority = profile?.role === "priority";

  async function loadProfile(nextUser) {
    if (!supabase || !nextUser) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase.from("profiles").select("user_id, role, display_name, handle, bio, avatar_url").eq("user_id", nextUser.id).maybeSingle();

    if (error) {
      setProfile({ role: "user" });
      return;
    }

    setProfile(data || { role: "user" });
  }

  async function loadLevels() {
    if (!supabase) return;
    const { data, error } = await supabase.from("levels").select("*").order("rank", { ascending: true });
    if (error) {
      setStatusMessage(`Could not load levels: ${error.message}`);
      return;
    }
    setLevels(groupLevels(data || []));
  }

  async function loadRequests() {
    if (!supabase || !isAdmin) {
      setRequests([]);
      return;
    }

    const { data, error } = await supabase.from("requests").select("*").eq("status", "pending").order("created_at", { ascending: false });

    if (error) {
      setStatusMessage(`Could not load requests: ${error.message}`);
      return;
    }

    const sortedRequests = [...(data || [])].sort((a, b) => {
      const priorityDiff = Number(Boolean(b.request_priority)) - Number(Boolean(a.request_priority));
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

    setRequests(sortedRequests);
  }

  async function loadStatusRequests() {
    if (!supabase || !isAdmin) {
      setStatusRequests([]);
      return;
    }

    const { data, error } = await supabase.from("status_requests").select("*").eq("status", "pending").order("created_at", { ascending: false });

    if (error) {
      setStatusMessage(`Could not load status requests: ${error.message}`);
      return;
    }

    setStatusRequests(data || []);
  }

  async function loadReports() {
    if (!supabase || !isAdmin) {
      setReports([]);
      return;
    }

    const { data, error } = await supabase.from("reports").select("*").order("created_at", { ascending: false });

    if (error) {
      setStatusMessage(`Could not load reports: ${error.message}`);
      return;
    }

    setReports(data || []);
  }

  async function loadChangelogEntries() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("changelog")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      setStatusMessage(`Could not load changelog: ${error.message}`);
      return;
    }

    setChangelogEntries(data || []);
  }

  async function loadChatMessages() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("public_chat_messages")
      .select("*")
      .eq("is_hidden", false)
      .order("created_at", { ascending: false })
      .limit(80);

    if (error) {
      setStatusMessage(`Could not load public chat: ${error.message}`);
      return;
    }

    setChatMessages(data || []);
  }

  async function loadLevelComments() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("level_comments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      setStatusMessage(`Could not load level comments: ${error.message}`);
      return;
    }

    setLevelComments(data || []);
  }

  async function loadNotifications(nextUser = user) {
    if (!supabase || !nextUser) {
      setNotifications([]);
      return;
    }

    const { data, error } = await supabase.from("notifications").select("*").eq("user_id", nextUser.id).order("created_at", { ascending: false });

    if (error) {
      setNotifications([]);
      return;
    }

    setNotifications(data || []);
  }

  async function loadUserRequests(nextUser = user) {
    if (!supabase || !nextUser) {
      setUserRequests([]);
      return;
    }

    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .eq("created_by", nextUser.id)
      .order("created_at", { ascending: false });

    if (error) {
      setStatusMessage(`Could not load your requests: ${error.message}`);
      return;
    }

    setUserRequests(data || []);
  }

  async function loadPublicProfiles() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, role, display_name, handle, bio, avatar_url, updated_at")
      .order("handle", { ascending: true, nullsFirst: false });

    if (error) {
      setStatusMessage(`Could not load profiles: ${error.message}`);
      return;
    }

    setPublicProfiles(data || []);
  }

  async function loadUserBadges() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("user_badges")
      .select("*")
      .order("awarded_at", { ascending: false });

    if (error) {
      setStatusMessage(`Could not load badges: ${error.message}`);
      return;
    }

    setUserBadges(data || []);
  }

  useEffect(() => {
    function handleHashChange() {
      const nextTab = initialTabFromHash();
      if (nextTab.startsWith("level:") || nextTab.startsWith("user:")) setTabState(nextTab);
    }

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (!supabase) return;

    async function startAuth() {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const hashError = hashParams.get("error_description");

      if (hashError) {
        setAuthMessage(hashError.replaceAll("+", " "));
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const code = new URLSearchParams(window.location.search).get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setAuthMessage(`Login link error: ${error.message}`);
        } else {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }

      const { data } = await supabase.auth.getSession();
      const nextUser = data.session?.user || null;
      setUser(nextUser);
      await loadProfile(nextUser);
      await loadNotifications(nextUser);
      await loadUserRequests(nextUser);
      await loadChangelogEntries();
      await loadChatMessages();
      await loadLevelComments();
      await loadPublicProfiles();
      await loadUserBadges();
    }

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user || null;
      setUser(nextUser);
      loadProfile(nextUser);
      loadNotifications(nextUser);
      loadUserRequests(nextUser);
    });

    startAuth();
    loadLevels();
    loadChangelogEntries();
    loadChatMessages();
    loadPublicProfiles();
    loadUserBadges();

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    loadRequests();
    loadStatusRequests();
    loadReports();
    loadNotifications(user);
    loadUserRequests(user);
  }, [isAdmin, user]);

  async function signIn() {
    if (!supabase || !authEmail.trim() || !authPassword) return;
    const { data, error } = await supabase.auth.signInWithPassword({ email: authEmail.trim(), password: authPassword });

    if (error) {
      setAuthMessage(error.message);
      return;
    }

    const nextUser = data.user || null;
    setUser(nextUser);
    await loadProfile(nextUser);
    setAuthMessage("Signed in.");
  }

  async function signUp() {
    if (!supabase || !authEmail.trim() || !authPassword) return;
    const { data, error } = await supabase.auth.signUp({ email: authEmail.trim(), password: authPassword });

    if (error) {
      setAuthMessage(error.message);
      return;
    }

    const nextUser = data.user || null;
    setUser(nextUser);
    await loadProfile(nextUser);
    setAuthMessage(data.session ? "Account created and signed in." : "Account created. Check your email if Supabase asks for confirmation.");
  }

  async function signInWithGoogle() {
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setAuthMessage(error.message);
    }
  }

  async function signInWithGithub() {
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setAuthMessage(error.message);
    }
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setRequests([]);
    setUserRequests([]);
    setStatusRequests([]);
    setReports([]);
    setNotifications([]);
    setAuthMessage("Signed out.");
  }

  async function deleteAccount() {
    if (!supabase || !user) return;

    const confirmed = window.confirm("Delete your PeePooList account? This cannot be undone.");
    if (!confirmed) return;

    const doubleConfirmed = window.confirm("Are you completely sure? Your account will be permanently deleted.");
    if (!doubleConfirmed) return;

    try {
      setAuthMessage("Deleting account...");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        setAuthMessage("You need to sign in again before deleting your account.");
        return;
      }

      const response = await fetch("/api/delete-account", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setAuthMessage(result.message || "Could not delete account.");
        return;
      }

      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setRequests([]);
      setUserRequests([]);
      setStatusRequests([]);
      setNotifications([]);
      setAuthMessage("Account deleted.");
    } catch (error) {
      setAuthMessage(`Could not delete account: ${error.message}`);
    }
  }

  async function changeEmail(newEmail) {
    if (!supabase || !user) return { error: "Sign in before changing your email." };
    if (!isValidEmailAddress(newEmail)) return { error: "Invalid email" };

    const { error } = await supabase.auth.updateUser(
      { email: newEmail.trim() },
      { emailRedirectTo: window.location.origin }
    );

    if (error) {
      setStatusMessage(`Could not change email: ${error.message}`);
      return { error: error.message };
    }

    setStatusMessage("Email change confirmation sent.");
    return { ok: true };
  }

  async function changePassword(newPassword) {
    if (!supabase || !user) return { error: "Sign in before changing your password." };
    if (String(newPassword || "").length < 6) return { error: "Password must be at least 6 characters" };

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setStatusMessage(`Could not change password: ${error.message}`);
      return { error: error.message };
    }

    setStatusMessage("Password changed.");
    return { ok: true };
  }

  async function updateProfile(form) {
    if (!supabase || !user) return { error: "Sign in before editing your profile." };

    const cleanHandle = normalizeHandle(form.handle || "");
    if (cleanHandle.length < 3) return { error: "Handle must be at least 3 characters." };

    try {
      const { error } = await supabase.rpc("update_my_profile", {
        p_display_name: String(form.display_name || "").trim().slice(0, 40),
        p_handle: cleanHandle,
        p_bio: String(form.bio || "").trim().slice(0, 240),
        p_avatar_url: String(form.avatar_url || "").trim() || null,
      });

      if (error) throw error;

      await loadProfile(user);
      await loadPublicProfiles();
      setStatusMessage("Profile updated.");
      return { ok: true };
    } catch (error) {
      setStatusMessage(`Could not update profile: ${error.message}`);
      return { error: error.message };
    }
  }

  async function awardBadge(profileUserId, badge) {
    if (!supabase || !isAdmin) return { error: "Admin access required." };
    if (!profileUserId || !badge?.label?.trim()) return { error: "Badge name is required." };

    try {
      const { error } = await supabase.from("user_badges").insert({
        user_id: profileUserId,
        badge_key: normalizeHandle(badge.label || "badge") || "badge",
        badge_label: String(badge.label || "Badge").trim().slice(0, 40),
        badge_description: String(badge.description || "").trim().slice(0, 140) || null,
        badge_color: badge.color || "emerald",
        awarded_by: user?.id || null,
      });

      if (error) throw error;
      await loadUserBadges();
      return { ok: true };
    } catch (error) {
      setStatusMessage(`Could not award badge: ${error.message}`);
      return { error: error.message };
    }
  }

  async function deleteBadge(badgeId) {
    if (!supabase || !isAdmin || !badgeId) return;

    try {
      const { error } = await supabase.from("user_badges").delete().eq("id", badgeId);
      if (error) throw error;
      await loadUserBadges();
      setStatusMessage("Badge removed.");
    } catch (error) {
      setStatusMessage(`Could not remove badge: ${error.message}`);
    }
  }

  async function submitStatusRequest(form) {
    if (!supabase || !user) return { error: "Sign in before requesting a status change." };

    try {
      const { error } = await supabase.from("status_requests").insert({
        requested_status: form.requested_status,
        reason: form.reason?.trim() || null,
        requester_email: user.email || null,
        status: "pending",
        created_by: user.id,
      });

      if (error) throw error;

      setStatusMessage("Status change request submitted.");
      await loadStatusRequests();
      return { ok: true };
    } catch (error) {
      setStatusMessage(`Could not submit status request: ${error.message}`);
      return { error: error.message };
    }
  }

  async function createNotification(userId, title, message) {
    if (!supabase || !userId) return;

    const { error } = await supabase.from("notifications").insert({
      user_id: userId,
      title,
      message,
      is_read: false,
    });

    if (error) {
      console.error("Could not create notification:", error.message);
    }
  }

  async function markNotificationsRead() {
    if (!supabase || !user) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (!error) {
      await loadNotifications(user);
    }
  }

  async function approveStatusRequest(request) {
    if (!supabase || !isAdmin) return;

    try {
      const role = roleFromRequestedStatus(request.requested_status);
      const { error: profileError } = await supabase.from("profiles").upsert({
        user_id: request.created_by,
        role,
      });

      if (profileError) throw profileError;

      const { error: requestError } = await supabase.from("status_requests").update({ status: "approved" }).eq("id", request.id);
      if (requestError) throw requestError;

      await createNotification(
        request.created_by,
        "Status request approved",
        `Your request for ${readableStatus(request.requested_status)} status was approved.`
      );

      await loadStatusRequests();
      setStatusMessage("Status request approved.");
    } catch (error) {
      setStatusMessage(`Could not approve status request: ${error.message}`);
    }
  }

  async function denyStatusRequest(request) {
    if (!supabase || !isAdmin) return;

    try {
      const { error } = await supabase.from("status_requests").update({ status: "denied" }).eq("id", request.id);
      if (error) throw error;

      await createNotification(
        request.created_by,
        "Status request declined",
        `Your request for ${readableStatus(request.requested_status)} status was declined.`
      );

      await loadStatusRequests();
      setStatusMessage("Status request declined.");
    } catch (error) {
      setStatusMessage(`Could not decline status request: ${error.message}`);
    }
  }

  async function uploadThumbnail(file) {
    if (!supabase || !user) {
      setStatusMessage("Sign in before uploading thumbnails.");
      return "";
    }

    try {
      const extension = file.name.split(".").pop() || "png";
      const safeName = `${crypto.randomUUID()}.${extension.toLowerCase()}`;
      const path = `${user.id}/${safeName}`;
      const { error } = await supabase.storage.from("thumbnails").upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });

      if (error) throw error;

      const { data } = supabase.storage.from("thumbnails").getPublicUrl(path);
      return data.publicUrl;
    } catch (error) {
      setStatusMessage(`Could not upload thumbnail: ${error.message}`);
      return "";
    }
  }

  async function uploadAvatar(file) {
    if (!supabase || !user) {
      setStatusMessage("Sign in before uploading an avatar.");
      return "";
    }

    try {
      const extension = (file.name.split(".").pop() || "png").toLowerCase();
      const path = `${user.id}/avatar-${Date.now()}.${extension}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

      if (error) throw error;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      return data.publicUrl;
    } catch (error) {
      setStatusMessage(`Could not upload avatar: ${error.message}`);
      return "";
    }
  }

  async function reorderRanks(listType) {
    if (!supabase || !isAdmin) return;
    const { data, error } = await supabase.from("levels").select("id").eq("list_type", listType).order("rank", { ascending: true });

    if (error) throw error;

    for (let i = 0; i < (data || []).length; i += 1) {
      const { error: updateError } = await supabase.from("levels").update({ rank: i + 1 }).eq("id", data[i].id);
      if (updateError) throw updateError;
    }
  }

  async function addLevel(listType, form) {
    if (!supabase || !isAdmin) {
      setStatusMessage("Admin database access is required to edit levels.");
      return;
    }

    try {
      const existing = levels[listType] || [];
      const rank = clampRank(form.position || form.rank, existing.length + 1);
      const affected = [...existing].filter((level) => level.rank >= rank).sort((a, b) => b.rank - a.rank);

      for (const level of affected) {
        const { error } = await supabase.from("levels").update({ rank: level.rank + 1 }).eq("id", level.id);
        if (error) throw error;
      }

      const { error } = await supabase.from("levels").insert({
        list_type: listType,
        rank,
        name: form.name.trim(),
        creator: form.creator.trim() || "Unknown",
        verifier: form.verifier.trim() || "Unknown",
        thumbnail_url: form.thumbnail_url?.trim() || null,
        level_url: form.level_url?.trim() || null,
      });

      if (error) throw error;
      await reorderRanks(listType);
      await loadLevels();
      setStatusMessage("Level added securely.");
    } catch (error) {
      setStatusMessage(`Could not add level: ${error.message}`);
    }
  }

  async function removeLevel(listType, id) {
    if (!supabase || !isAdmin) {
      setStatusMessage("Admin database access is required to remove levels.");
      return;
    }

    try {
      const { error } = await supabase.from("levels").delete().eq("id", id);
      if (error) throw error;
      await reorderRanks(listType);
      await loadLevels();
      setStatusMessage("Level removed securely.");
    } catch (error) {
      setStatusMessage(`Could not remove level: ${error.message}`);
    }
  }

  async function saveEditedLevels(listType, editedLevels, imageFiles = {}) {
    if (!supabase || !isAdmin) {
      setStatusMessage("Admin database access is required to edit levels.");
      return;
    }

    try {
      const finalLevels = [];

      for (let i = 0; i < editedLevels.length; i += 1) {
        const level = cleanLevelForSave(editedLevels[i], i);
        const file = imageFiles[level.id];
        if (file) {
          const uploadedUrl = await uploadThumbnail(file);
          if (!uploadedUrl) return;
          level.thumbnail_url = uploadedUrl;
        }
        finalLevels.push(level);
      }

      setLevels((current) => ({ ...current, [listType]: finalLevels }));

      for (const level of finalLevels) {
        const { error } = await supabase
          .from("levels")
          .update({
            rank: level.rank,
            name: level.name,
            creator: level.creator,
            verifier: level.verifier,
            thumbnail_url: level.thumbnail_url || null,
            level_url: level.level_url || null,
          })
          .eq("id", level.id);
        if (error) throw error;
      }

      setStatusMessage("Changes saved securely.");
    } catch (error) {
      setStatusMessage(`Could not save changes: ${error.message}`);
      await loadLevels();
    }
  }

  async function submitRequest(listType, form) {
    if (!supabase || !user) {
      setStatusMessage("Sign in before submitting requests.");
      return;
    }

    try {
      const { error } = await supabase.from("requests").insert({
        action: form.action,
        list_type: listType,
        rank: Number.parseInt(form.position, 10) || 1,
        name: form.name.trim(),
        creator: form.creator?.trim() || null,
        verifier: form.verifier?.trim() || null,
        thumbnail_url: form.thumbnail_url?.trim() || null,
        level_url: form.level_url?.trim() || null,
        reason: form.reason?.trim() || null,
        requester_email: user.email || null,
        request_priority: isPriority,
        status: "pending",
        created_by: user.id,
      });

      if (error) throw error;
      setStatusMessage("Request submitted for admin review.");
      await loadRequests();
      await loadUserRequests(user);
    } catch (error) {
      setStatusMessage(`Could not submit request: ${error.message}`);
    }
  }

  async function submitEditRequests(listType, editedLevels, imageFiles = {}, reason = "") {
    if (!supabase || !user) {
      setStatusMessage("Sign in before submitting edit requests.");
      return;
    }

    try {
      const originalLevels = levels[listType] || [];
      const requestsToInsert = [];

      for (let i = 0; i < editedLevels.length; i += 1) {
        const original = originalLevels.find((level) => level.id === editedLevels[i].id);
        const level = cleanLevelForSave(editedLevels[i], i);
        const file = imageFiles[level.id];
        if (file) {
          const uploadedUrl = await uploadThumbnail(file);
          if (!uploadedUrl) return;
          level.thumbnail_url = uploadedUrl;
        }

        if (hasLevelChanged(original, level, i) || file) {
          requestsToInsert.push({
            action: "edit",
            list_type: listType,
            target_level_id: level.id,
            rank: level.rank,
            name: level.name,
            creator: level.creator || null,
            verifier: level.verifier || null,
            thumbnail_url: level.thumbnail_url || null,
            level_url: level.level_url || null,
            reason: reason?.trim() || null,
            requester_email: user.email || null,
            request_priority: isPriority,
            status: "pending",
            created_by: user.id,
          });
        }
      }

      if (requestsToInsert.length === 0) {
        setStatusMessage("No edits were changed, so no request was submitted.");
        return;
      }

      const { error } = await supabase.from("requests").insert(requestsToInsert);
      if (error) throw error;
      setStatusMessage(`${requestsToInsert.length} edit request${requestsToInsert.length === 1 ? "" : "s"} submitted for admin review.`);
      await loadRequests();
      await loadUserRequests(user);
    } catch (error) {
      setStatusMessage(`Could not submit edit request: ${error.message}`);
    }
  }

  async function submitReport(listType, level, reasonType, details) {
    if (!supabase || !user) {
      setStatusMessage("Sign in before reporting levels.");
      return;
    }

    try {
      const { error } = await supabase.from("reports").insert({
        level_id: level.id,
        list_type: listType,
        level_name: level.name || "Unnamed level",
        reason_type: reasonType,
        details: details?.trim() || null,
        reporter_email: user.email || null,
        status: "pending",
        created_by: user.id,
      });

      if (error) throw error;

      setStatusMessage("Report submitted for admin review.");
      await loadReports();
    } catch (error) {
      setStatusMessage(`Could not submit report: ${error.message}`);
    }
  }

  async function resolveReport(report) {
    if (!supabase || !isAdmin) return;

    try {
      const { error } = await supabase.from("reports").update({ status: "resolved" }).eq("id", report.id);
      if (error) throw error;

      await loadReports();
      setStatusMessage("Report marked resolved.");
    } catch (error) {
      setStatusMessage(`Could not resolve report: ${error.message}`);
    }
  }

  async function dismissReport(report) {
    if (!supabase || !isAdmin) return;

    try {
      const { error } = await supabase.from("reports").update({ status: "dismissed" }).eq("id", report.id);
      if (error) throw error;

      await loadReports();
      setStatusMessage("Report dismissed.");
    } catch (error) {
      setStatusMessage(`Could not dismiss report: ${error.message}`);
    }
  }

  async function addChangelogEntry(form) {
    if (!supabase || !isAdmin) return false;

    try {
      const { error } = await supabase.from("changelog").insert({
        kind: form.kind || "update",
        title: form.title.trim(),
        body: form.body?.trim() || null,
        created_by: user?.id || null,
      });

      if (error) throw error;

      await loadChangelogEntries();
      setStatusMessage("Changelog entry posted.");
      return true;
    } catch (error) {
      setStatusMessage(`Could not post changelog entry: ${error.message}`);
      return false;
    }
  }

  async function deleteChangelogEntry(entry) {
    if (!supabase || !isAdmin) return;

    try {
      const { error } = await supabase.from("changelog").delete().eq("id", entry.id);
      if (error) throw error;

      await loadChangelogEntries();
      setStatusMessage("Changelog entry deleted.");
    } catch (error) {
      setStatusMessage(`Could not delete changelog entry: ${error.message}`);
    }
  }

  async function sendChatMessage(message) {
    if (!supabase || !user) {
      setStatusMessage("Sign in before chatting.");
      return false;
    }

    const cooldownLeft = cooldownSecondsLeft(lastChatSentAt);
    if (cooldownLeft > 0) {
      setStatusMessage(`Slow down a little. Chat again in ${cooldownLeft} second${cooldownLeft === 1 ? "" : "s"}.`);
      return false;
    }

    const validation = validatePublicMessage(message);
    if (!validation.ok) {
      setStatusMessage(validation.message);
      return false;
    }

    try {
      const displayName = profileLabel(profile, user);
      const { error } = await supabase.from("public_chat_messages").insert({
        message: validation.clean,
        display_name: displayName,
        is_hidden: false,
        created_by: user.id,
      });

      if (error) throw error;

      setLastChatSentAt(Date.now());
      await loadChatMessages();
      return true;
    } catch (error) {
      const friendly = String(error.message || "").toLowerCase().includes("row-level security")
        ? "Chat is rate-limited. Wait a few seconds and try again."
        : error.message;
      setStatusMessage(`Could not send chat message: ${friendly}`);
      return false;
    }
  }

  async function hideChatMessage(message) {
    if (!supabase || !isAdmin) return;

    try {
      const { error } = await supabase.from("public_chat_messages").update({ is_hidden: true }).eq("id", message.id);
      if (error) throw error;

      await loadChatMessages();
      setStatusMessage("Chat message removed.");
    } catch (error) {
      setStatusMessage(`Could not remove chat message: ${error.message}`);
    }
  }

  async function sendLevelComment(level, listType, message) {
    if (!supabase || !user) {
      setStatusMessage("Sign in before commenting.");
      return false;
    }

    const cooldownLeft = cooldownSecondsLeft(lastLevelCommentSentAt);
    if (cooldownLeft > 0) {
      setStatusMessage(`Slow down a little. Comment again in ${cooldownLeft} second${cooldownLeft === 1 ? "" : "s"}.`);
      return false;
    }

    const validation = validatePublicMessage(message);
    if (!validation.ok) {
      setStatusMessage(validation.message);
      return false;
    }

    try {
      const { error } = await supabase.from("level_comments").insert({
        level_id: level.id,
        list_type: listType,
        message: validation.clean,
        display_name: profileLabel(profile, user),
        is_hidden: false,
        created_by: user.id,
      });

      if (error) throw error;

      setLastLevelCommentSentAt(Date.now());
      await loadLevelComments();
      return true;
    } catch (error) {
      const friendly = String(error.message || "").toLowerCase().includes("row-level security")
        ? "Comments are rate-limited. Wait a few seconds and try again."
        : error.message;
      setStatusMessage(`Could not post comment: ${friendly}`);
      return false;
    }
  }

  async function hideLevelComment(comment) {
    if (!supabase || !isAdmin) return;

    try {
      const { error } = await supabase.from("level_comments").update({ is_hidden: true }).eq("id", comment.id);
      if (error) throw error;

      await loadLevelComments();
      setStatusMessage("Comment removed.");
    } catch (error) {
      setStatusMessage(`Could not remove comment: ${error.message}`);
    }
  }

  async function approveRequest(request) {
    if (!supabase || !isAdmin) return;

    try {
      if (request.action === "add") {
        await addLevel(request.list_type, {
          name: request.name,
          creator: request.creator || "Unknown",
          verifier: request.verifier || "Unknown",
          thumbnail_url: request.thumbnail_url || "",
          level_url: request.level_url || "",
          position: request.rank,
        });
      } else if (request.action === "remove") {
        const match = levels[request.list_type]?.find((level) => level.name.toLowerCase() === String(request.name).toLowerCase());
        if (match) await removeLevel(request.list_type, match.id);
      } else if (request.action === "edit") {
        const list = levels[request.list_type] || [];
        const match = list.find((level) => level.id === request.target_level_id) || list.find((level) => level.name.toLowerCase() === String(request.name).toLowerCase());
        if (match) {
          const updatedList = list.map((level) =>
            level.id === match.id
              ? {
                  ...level,
                  name: request.name || level.name,
                  creator: request.creator || level.creator,
                  verifier: request.verifier || level.verifier,
                  thumbnail_url: request.thumbnail_url || level.thumbnail_url,
                  level_url: request.level_url || level.level_url,
                }
              : level
          );
          const movedList = moveLevelInList(updatedList, match.id, clampRank(request.rank, updatedList.length) - 1);
          await saveEditedLevels(request.list_type, movedList, {});
        }
      }

      const { error } = await supabase.from("requests").update({ status: "approved" }).eq("id", request.id);
      if (error) throw error;

      await createNotification(
        request.created_by,
        "Level request approved",
        `Your ${request.action} request for ${request.name || "a level"} on ${request.list_type === "pooplist" ? "The Pooplist" : "The Peelist"} was approved.`
      );

      await loadRequests();
      await loadUserRequests(user);
      await loadNotifications(user);
      setStatusMessage("Request approved.");
    } catch (error) {
      setStatusMessage(`Could not approve request: ${error.message}`);
    }
  }

  async function denyRequest(requestOrId) {
    if (!supabase || !isAdmin) return;

    const request = typeof requestOrId === "string" ? requests.find((item) => item.id === requestOrId) : requestOrId;
    const id = request?.id || requestOrId;

    try {
      const { error } = await supabase.from("requests").update({ status: "denied" }).eq("id", id);
      if (error) throw error;

      if (request?.created_by) {
        await createNotification(
          request.created_by,
          "Level request declined",
          `Your ${request.action} request for ${request.name || "a level"} on ${request.list_type === "pooplist" ? "The Pooplist" : "The Peelist"} was declined.`
        );
      }

      await loadRequests();
      await loadUserRequests(user);
      await loadNotifications(user);
      setStatusMessage("Request denied.");
    } catch (error) {
      setStatusMessage(`Could not deny request: ${error.message}`);
    }
  }

  const visiblePage = useMemo(() => {
    if (tab.startsWith("level:")) {
      const levelId = tab.slice("level:".length);
      const allLevels = [
        ...(levels.pooplist || []).map((level, index) => ({ level, index, listType: "pooplist" })),
        ...(levels.peelist || []).map((level, index) => ({ level, index, listType: "peelist" })),
      ];
      const match = allLevels.find((item) => String(item.level.id) === String(levelId));

      if (match) {
        return (
          <LevelDetailPage
            level={match.level}
            index={match.index}
            listType={match.listType}
            changelogEntries={changelogEntries}
            comments={levelComments}
            user={user}
            isAdmin={isAdmin}
            onBack={() => setTab(match.listType)}
            onSubmitReport={(level, reasonType, details) => submitReport(match.listType, level, reasonType, details)}
            onSendComment={sendLevelComment}
            onHideComment={hideLevelComment}
          />
        );
      }

      return (
        <InfoPageShell title="Level not found" eyebrow="Missing level">
          <p>The level detail page could not be found. It may have been removed or the link may be old.</p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setTab("pooplist")} className="rounded-2xl">The Pooplist</Button>
            <Button onClick={() => setTab("peelist")} variant="secondary" className="rounded-2xl">The Peelist</Button>
          </div>
        </InfoPageShell>
      );
    }

    if (tab.startsWith("user:")) {
      const profileId = decodeURIComponent(tab.slice("user:".length));
      const cleanProfileId = normalizeHandle(profileId);
      const match = publicProfiles.find((item) => String(item.user_id) === profileId || String(item.handle || "") === cleanProfileId);

      if (match) {
        return (
          <UserProfilePage
            profile={match}
            badges={userBadges.filter((badge) => String(badge.user_id) === String(match.user_id))}
            viewer={user}
            isAdmin={isAdmin}
            onBack={() => setTab("home")}
            onAwardBadge={awardBadge}
            onDeleteBadge={deleteBadge}
          />
        );
      }

      return (
        <InfoPageShell title="Profile not found" eyebrow="Missing user">
          <p>The profile could not be found. The handle might have changed.</p>
          <Button onClick={() => setTab("home")} className="rounded-2xl">Back home</Button>
        </InfoPageShell>
      );
    }

    if (tab === "about") return <AboutPage />;
    if (tab === "rules") return <RulesPage />;
    if (tab === "privacy") return <PrivacyPolicyPage />;
    if (tab === "contact") return <ContactPage />;
    if (tab === "stats") {
      return (
        <StatsPage
          levels={levels}
          requests={requests}
          reports={reports}
          statusRequests={statusRequests}
          changelogEntries={changelogEntries}
          chatMessages={chatMessages}
          publicProfiles={publicProfiles}
          userBadges={userBadges}
          isAdmin={isAdmin}
          setTab={setTab}
        />
      );
    }
    if (tab === "admin") {
      return (
        <AdminDashboardPage
          isAdmin={isAdmin}
          levels={levels}
          requests={requests}
          statusRequests={statusRequests}
          reports={reports}
          chatMessages={chatMessages}
          changelogEntries={changelogEntries}
          publicProfiles={publicProfiles}
          userBadges={userBadges}
          setTab={setTab}
          onApproveRequest={approveRequest}
          onDenyRequest={denyRequest}
          onApproveStatusRequest={approveStatusRequest}
          onDenyStatusRequest={denyStatusRequest}
          onResolveReport={resolveReport}
          onDismissReport={dismissReport}
          onHideChatMessage={hideChatMessage}
          onDeleteChangelogEntry={deleteChangelogEntry}
        />
      );
    }
    if (tab === "changelog") {
      return (
        <ChangelogPage
          entries={changelogEntries}
          chatMessages={chatMessages}
          user={user}
          isAdmin={isAdmin}
          onAddEntry={addChangelogEntry}
          onDeleteEntry={deleteChangelogEntry}
          onSendChatMessage={sendChatMessage}
          onHideChatMessage={hideChatMessage}
        />
      );
    }
    if (tab === "my-requests") return <MyRequestsPage requests={userRequests} user={user} setTab={setTab} />;

    if (tab === "pooplist") {
      return (
        <ListPage
          listType="pooplist"
          levels={levels.pooplist}
          isAdmin={isAdmin}
          user={user}
          requests={requests}
          reports={reports}
          addLevel={addLevel}
          removeLevel={removeLevel}
          saveEditedLevels={saveEditedLevels}
          submitRequest={submitRequest}
          submitEditRequests={submitEditRequests}
          submitReport={submitReport}
          resolveReport={resolveReport}
          dismissReport={dismissReport}
          approveRequest={approveRequest}
          denyRequest={denyRequest}
          statusMessage={statusMessage}
          isConfigured={isSupabaseConfigured}
          uploadThumbnail={uploadThumbnail}
          onOpenLevel={(level) => setTab(levelDetailTab(level.id))}
        />
      );
    }
    if (tab === "peelist") {
      return (
        <ListPage
          listType="peelist"
          levels={levels.peelist}
          isAdmin={isAdmin}
          user={user}
          requests={requests}
          reports={reports}
          addLevel={addLevel}
          removeLevel={removeLevel}
          saveEditedLevels={saveEditedLevels}
          submitRequest={submitRequest}
          submitEditRequests={submitEditRequests}
          submitReport={submitReport}
          resolveReport={resolveReport}
          dismissReport={dismissReport}
          approveRequest={approveRequest}
          denyRequest={denyRequest}
          statusMessage={statusMessage}
          isConfigured={isSupabaseConfigured}
          uploadThumbnail={uploadThumbnail}
          onOpenLevel={(level) => setTab(levelDetailTab(level.id))}
        />
      );
    }
    return (
      <HomePage
        user={user}
        isAdmin={isAdmin}
        signIn={signIn}
        signUp={signUp}
        signInWithGoogle={signInWithGoogle}
        signInWithGithub={signInWithGithub}
        signOut={signOut}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        authMessage={authMessage}
        requestCount={requests.length}
        statusRequests={statusRequests}
        approveStatusRequest={approveStatusRequest}
        denyStatusRequest={denyStatusRequest}
        isConfigured={isSupabaseConfigured}
        levels={levels}
        changelogEntries={changelogEntries}
        chatMessages={chatMessages}
        publicProfiles={publicProfiles}
        userBadges={userBadges}
        setTab={setTab}
      />
    );
  }, [tab, levels, isAdmin, user, profile, publicProfiles, userBadges, authEmail, authPassword, authMessage, requests, reports, userRequests, statusRequests, changelogEntries, chatMessages, levelComments, notifications, statusMessage]);

  return (
    <SiteShell
      tab={tab}
      setTab={setTab}
      isAdmin={isAdmin}
      user={user}
      profile={profile}
      signOut={signOut}
      deleteAccount={deleteAccount}
      changeEmail={changeEmail}
      changePassword={changePassword}
      submitStatusRequest={submitStatusRequest}
      updateProfile={updateProfile}
      uploadAvatar={uploadAvatar}
      requests={requests}
      statusRequests={statusRequests}
      reports={reports}
      notifications={notifications}
      markNotificationsRead={markNotificationsRead}
    >
      <AnimatePresence mode="wait">{visiblePage}</AnimatePresence>
    </SiteShell>
  );
}
