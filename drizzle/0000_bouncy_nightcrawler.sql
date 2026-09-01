CREATE TABLE "app_meta" (
	"key" varchar(80) PRIMARY KEY NOT NULL,
	"value" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" varchar(40) NOT NULL,
	"full_name" varchar(160) NOT NULL,
	"email" varchar(160) NOT NULL,
	"phone" varchar(60) DEFAULT '' NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"city" varchar(120) DEFAULT '' NOT NULL,
	"postal_code" varchar(40) DEFAULT '' NOT NULL,
	"country" varchar(80) DEFAULT '' NOT NULL,
	"shipping_method" varchar(60) DEFAULT 'standard' NOT NULL,
	"payment_method" varchar(40) DEFAULT 'card' NOT NULL,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"subtotal" integer DEFAULT 0 NOT NULL,
	"shipping" integer DEFAULT 0 NOT NULL,
	"tax" integer DEFAULT 0 NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"total" integer DEFAULT 0 NOT NULL,
	"status" varchar(40) DEFAULT 'Новый' NOT NULL,
	"tracking_number" varchar(60) DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(160) NOT NULL,
	"title" varchar(220) NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"category" varchar(60) NOT NULL,
	"author" varchar(120) NOT NULL,
	"image" text NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"read_minutes" integer DEFAULT 4 NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(160) NOT NULL,
	"name" varchar(200) NOT NULL,
	"brand" varchar(80) NOT NULL,
	"category" varchar(40) NOT NULL,
	"gender" varchar(20) NOT NULL,
	"short_description" text NOT NULL,
	"description" text NOT NULL,
	"material" text DEFAULT '' NOT NULL,
	"care" text DEFAULT '' NOT NULL,
	"price" integer NOT NULL,
	"old_price" integer,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"colors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sizes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"rating" integer DEFAULT 45 NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"is_bestseller" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_slug" varchar(160) NOT NULL,
	"product_name" varchar(200) DEFAULT '' NOT NULL,
	"author" varchar(120) NOT NULL,
	"email" varchar(160) DEFAULT '' NOT NULL,
	"question" text NOT NULL,
	"answer" text DEFAULT '' NOT NULL,
	"status" varchar(20) DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"answered_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_slug" varchar(160) NOT NULL,
	"author" varchar(120) NOT NULL,
	"rating" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(200) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
