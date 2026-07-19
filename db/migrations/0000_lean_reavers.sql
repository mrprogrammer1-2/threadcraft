CREATE TABLE "users_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kinde_id" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text,
	"avatar_url" text,
	"phone" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_table_kinde_id_unique" UNIQUE("kinde_id")
);
