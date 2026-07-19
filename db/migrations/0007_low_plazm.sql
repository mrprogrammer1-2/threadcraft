ALTER TABLE "products" ADD COLUMN "studio_mode" text DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_types" DROP COLUMN "customization_type";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "is_customizable";