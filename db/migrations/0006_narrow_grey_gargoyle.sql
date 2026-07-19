ALTER TABLE "products" ADD COLUMN "template_config" jsonb DEFAULT 'null'::jsonb;--> statement-breakpoint
ALTER TABLE "product_types" DROP COLUMN "template_config";