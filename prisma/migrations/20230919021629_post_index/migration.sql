-- CreateIndex
CREATE INDEX `posts_created_at_idx` ON `posts`(`created_at`);

-- CreateIndex
CREATE INDEX `posts_like_count_created_at_idx` ON `posts`(`like_count`, `created_at`);
