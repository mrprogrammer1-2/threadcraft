ALTER TABLE "product_types" ADD COLUMN "customization_type" text DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_types" ADD COLUMN "template_config" jsonb DEFAULT 'null'::jsonb;