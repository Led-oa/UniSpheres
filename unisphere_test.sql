-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 15 sep. 2025 à 13:05
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `unisphere_test`
--

-- --------------------------------------------------------

--
-- Structure de la table `annonce`
--

CREATE TABLE `annonce` (
  `id_annonce` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `posted_by` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `classe`
--

CREATE TABLE `classe` (
  `id_class` int(10) UNSIGNED NOT NULL,
  `name` varchar(20) NOT NULL,
  `filiere_id` int(10) UNSIGNED NOT NULL,
  `parcours_id` int(10) UNSIGNED NOT NULL,
  `year_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `conversation`
--

CREATE TABLE `conversation` (
  `id_conversation` int(10) UNSIGNED NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  `type` enum('private','group') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `conversation_member`
--

CREATE TABLE `conversation_member` (
  `id_convo_member` int(10) UNSIGNED NOT NULL,
  `conversation_id` int(10) UNSIGNED NOT NULL,
  `member_id` int(10) UNSIGNED NOT NULL,
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `left_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `course`
--

CREATE TABLE `course` (
  `id_course` int(10) UNSIGNED NOT NULL,
  `title` varchar(50) NOT NULL,
  `content` text DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `teach_by` int(10) UNSIGNED NOT NULL,
  `class_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `file`
--

CREATE TABLE `file` (
  `id_file` int(10) UNSIGNED NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `annonce_id` int(10) UNSIGNED DEFAULT NULL,
  `course_id` int(10) UNSIGNED DEFAULT NULL,
  `message_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `filiere`
--

CREATE TABLE `filiere` (
  `id_filiere` int(10) UNSIGNED NOT NULL,
  `name` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `message`
--

CREATE TABLE `message` (
  `id_message` int(10) UNSIGNED NOT NULL,
  `conversation_id` int(10) UNSIGNED NOT NULL,
  `sender_id` int(10) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `note`
--

CREATE TABLE `note` (
  `id_note` int(10) UNSIGNED NOT NULL,
  `course_id` int(10) UNSIGNED NOT NULL,
  `student_id` int(10) UNSIGNED NOT NULL,
  `note_ds` decimal(4,2) DEFAULT NULL,
  `note_examen` decimal(4,2) DEFAULT NULL,
  `note_final` decimal(4,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `parcours`
--

CREATE TABLE `parcours` (
  `id_parcours` int(10) UNSIGNED NOT NULL,
  `name` varchar(75) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id_user` int(10) UNSIGNED NOT NULL,
  `class_id` int(10) UNSIGNED DEFAULT NULL,
  `matricule` varchar(50) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `lastname` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('administrator','student','teacher') NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `year`
--

CREATE TABLE `year` (
  `id_year` int(10) UNSIGNED NOT NULL,
  `year_value` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `annonce`
--
ALTER TABLE `annonce`
  ADD PRIMARY KEY (`id_annonce`),
  ADD KEY `annonce_posted_by_foreign` (`posted_by`);

--
-- Index pour la table `classe`
--
ALTER TABLE `classe`
  ADD PRIMARY KEY (`id_class`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `classe_filiere_id_foreign` (`filiere_id`),
  ADD KEY `classe_parcours_id_foreign` (`parcours_id`),
  ADD KEY `classe_year_id_foreign` (`year_id`);

--
-- Index pour la table `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`id_conversation`);

--
-- Index pour la table `conversation_member`
--
ALTER TABLE `conversation_member`
  ADD PRIMARY KEY (`id_convo_member`),
  ADD KEY `conversation_member_conversation_id_foreign` (`conversation_id`),
  ADD KEY `conversation_member_member_id_foreign` (`member_id`);

--
-- Index pour la table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id_course`),
  ADD KEY `course_teach_by_foreign` (`teach_by`),
  ADD KEY `course_class_id_foreign` (`class_id`);

--
-- Index pour la table `file`
--
ALTER TABLE `file`
  ADD PRIMARY KEY (`id_file`),
  ADD KEY `fk_file_annonce` (`annonce_id`),
  ADD KEY `fk_file_course` (`course_id`),
  ADD KEY `fk_file_message` (`message_id`);

--
-- Index pour la table `filiere`
--
ALTER TABLE `filiere`
  ADD PRIMARY KEY (`id_filiere`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id_message`),
  ADD KEY `message_conversation_id_foreign` (`conversation_id`),
  ADD KEY `message_sender_id_foreign` (`sender_id`);

--
-- Index pour la table `note`
--
ALTER TABLE `note`
  ADD PRIMARY KEY (`id_note`),
  ADD KEY `fk_note_course` (`course_id`),
  ADD KEY `fk_note_student` (`student_id`);

--
-- Index pour la table `parcours`
--
ALTER TABLE `parcours`
  ADD PRIMARY KEY (`id_parcours`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `user_email_unique` (`email`),
  ADD KEY `user_class_id_foreign` (`class_id`);

--
-- Index pour la table `year`
--
ALTER TABLE `year`
  ADD PRIMARY KEY (`id_year`),
  ADD UNIQUE KEY `year_value` (`year_value`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `annonce`
--
ALTER TABLE `annonce`
  MODIFY `id_annonce` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `classe`
--
ALTER TABLE `classe`
  MODIFY `id_class` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `conversation`
--
ALTER TABLE `conversation`
  MODIFY `id_conversation` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `conversation_member`
--
ALTER TABLE `conversation_member`
  MODIFY `id_convo_member` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `course`
--
ALTER TABLE `course`
  MODIFY `id_course` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `file`
--
ALTER TABLE `file`
  MODIFY `id_file` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `filiere`
--
ALTER TABLE `filiere`
  MODIFY `id_filiere` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `message`
--
ALTER TABLE `message`
  MODIFY `id_message` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `note`
--
ALTER TABLE `note`
  MODIFY `id_note` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `parcours`
--
ALTER TABLE `parcours`
  MODIFY `id_parcours` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `year`
--
ALTER TABLE `year`
  MODIFY `id_year` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `annonce`
--
ALTER TABLE `annonce`
  ADD CONSTRAINT `annonce_posted_by_foreign` FOREIGN KEY (`posted_by`) REFERENCES `user` (`id_user`);

--
-- Contraintes pour la table `classe`
--
ALTER TABLE `classe`
  ADD CONSTRAINT `classe_filiere_id_foreign` FOREIGN KEY (`filiere_id`) REFERENCES `filiere` (`id_filiere`),
  ADD CONSTRAINT `classe_parcours_id_foreign` FOREIGN KEY (`parcours_id`) REFERENCES `parcours` (`id_parcours`),
  ADD CONSTRAINT `classe_year_id_foreign` FOREIGN KEY (`year_id`) REFERENCES `year` (`id_year`);

--
-- Contraintes pour la table `conversation_member`
--
ALTER TABLE `conversation_member`
  ADD CONSTRAINT `conversation_member_conversation_id_foreign` FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id_conversation`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversation_member_member_id_foreign` FOREIGN KEY (`member_id`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

--
-- Contraintes pour la table `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `course_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `classe` (`id_class`),
  ADD CONSTRAINT `course_teach_by_foreign` FOREIGN KEY (`teach_by`) REFERENCES `user` (`id_user`);

--
-- Contraintes pour la table `file`
--
ALTER TABLE `file`
  ADD CONSTRAINT `fk_file_annonce` FOREIGN KEY (`annonce_id`) REFERENCES `annonce` (`id_annonce`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_file_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id_course`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_file_message` FOREIGN KEY (`message_id`) REFERENCES `message` (`id_message`) ON DELETE CASCADE;

--
-- Contraintes pour la table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `message_conversation_id_foreign` FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id_conversation`) ON DELETE CASCADE,
  ADD CONSTRAINT `message_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

--
-- Contraintes pour la table `note`
--
ALTER TABLE `note`
  ADD CONSTRAINT `fk_note_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id_course`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_note_student` FOREIGN KEY (`student_id`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `classe` (`id_class`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
