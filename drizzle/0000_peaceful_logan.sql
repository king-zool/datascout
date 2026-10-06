CREATE TABLE `plans` (
	`id` text PRIMARY KEY NOT NULL,
	`reseller` text NOT NULL,
	`network` text NOT NULL,
	`gb` real NOT NULL,
	`price` real NOT NULL,
	`days` integer NOT NULL,
	`type` text NOT NULL,
	`url` text NOT NULL,
	`updated` text NOT NULL
);
