-- 외래 키 제약 조건을 삭제
ALTER TABLE `socials` DROP FOREIGN KEY `socials_user_id_fkey`;

-- UNIQUE 인덱스를 삭제
ALTER TABLE `socials` DROP INDEX `socials_user_id_key`;

-- 외래 키 제약 조건을 다시 추가
ALTER TABLE `socials` ADD CONSTRAINT `socials_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
