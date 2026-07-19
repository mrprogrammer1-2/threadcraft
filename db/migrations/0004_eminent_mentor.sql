CREATE TABLE "designs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"svg" text,
	"url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "designs_key_unique" UNIQUE("key")
);
