CREATE TABLE `advertisements` (
	`slot` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`image_key` text NOT NULL,
	`active` integer DEFAULT 0 NOT NULL
);
