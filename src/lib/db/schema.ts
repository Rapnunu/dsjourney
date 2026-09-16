import { sql } from "drizzle-orm";
import {
  check,
  date,
  index,
  numeric,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const studySessions = pgTable(
  "study_sessions",
  {
    userId: uuid("user_id").notNull(),
    id: text("id").notNull(),
    topicId: text("topic_id").notNull(),
    topicName: text("topic_name").notNull(),
    categoryName: text("category_name").notNull(),
    studyDate: date("study_date").notNull(),
    hoursStudied: numeric("hours_studied").notNull(),
    difficultyRating: smallint("difficulty_rating").notNull(),
    notes: text("notes").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.id] }),
    check("study_sessions_id_not_blank", sql`btrim(${table.id}) <> ''`),
    check("study_sessions_topic_id_not_blank", sql`btrim(${table.topicId}) <> ''`),
    check(
      "study_sessions_topic_name_not_blank",
      sql`btrim(${table.topicName}) <> ''`,
    ),
    check(
      "study_sessions_category_name_not_blank",
      sql`btrim(${table.categoryName}) <> ''`,
    ),
    check("study_sessions_hours_positive", sql`${table.hoursStudied} > 0`),
    check(
      "study_sessions_difficulty_valid",
      sql`${table.difficultyRating} between 1 and 5`,
    ),
    index("study_sessions_user_date_idx").on(
      table.userId,
      table.studyDate.desc(),
    ),
  ],
);

export const roadmapProgress = pgTable(
  "roadmap_progress",
  {
    userId: uuid("user_id").notNull(),
    topicId: text("topic_id").notNull(),
    mastery: text("mastery").notNull(),
    lastStudied: date("last_studied"),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.topicId] }),
    check("roadmap_progress_topic_id_not_blank", sql`btrim(${table.topicId}) <> ''`),
    check(
      "roadmap_progress_mastery_valid",
      sql`${table.mastery} in ('not_started', 'learning', 'practiced', 'mastered')`,
    ),
    index("roadmap_progress_user_mastery_idx").on(table.userId, table.mastery),
  ],
);

export const portfolioProjects = pgTable(
  "portfolio_projects",
  {
    userId: uuid("user_id").notNull(),
    id: text("id").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    status: text("status").notNull(),
    technologies: text("technologies").array().notNull().default([]),
    githubUrl: text("github_url"),
    demoUrl: text("demo_url"),
    highlights: text("highlights").array().notNull().default([]),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.id] }),
    check("portfolio_projects_id_not_blank", sql`btrim(${table.id}) <> ''`),
    check("portfolio_projects_title_not_blank", sql`btrim(${table.title}) <> ''`),
    check(
      "portfolio_projects_status_valid",
      sql`${table.status} in ('planned', 'in_progress', 'completed')`,
    ),
    check(
      "portfolio_projects_dates_valid",
      sql`${table.endDate} is null or ${table.endDate} >= ${table.startDate}`,
    ),
    index("portfolio_projects_user_status_idx").on(table.userId, table.status),
  ],
);

export type StudySessionRow = typeof studySessions.$inferSelect;
export type StudySessionInsert = typeof studySessions.$inferInsert;
export type RoadmapProgressRow = typeof roadmapProgress.$inferSelect;
export type RoadmapProgressInsert = typeof roadmapProgress.$inferInsert;
export type PortfolioProjectRow = typeof portfolioProjects.$inferSelect;
export type PortfolioProjectInsert = typeof portfolioProjects.$inferInsert;
