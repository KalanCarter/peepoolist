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

function SiteShell({ children, tab, setTab, isAdmin, user }) {
  return (
    <div className="min-h-screen bg-[#090d18] text-slate-100 selection:bg-yellow-300 selection:text-black">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0c1220]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <button onClick={() => setTab("home")} className="group flex items-center gap-3 text-left">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-700 text-2xl shadow-lg shadow-yellow-900/30 transition group-hover:scale-105">
              💩
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
            <Badge className={isAdmin ? "rounded-xl bg-emerald-500/20 text-emerald-200" : "rounded-xl bg-slate-700 text-slate-200"}>
              {isAdmin ? <ShieldCheck className="mr-1 h-3 w-3" /> : <Lock className="mr-1 h-3 w-3" />}
              {isAdmin ? "Admin verified" : user ? "Signed in" : "Viewer mode"}
            </Badge>
          </nav>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

function AuthBox({ user, isAdmin, signIn, signUp, signInWithGoogle, signOut, authEmail, setAuthEmail, authPassword, setAuthPassword, authMessage, isConfigured }) {
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
          </>
        )}

        {authMessage && <p className="text-sm text-slate-300">{authMessage}</p>}
      </CardContent>
    </Card>
  );
}

function HomePage({ user, isAdmin, signIn, signUp, signInWithGoogle, signOut, authEmail, setAuthEmail, authPassword, setAuthPassword, authMessage, requestCount, isConfigured }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <section className="grid gap-6 md:grid-cols-[1.2fr_.8fr]">
        <Card className="overflow-hidden rounded-[2rem] border-white/10 bg-white/[0.04] text-slate-100 shadow-2xl shadow-black/30">
          <CardContent className="p-7 md:p-10">
            <Badge className="mb-5 rounded-xl bg-yellow-300 text-black">Geometry Dash challenge rankings</Badge>
            <h2 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">The official ranking hub for PeePooList levels.</h2>
            <p className="mt-5 max-w-2xl text-lg text-slate-300">
              PeePooList ranks custom levels in two categories: possible levels on <b>The Pooplist</b> and impossible levels on <b>The Peelist</b>. Scroll the lists, submit level change requests, and follow the current rankings.
            </p>
          </CardContent>
        </Card>

        <AuthBox
          user={user}
          isAdmin={isAdmin}
          signIn={signIn}
          signUp={signUp}
          signInWithGoogle={signInWithGoogle}
          signOut={signOut}
          authEmail={authEmail}
          setAuthEmail={setAuthEmail}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          authMessage={authMessage}
          isConfigured={isConfigured}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["💩", "Pooplist", "Ranked levels that are considered possible."],
          ["💧", "Peelist", "Ranked levels that are considered impossible."],
          ["🧻", "Requests", "Signed-in users can suggest additions, removals, or edits for admin review."],
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
        <h3 className="text-xl font-black text-white">Security model</h3>
        <p className="mt-2 text-sm leading-6">
          Level editing is protected by Supabase Auth and database Row Level Security. The frontend only shows buttons for admins, but the database still rejects unauthorized inserts, edits, approvals, and deletions.
        </p>
        <p className="mt-3 text-sm text-slate-400">Pending requests: <span className="font-bold text-white">{requestCount}</span></p>
      </section>

      <footer className="rounded-[2rem] border border-yellow-300/30 bg-yellow-300/10 p-6 text-yellow-100">
        <h3 className="text-xl font-black">Disclaimer</h3>
        <p className="mt-2 text-sm leading-6">
          This website is a joke. The PeePooList, The Pooplist, and The Peelist are parody rankings and should not be taken seriously, used for drama, or treated as an actual official Geometry Dash Demonlist. Please laugh responsibly.
        </p>
      </footer>
    </motion.div>
  );
}

function LevelCard({ level, index, listType, removeMode, onRemove, reorderMode, draggable, isDragging, onDragStart, onDragOver, onDrop, onDragEnd }) {
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
        if (removeMode || reorderMode || isDragging || !level.level_url) return;
        openLevelUrl(level.level_url);
      }}
      className={`group relative mx-auto flex min-h-[300px] w-full max-w-[800px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${colors} shadow-2xl shadow-black/25 md:min-h-[300px] md:flex-row ${draggable ? "cursor-grab active:cursor-grabbing" : level.level_url ? "cursor-pointer" : ""} ${isDragging ? "z-30 ring-2 ring-yellow-300/70" : ""}`}
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

      <div className="relative h-48 overflow-hidden border-y border-white/10 md:h-auto md:w-[260px] md:border-x md:border-y-0">
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
          {level.level_url && <Badge className="rounded-xl bg-blue-500/20 text-blue-200">Click to open</Badge>}
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

        <label htmlFor={fileInputId} className="relative h-48 cursor-pointer overflow-hidden border-y border-white/10 md:h-auto md:w-[240px] md:border-x md:border-y-0">
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
                    </div>
                    <h4 className="mt-2 text-xl font-black">{request.name || "Unnamed level"}</h4>
                    <p className="text-sm text-slate-400">Top #{request.rank} · Creator: {request.creator || "Unknown"} · Verifier: {request.verifier || "Unknown"}</p>
                    {request.level_url && <p className="mt-1 break-all text-xs text-blue-200">Link: {request.level_url}</p>}
                    {request.reason && <p className="mt-2 text-sm text-slate-300">“{request.reason}”</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => onApprove(request)} className="rounded-2xl bg-emerald-600 hover:bg-emerald-500"><Check className="mr-2 h-4 w-4" />Approve</Button>
                    <Button onClick={() => onDeny(request.id)} variant="destructive" className="rounded-2xl"><X className="mr-2 h-4 w-4" />Deny</Button>
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

