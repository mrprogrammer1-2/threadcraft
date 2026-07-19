ALTER TABLE "product_types" ADD COLUMN "has_sizes" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "product_types" ADD COLUMN "sizes" jsonb DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_types" ADD COLUMN "has_thread_color" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "product_types" ADD COLUMN "image_placements" jsonb DEFAULT '[]' NOT NULL;