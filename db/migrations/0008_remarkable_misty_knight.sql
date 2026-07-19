ALTER TABLE "product_types" ALTER COLUMN "sizes" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "product_types" ALTER COLUMN "image_placements" SET DEFAULT '[]'::jsonb;