function ListPage({ listType, levels, isAdmin, user, requests, addLevel, removeLevel, saveEditedLevels, submitRequest, submitEditRequests, approveRequest, denyRequest, statusMessage, isConfigured, uploadThumbnail }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const title = listType === "pooplist" ? "The Pooplist" : "The Peelist";
  const subtitle = listType === "pooplist" ? "Possible levels ranked by placement, verification, and list status." : "Impossible levels ranked by placement, difficulty, and list status.";

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

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className={listType === "pooplist" ? "mb-4 rounded-xl bg-amber-500/20 text-amber-200" : "mb-4 rounded-xl bg-yellow-300/20 text-yellow-100"}>
              {levels.length} ranked levels
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
        {showRequests && isAdmin && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <RequestsPanel requests={listRequests} onApprove={approveRequest} onDeny={denyRequest} />
          </motion.div>
        )}
      </AnimatePresence>

      {removeMode && isAdmin && (
        <div className="mx-auto max-w-[800px] rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
          Remove mode is on. Click or hover a level to remove it. The rankings will automatically close the gap.
        </div>
      )}

      <div className="space-y-5 pb-20">
        <AnimatePresence>
          {levels.map((level, index) => (
            <LevelCard key={level.id} level={level} index={index} listType={listType} removeMode={isAdmin && removeMode} onRemove={submitRemove} reorderMode={false} draggable={false} />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function PeePooListWebsite() {
  const [tab, setTab] = useState("home");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [levels, setLevels] = useState(SAMPLE_LEVELS);
  const [requests, setRequests] = useState([]);

  const isAdmin = profile?.role === "admin";

  async function loadProfile(nextUser) {
    if (!supabase || !nextUser) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase.from("profiles").select("role").eq("user_id", nextUser.id).maybeSingle();

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
    setRequests(data || []);
  }

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
    }

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user || null;
      setUser(nextUser);
      loadProfile(nextUser);
    });

    startAuth();
    loadLevels();

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    loadRequests();
  }, [isAdmin]);

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

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setRequests([]);
    setAuthMessage("Signed out.");
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
        status: "pending",
        created_by: user.id,
      });

      if (error) throw error;
      setStatusMessage("Request submitted for admin review.");
      await loadRequests();
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
    } catch (error) {
      setStatusMessage(`Could not submit edit request: ${error.message}`);
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
      await loadRequests();
      setStatusMessage("Request approved.");
    } catch (error) {
      setStatusMessage(`Could not approve request: ${error.message}`);
    }
  }

  async function denyRequest(id) {
    if (!supabase || !isAdmin) return;

    try {
      const { error } = await supabase.from("requests").update({ status: "denied" }).eq("id", id);
      if (error) throw error;
      await loadRequests();
      setStatusMessage("Request denied.");
    } catch (error) {
      setStatusMessage(`Could not deny request: ${error.message}`);
    }
  }

  const visiblePage = useMemo(() => {
    if (tab === "pooplist") {
      return (
        <ListPage
          listType="pooplist"
          levels={levels.pooplist}
          isAdmin={isAdmin}
          user={user}
          requests={requests}
          addLevel={addLevel}
          removeLevel={removeLevel}
          saveEditedLevels={saveEditedLevels}
          submitRequest={submitRequest}
          submitEditRequests={submitEditRequests}
          approveRequest={approveRequest}
          denyRequest={denyRequest}
          statusMessage={statusMessage}
          isConfigured={isSupabaseConfigured}
          uploadThumbnail={uploadThumbnail}
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
          addLevel={addLevel}
          removeLevel={removeLevel}
          saveEditedLevels={saveEditedLevels}
          submitRequest={submitRequest}
          submitEditRequests={submitEditRequests}
          approveRequest={approveRequest}
          denyRequest={denyRequest}
          statusMessage={statusMessage}
          isConfigured={isSupabaseConfigured}
          uploadThumbnail={uploadThumbnail}
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
        signOut={signOut}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        authMessage={authMessage}
        requestCount={requests.length}
        isConfigured={isSupabaseConfigured}
      />
    );
  }, [tab, levels, isAdmin, user, authEmail, authPassword, authMessage, requests, statusMessage]);

  return (
    <SiteShell tab={tab} setTab={setTab} isAdmin={isAdmin} user={user}>
      <AnimatePresence mode="wait">{visiblePage}</AnimatePresence>
    </SiteShell>
  );
}
