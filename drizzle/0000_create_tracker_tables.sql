CREATE TABLE "portfolio_projects" (
	"user_id" uuid NOT NULL,
	"id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" text NOT NULL,
	"technologies" text[] DEFAULT '{}' NOT NULL,
	"github_url" text,
	"demo_url" text,
	"highlights" text[] DEFAULT '{}' NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	CONSTRAINT "portfolio_projects_user_id_id_pk" PRIMARY KEY("user_id","id"),
	CONSTRAINT "portfolio_projects_id_not_blank" CHECK (btrim("portfolio_projects"."id") <> ''),
	CONSTRAINT "portfolio_projects_title_not_blank" CHECK (btrim("portfolio_projects"."title") <> ''),
	CONSTRAINT "portfolio_projects_status_valid" CHECK ("portfolio_projects"."status" in ('planned', 'in_progress', 'completed')),
	CONSTRAINT "portfolio_projects_dates_valid" CHECK ("portfolio_projects"."end_date" is null or "portfolio_projects"."end_date" >= "portfolio_projects"."start_date")
);
--> statement-breakpoint
CREATE TABLE "roadmap_progress" (
	"user_id" uuid NOT NULL,
	"topic_id" text NOT NULL,
	"mastery" text NOT NULL,
	"last_studied" date,
	CONSTRAINT "roadmap_progress_user_id_topic_id_pk" PRIMARY KEY("user_id","topic_id"),
	CONSTRAINT "roadmap_progress_topic_id_not_blank" CHECK (btrim("roadmap_progress"."topic_id") <> ''),
	CONSTRAINT "roadmap_progress_mastery_valid" CHECK ("roadmap_progress"."mastery" in ('not_started', 'learning', 'practiced', 'mastered'))
);
--> statement-breakpoint
CREATE TABLE "study_sessions" (
	"user_id" uuid NOT NULL,
	"id" text NOT NULL,
	"topic_id" text NOT NULL,
	"topic_name" text NOT NULL,
	"category_name" text NOT NULL,
	"study_date" date NOT NULL,
	"hours_studied" numeric NOT NULL,
	"difficulty_rating" smallint NOT NULL,
	"notes" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "study_sessions_user_id_id_pk" PRIMARY KEY("user_id","id"),
	CONSTRAINT "study_sessions_id_not_blank" CHECK (btrim("study_sessions"."id") <> ''),
	CONSTRAINT "study_sessions_topic_id_not_blank" CHECK (btrim("study_sessions"."topic_id") <> ''),
	CONSTRAINT "study_sessions_topic_name_not_blank" CHECK (btrim("study_sessions"."topic_name") <> ''),
	CONSTRAINT "study_sessions_category_name_not_blank" CHECK (btrim("study_sessions"."category_name") <> ''),
	CONSTRAINT "study_sessions_hours_positive" CHECK ("study_sessions"."hours_studied" > 0),
	CONSTRAINT "study_sessions_difficulty_valid" CHECK ("study_sessions"."difficulty_rating" between 1 and 5)
);
--> statement-breakpoint
CREATE INDEX "portfolio_projects_user_status_idx" ON "portfolio_projects" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "roadmap_progress_user_mastery_idx" ON "roadmap_progress" USING btree ("user_id","mastery");--> statement-breakpoint
CREATE INDEX "study_sessions_user_date_idx" ON "study_sessions" USING btree ("user_id","study_date" DESC NULLS LAST);