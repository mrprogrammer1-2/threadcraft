ALTER TABLE "product_types"
  ADD COLUMN "has_sizes" boolean DEFAULT false NOT NULL,
  ADD COLUMN "sizes" jsonb DEFAULT '[]'::jsonb NOT NULL,
  ADD COLUMN "has_thread_color" boolean DEFAULT false NOT NULL,
  ADD COLUMN "image_placements" jsonb DEFAULT '[]'::jsonb NOT NULL;
