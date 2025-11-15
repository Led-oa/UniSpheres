-- Base de données : `unisphere`
SET
    SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

SET
    SQL_MODE = 'STRICT_ALL_TABLES';

START TRANSACTION;

SET
    time_zone = "+00:00";

SET
    FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `unisphere` DEFAULT CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_general_ci;

USE `unisphere`;

-- --------------------------------------------------------
-- TABLE `conversation`
-- -------------------------------------------------------- 
CREATE TABLE
    `conversation` (
        `id_conversation` int (10) UNSIGNED NOT NULL AUTO_INCREMENT,
        `title` varchar(50) DEFAULT NULL,
        `type` enum ('private', 'group') NOT NULL,
        `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
        `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id_conversation`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
-- TABLE `year`
-- -------------------------------------------------------- 
CREATE TABLE
    `year` (
        `id_year` int (10) UNSIGNED NOT NULL AUTO_INCREMENT,
        `title` varchar(20) NOT NULL,
        `year_value` int (11) NOT NULL,
        `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
        `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id_year`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
-- TABLE `filiere`
-- -------------------------------------------------------- 
CREATE TABLE
    `filiere` (
        `id_filiere` int (10) UNSIGNED NOT NULL AUTO_INCREMENT,
        `name` varchar(20) NOT NULL,
        `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
        `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id_filiere`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
-- TABLE `parcours`
-- -------------------------------------------------------- 
CREATE TABLE
    `parcours` (
        `id_parcours` int (10) UNSIGNED NOT NULL AUTO_INCREMENT,
        `name` varchar(20) NOT NULL,
        `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
        `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id_parcours`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
-- TABLE `classe`
-- -------------------------------------------------------- 
CREATE TABLE
    `classe` (
        `id_class` int (10) UNSIGNED NOT NULL AUTO_INCREMENT,
        `name` varchar(20) NOT NULL,
        `filiere_id` int (10) UNSIGNED NOT NULL,
        `parcours_id` int (10) UNSIGNED NOT NULL,
        `year_id` int (10) UNSIGNED NOT NULL,
        `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
        `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id_class`),
        KEY `classe_filiere_id_foreign` (`filiere_id`),
        KEY `classe_parcours_id_foreign` (`parcours_id`),
        KEY `classe_year_id_foreign` (`year_id`),
        CONSTRAINT `classe_filiere_id_foreign` FOREIGN KEY (`filiere_id`) REFERENCES `filiere` (`id_filiere`),
        CONSTRAINT `classe_parcours_id_foreign` FOREIGN KEY (`parcours_id`) REFERENCES `parcours` (`id_parcours`),
        CONSTRAINT `classe_year_id_foreign` FOREIGN KEY (`year_id`) REFERENCES `year` (`id_year`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
-- TABLE `user`
-- -------------------------------------------------------- 
CREATE TABLE
    `user` (
        `id_user` int (10) UNSIGNED NOT NULL AUTO_INCREMENT,
        `class_id` int (10) UNSIGNED DEFAULT NULL,
        `matricule` varchar(50) DEFAULT NULL,
        `name` varchar(150) NOT NULL,
        `lastname` varchar(150) NOT NULL,
        `email` varchar(150) NOT NULL,
        `profile_pic` varchar(255) DEFAULT NULL,
        `password_hash` varchar(255) NOT NULL,
        `role` enum ('admin', 'student', 'teacher') NOT NULL,
        `is_active` BOOLEAN NOT NULL DEFAULT 0,
        `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
        `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id_user`),
        UNIQUE KEY `user_email_unique` (`email`),
        KEY `user_class_id_foreign` (`class_id`),
        CONSTRAINT `user_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `classe` (`id_class`) ON DELETE SET NULL
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
-- TABLE `conversation_member`
-- -------------------------------------------------------- 
CREATE TABLE
    `conversation_member` (
        `id_convo_member` int (10) UNSIGNED NOT NULL AUTO_INCREMENT,
        `conversation_id` int (10) UNSIGNED NOT NULL,
        `member_id` int (10) UNSIGNED NOT NULL,
        `joined_at` timestamp NOT NULL DEFAULT current_timestamp(),
        `left_at` timestamp NULL DEFAULT NULL,
        `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
        `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id_convo_member`),
        KEY `conversation_member_conversation_id_foreign` (`conversation_id`),
        KEY `conversation_member_member_id_foreign` (`member_id`),
        CONSTRAINT `conversation_member_conversation_id_foreign` FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id_conversation`) ON DELETE CASCADE,
        CONSTRAINT `conversation_member_member_id_foreign` FOREIGN KEY (`member_id`) REFERENCES `user` (`id_user`) ON DELETE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
-- TABLE `course`
-- -------------------------------------------------------- 
CREATE TABLE
    `course` (
        `id_course` int (10) UNSIGNED NOT NULL AUTO_INCREMENT,
        `title` varchar(50) NOT NULL,
        `content` text DEFAULT NULL,
        `duration` int (11) DEFAULT NULL,
        `teach_by` int (10) UNSIGNED NOT NULL,
        `class_id` int (10) UNSIGNED NOT NULL,
        `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
        `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id_course`),
        KEY `course_teach_by_foreign` (`teach_by`),
        KEY `course_class_id_foreign` (`class_id`),
        CONSTRAINT `course_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `classe` (`id_class`),
        CONSTRAINT `course_teach_by_foreign` FOREIGN KEY (`teach_by`) REFERENCES `user` (`id_user`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
-- TABLE `message`
-- -------------------------------------------------------- 
CREATE TABLE
    `message` (
        `id_message` int (10) UNSIGNED NOT NULL AUTO_INCREMENT,
        `conversation_id` int (10) UNSIGNED NOT NULL,
        `sender_id` int (10) UNSIGNED NOT NULL,
        `content` text NOT NULL,
        `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
        `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id_message`),
        KEY `message_conversation_id_foreign` (`conversation_id`),
        KEY `message_sender_id_foreign` (`sender_id`),
        CONSTRAINT `message_conversation_id_foreign` FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id_conversation`) ON DELETE CASCADE,
        CONSTRAINT `message_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id_user`) ON DELETE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
-- TABLE `annonce`
-- -------------------------------------------------------- 
CREATE TABLE
    `annonce` (
        `id_annonce` int (10) UNSIGNED NOT NULL AUTO_INCREMENT,
        `title` varchar(255) NOT NULL,
        `content` text NOT NULL,
        `posted_by` int (10) UNSIGNED NOT NULL,
        `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
        `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id_annonce`),
        KEY `annonce_posted_by_foreign` (`posted_by`),
        CONSTRAINT `annonce_posted_by_foreign` FOREIGN KEY (`posted_by`) REFERENCES `user` (`id_user`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
-- TABLE `file`
-- -------------------------------------------------------- 
CREATE TABLE
    `file` (
        `id_file` int (10) UNSIGNED NOT NULL AUTO_INCREMENT,
        `file_name` varchar(255) NOT NULL,
        `file_path` varchar(500) NOT NULL,
        `annonce_id` int (10) UNSIGNED NULL,
        `course_id` int (10) UNSIGNED NULL,
        `message_id` int (10) UNSIGNED NULL,
        `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
        `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id_file`),
        KEY `fk_file_annonce` (`annonce_id`),
        KEY `fk_file_course` (`course_id`),
        KEY `fk_file_message` (`message_id`),
        CONSTRAINT `fk_file_annonce` FOREIGN KEY (`annonce_id`) REFERENCES `annonce` (`id_annonce`) ON DELETE CASCADE,
        CONSTRAINT `fk_file_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id_course`) ON DELETE CASCADE,
        CONSTRAINT `fk_file_message` FOREIGN KEY (`message_id`) REFERENCES `message` (`id_message`) ON DELETE CASCADE,
        CONSTRAINT `chk_single_owner` CHECK (
            (
                annonce_id IS NOT NULL
                AND course_id IS NULL
                AND message_id IS NULL
            )
            OR (
                annonce_id IS NULL
                AND course_id IS NOT NULL
                AND message_id IS NULL
            )
            OR (
                annonce_id IS NULL
                AND course_id IS NULL
                AND message_id IS NOT NULL
            )
        )
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

SET
    FOREIGN_KEY_CHECKS = 1;

COMMIT;