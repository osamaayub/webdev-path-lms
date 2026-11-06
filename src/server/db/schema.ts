import { boolean, index, integer, jsonb, pgEnum, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// ---------------------------------------------------------------------------
// Auth.js tables (shape required by @auth/drizzle-adapter)
// ---------------------------------------------------------------------------

export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  // Set only for email + password accounts (scrypt, see src/server/password.ts). Null for GitHub/Google users.
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

// ---------------------------------------------------------------------------
// Learning data. Course content (lessons, quizzes, projects) lives in code;
// the database only stores what each learner did.
// ---------------------------------------------------------------------------

/** A lesson is complete once its quiz is passed. One row per learner per lesson. */
export const lessonProgress = pgTable(
  "lesson_progress",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id").notNull(),
    completedAt: timestamp("completed_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId] })],
);

export const quizAttempts = pgTable(
  "quiz_attempt",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id").notNull(),
    score: integer("score").notNull(),
    total: integer("total").notNull(),
    passed: boolean("passed").notNull(),
    answers: jsonb("answers").$type<number[]>().notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [index("quiz_attempt_user_lesson_idx").on(t.userId, t.lessonId, t.createdAt)],
);

/** Requirement checklist for each project, ticked by the learner. */
export const projectChecklists = pgTable(
  "project_checklist",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    projectSlug: text("project_slug").notNull(),
    checked: jsonb("checked").$type<number[]>().notNull().default([]),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.projectSlug] })],
);

export const submissionStatus = pgEnum("submission_status", ["submitted", "changes_requested", "approved"]);
export type SubmissionStatus = (typeof submissionStatus.enumValues)[number];

/** One submission per learner per project. Resubmitting updates it and sends it back to review. */
export const submissions = pgTable(
  "submission",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    projectSlug: text("project_slug").notNull(),
    repoUrl: text("repo_url").notNull(),
    liveUrl: text("live_url").notNull(),
    notes: text("notes"),
    status: submissionStatus("status").notNull().default("submitted"),
    grade: integer("grade"),
    feedback: text("feedback"),
    reviewedBy: text("reviewed_by").references(() => users.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewed_at", { mode: "date" }),
    attempts: integer("attempts").notNull().default(1),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("submission_user_project_idx").on(t.userId, t.projectSlug), index("submission_status_idx").on(t.status, t.updatedAt)],
);

// ---------------------------------------------------------------------------
// Sign-in and sign-up attempts, for rate limiting (works across serverless instances)
// ---------------------------------------------------------------------------

export const authAttempts = pgTable(
  "auth_attempt",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull(), // e.g. "signin:ana@example.com" or "signup:203.0.113.4"
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [index("auth_attempt_key_idx").on(t.key, t.createdAt)],
);
