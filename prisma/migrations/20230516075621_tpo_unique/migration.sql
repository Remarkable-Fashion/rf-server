/*
  Warnings:

  - A unique constraint covering the columns `[season]` on the table `seasons` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[style]` on the table `styles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tpo]` on the table `tpos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `seasons_season_key` ON `seasons`(`season`);

-- CreateIndex
CREATE UNIQUE INDEX `styles_style_key` ON `styles`(`style`);

-- CreateIndex
CREATE UNIQUE INDEX `tpos_tpo_key` ON `tpos`(`tpo`);
