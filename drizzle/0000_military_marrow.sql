CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`total` integer NOT NULL,
	`promo_code` text,
	`customer_json` text NOT NULL,
	`items_json` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `partner_applications` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`telegram` text,
	`location` text NOT NULL,
	`partnership_type` text NOT NULL,
	`company` text,
	`website` text,
	`monthly_volume` text,
	`comment` text,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `wheel_spins` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`contact_hash` text NOT NULL,
	`prize_label` text NOT NULL,
	`discount` integer DEFAULT 0 NOT NULL,
	`promo_code` text NOT NULL,
	`expires_at` integer NOT NULL,
	`used_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wheel_spins_request_id_unique` ON `wheel_spins` (`request_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `wheel_spins_promo_code_unique` ON `wheel_spins` (`promo_code`);