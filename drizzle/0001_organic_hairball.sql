CREATE TABLE "api_rate_limits" (
	"user_id" uuid NOT NULL,
	"bucket_key" text NOT NULL,
	"window_start" timestamp with time zone NOT NULL,
	"request_count" smallint DEFAULT 1 NOT NULL,
	CONSTRAINT "api_rate_limits_user_id_bucket_key_window_start_pk" PRIMARY KEY("user_id","bucket_key","window_start"),
	CONSTRAINT "api_rate_limits_bucket_key_not_blank" CHECK (btrim("api_rate_limits"."bucket_key") <> ''),
	CONSTRAINT "api_rate_limits_request_count_positive" CHECK ("api_rate_limits"."request_count" > 0)
);
--> statement-breakpoint
CREATE INDEX "api_rate_limits_window_start_idx" ON "api_rate_limits" USING btree ("window_start");