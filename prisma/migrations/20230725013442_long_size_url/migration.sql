-- AlterTable
ALTER TABLE `clothes` MODIFY `image_url` VARCHAR(500) NULL,
    MODIFY `site_url` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `images` MODIFY `url` VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE `tmp_images` MODIFY `url` VARCHAR(500) NOT NULL;
