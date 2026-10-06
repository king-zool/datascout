CREATE TABLE `catalogue_imports` (
	`id` text PRIMARY KEY NOT NULL,
	`applied_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `plans` ADD `source_url` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `plans` ADD `checked_at` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `plans` ADD `tier` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `plans` ADD `label` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `plans` ADD `notes` text DEFAULT '' NOT NULL;