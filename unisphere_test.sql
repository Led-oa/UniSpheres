-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 22 oct. 2025 à 15:58
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
  `target_class_id` int(10) UNSIGNED DEFAULT NULL,
  `target_filiere_id` int(10) UNSIGNED DEFAULT NULL,
  `target_year_id` int(10) UNSIGNED DEFAULT NULL,
  `type` enum('general','cours','evenement') NOT NULL DEFAULT 'general',
  `is_visible` tinyint(1) NOT NULL DEFAULT 1,
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `deadline` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `annonce`
--

INSERT INTO `annonce` (`id_annonce`, `title`, `content`, `posted_by`, `target_class_id`, `target_filiere_id`, `target_year_id`, `type`, `is_visible`, `priority`, `deadline`, `created_at`, `updated_at`) VALUES
(100, 'joel', 'testestqs it became false', 11, 2, 2, 2, 'general', 1, 'medium', '2026-12-28', '2025-09-19 19:39:37', '2025-10-16 05:42:03'),
(101, 'Examen', 'Examen la semaine prochaine', 11, 1, 1, 1, 'general', 1, 'low', '2025-09-23', '2025-09-22 17:48:02', '2025-10-16 05:42:08'),
(102, 'Test', 'testesetsdgese ', 11, 5, 6, 8, 'evenement', 1, 'medium', '2025-09-24', '2025-09-22 17:49:04', '2025-10-16 05:42:12'),
(103, 'Examen', 'Bonjour, ceci est une annonce pour l\'examen de la classe Info L1 B.', 11, 2, 1, 1, 'cours', 1, 'high', '2025-10-14', '2025-10-06 14:21:52', '2025-10-06 14:21:52'),
(104, 'Annonces avec image', 'Annonces avec images', 11, NULL, NULL, NULL, 'general', 1, 'medium', '2025-10-18', '2025-10-17 12:04:15', '2025-10-17 12:04:15'),
(105, 'Evenement ', 'Evenement importante', 11, NULL, NULL, 5, 'evenement', 1, 'low', '2025-10-22', '2025-10-21 05:30:18', '2025-10-21 05:30:18');

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

--
-- Déchargement des données de la table `classe`
--

INSERT INTO `classe` (`id_class`, `name`, `filiere_id`, `parcours_id`, `year_id`, `created_at`, `updated_at`) VALUES
(1, 'Info L2 A', 1, 6, 2, '2025-09-16 04:01:17', '2025-10-18 13:56:10'),
(2, 'Info L1 B', 1, 6, 1, '2025-09-16 04:01:17', '2025-09-16 04:01:17'),
(3, 'Info L3 C', 1, 1, 3, '2025-09-16 07:39:17', '2025-09-16 13:51:35'),
(4, 'Info DAI', 1, 2, 3, '2025-09-16 07:39:17', '2025-09-16 07:39:17'),
(5, 'Math L1 F', 2, 6, 1, '2025-09-16 13:51:58', '2025-09-16 13:51:58'),
(8, 'Nasa L1', 6, 6, 1, '2025-09-16 13:54:35', '2025-09-16 13:54:35'),
(9, 'ST L1', 4, 6, 1, '2025-10-06 14:24:09', '2025-10-06 14:24:09');

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

--
-- Déchargement des données de la table `conversation`
--

INSERT INTO `conversation` (`id_conversation`, `title`, `type`, `created_at`, `updated_at`) VALUES
(26, NULL, 'private', '2025-10-06 14:14:35', '2025-10-06 14:14:35'),
(27, NULL, 'private', '2025-10-14 10:42:21', '2025-10-14 10:42:21'),
(28, NULL, 'private', '2025-10-18 17:10:08', '2025-10-18 17:10:08'),
(29, NULL, 'private', '2025-10-18 18:04:59', '2025-10-18 18:04:59'),
(30, 'Adventure', 'group', '2025-10-18 18:08:02', '2025-10-18 18:08:02');

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

--
-- Déchargement des données de la table `conversation_member`
--

INSERT INTO `conversation_member` (`id_convo_member`, `conversation_id`, `member_id`, `joined_at`, `left_at`, `created_at`, `updated_at`) VALUES
(35, 26, 14, '2025-10-06 14:14:35', NULL, '2025-10-06 14:14:35', '2025-10-06 14:14:35'),
(36, 26, 12, '2025-10-06 14:14:35', NULL, '2025-10-06 14:14:35', '2025-10-06 14:14:35'),
(37, 27, 1, '2025-10-14 10:42:22', NULL, '2025-10-14 10:42:22', '2025-10-14 10:42:22'),
(38, 27, 9, '2025-10-14 10:42:22', NULL, '2025-10-14 10:42:22', '2025-10-14 10:42:22'),
(39, 28, 12, '2025-10-18 17:10:08', NULL, '2025-10-18 17:10:08', '2025-10-18 17:10:08'),
(40, 29, 14, '2025-10-18 18:04:59', NULL, '2025-10-18 18:04:59', '2025-10-18 18:04:59'),
(41, 29, 10, '2025-10-18 18:04:59', NULL, '2025-10-18 18:04:59', '2025-10-18 18:04:59'),
(42, 30, 14, '2025-10-18 18:08:02', NULL, '2025-10-18 18:08:02', '2025-10-18 18:08:02'),
(43, 30, 12, '2025-10-18 18:08:02', NULL, '2025-10-18 18:08:02', '2025-10-18 18:08:02'),
(44, 30, 13, '2025-10-18 18:08:02', NULL, '2025-10-18 18:08:02', '2025-10-18 18:08:02');

-- --------------------------------------------------------

--
-- Structure de la table `course`
--

CREATE TABLE `course` (
  `id_course` int(10) UNSIGNED NOT NULL,
  `title` varchar(50) NOT NULL,
  `content` text DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `credits` int(11) NOT NULL,
  `teach_by` int(10) UNSIGNED NOT NULL,
  `class_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `course`
--

INSERT INTO `course` (`id_course`, `title`, `content`, `duration`, `credits`, `teach_by`, `class_id`, `created_at`, `updated_at`) VALUES
(1, 'Thermo dynamique', 'Cours thermo dynamique', 45, 8, 4, 4, '2025-09-18 05:11:49', '2025-10-14 11:08:29'),
(3, 'Introduction à la Programmation', 'Bases de la programmation et algorithmes', 60, 10, 6, 4, '2025-09-18 06:08:05', '2025-10-14 11:08:35'),
(4, 'Algèbre Linéaire', 'Vecteurs, matrices et applications', 90, 2, 4, 1, '2025-09-18 06:08:05', '2025-10-18 06:20:36'),
(5, 'Physique Mécanique', 'Lois de Newton et mouvement', 75, 5, 6, 3, '2025-09-18 06:08:05', '2025-10-14 11:08:50'),
(7, 'Électromagnétisme', 'Champs électriques et magnétiques', 90, 5, 8, 5, '2025-09-18 06:08:05', '2025-10-14 11:08:54'),
(8, 'Biologie Cellulaire', 'Structure et fonction des cellules', 60, 5, 9, 8, '2025-09-18 06:08:05', '2025-10-14 11:08:56'),
(9, 'Calcul Différentiel', 'Dérivées et applications', 75, 6, 1, 1, '2025-09-18 06:08:05', '2025-10-14 11:08:59'),
(10, 'Statistiques Appliquées', 'Analyses de données et probabilités', 90, 8, 4, 2, '2025-09-18 06:08:05', '2025-10-14 11:09:03'),
(11, 'Optique Géométrique', 'Lumière et systèmes optiques', 60, 2, 6, 3, '2025-09-18 06:08:05', '2025-10-14 11:09:07'),
(12, 'Biochimie', 'Processus chimiques dans les organismes', 75, 3, 7, 4, '2025-09-18 06:08:05', '2025-10-14 11:09:12'),
(13, 'Programmation Web', 'HTML, CSS et JavaScript', 90, 5, 8, 5, '2025-09-18 06:08:05', '2025-10-14 11:09:16'),
(14, 'Génétique', 'Hérédité et ADN', 60, 5, 9, 8, '2025-09-18 06:08:05', '2025-10-14 11:09:19'),
(15, 'Algorithmes Avancés', 'Structures de données complexes', 90, 8, 1, 1, '2025-09-18 06:08:05', '2025-10-14 11:09:22'),
(16, 'Géométrie Analytique', 'Coordonnées et transformations', 75, 6, 4, 2, '2025-09-18 06:08:05', '2025-10-14 11:09:25'),
(17, 'Thermodynamique Avancée', 'Cycles thermodynamiques', 90, 5, 6, 3, '2025-09-18 06:08:05', '2025-10-14 11:09:29'),
(18, 'Chimie Inorganique', 'Éléments et composés minéraux', 60, 4, 7, 4, '2025-09-18 06:08:05', '2025-10-14 11:09:32'),
(19, 'Réseaux Informatiques', 'Protocoles et architecture réseau', 75, 2, 8, 5, '2025-09-18 06:08:05', '2025-10-14 11:10:04'),
(20, 'Écologie', 'Écosystèmes et biodiversité', 60, 4, 9, 8, '2025-09-18 06:08:05', '2025-10-14 11:10:02'),
(21, 'Intelligence Artificielle', 'Machine Learning et réseaux neuronaux', 90, 4, 1, 1, '2025-09-18 06:08:05', '2025-10-14 11:09:58'),
(22, 'Analyse Complexe', 'Fonctions complexes et intégration', 75, 4, 4, 2, '2025-09-18 06:08:05', '2025-10-14 11:09:55'),
(23, 'Physique Quantique', 'Mécanique quantique et particules', 90, 4, 6, 3, '2025-09-18 06:08:05', '2025-10-14 11:09:52'),
(24, 'Pharmacologie', 'Médicaments et mécanismes d action', 60, 4, 7, 4, '2025-09-18 06:08:05', '2025-10-14 11:09:50'),
(25, 'Sécurité Informatique', 'Cryptographie et protection des données', 75, 4, 8, 5, '2025-09-18 06:08:05', '2025-10-14 11:09:47'),
(26, 'Anatomie Humaine', 'Structure du corps humain', 90, 4, 9, 8, '2025-09-18 06:08:05', '2025-10-14 11:09:44'),
(27, 'Base de Données', 'SQL et modélisation des données', 60, 4, 1, 1, '2025-09-18 06:08:05', '2025-10-14 11:09:40'),
(28, 'UML 2', 'Base de la conception de projet', 40, 0, 9, 2, '2025-09-18 06:37:41', '2025-09-18 06:37:41'),
(29, 'Physique Chimie', 'Cours sur la physique chimie', 95, 0, 8, 8, '2025-10-06 14:23:23', '2025-10-06 14:23:23');

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

--
-- Déchargement des données de la table `file`
--

INSERT INTO `file` (`id_file`, `file_name`, `file_path`, `annonce_id`, `course_id`, `message_id`, `created_at`, `updated_at`) VALUES
(21, 'Cours OGE partie I.pdf', 'D:/UniSpheres/backend/src/uploads/cours/1758189163317-612507585-cours_oge_partie_i.pdf', NULL, 13, NULL, '2025-09-18 09:52:43', '2025-09-18 09:52:43'),
(22, 'DROIT DE PROPRIETE INTELLECTUELLE.pdf', 'D:/UniSpheres/backend/src/uploads/cours/1758189950308-864242196-droit_de_propriete_intellectuelle.pdf', NULL, 13, NULL, '2025-09-18 10:05:50', '2025-09-18 10:05:50'),
(23, 'Codage arithemtique exemple.docx', 'D:/UniSpheres/backend/src/uploads/cours/1758191884416-503933098-codage_arithemtique_exemple.docx', NULL, 7, NULL, '2025-09-18 10:38:04', '2025-09-18 10:38:04'),
(24, 'LZ 77 Exemples.docx', 'D:/UniSpheres/backend/src/uploads/cours/1758207607304-787404547-lz_77_exemples.docx', NULL, 9, NULL, '2025-09-18 15:00:07', '2025-09-18 15:00:07'),
(25, 'Quantification par moyenne intervalle.docx', 'D:/UniSpheres/backend/src/uploads/cours/1758207675638-579954663-quantification_par_moyenne_intervalle.docx', NULL, 15, NULL, '2025-09-18 15:01:15', '2025-09-18 15:01:15'),
(26, 'Demande de stage.docx', 'D:/UniSpheres/backend/src/uploads/cours/1758562993480-962202125-demande_de_stage.docx', NULL, 7, NULL, '2025-09-22 17:43:13', '2025-09-22 17:43:13'),
(27, 'CV LEDOA GAÃL.pdf', 'D:/UniSpheres/backend/src/uploads/cours/1758563027605-90533581-cv_ledoa_gaa_l.pdf', NULL, 7, NULL, '2025-09-22 17:43:47', '2025-09-22 17:43:47'),
(28, 'LEDOA 5766 GL CV.pdf', 'D:\\UniSpheres\\backend\\src\\uploads\\annonces\\1758563282631-588025983-ledoa_5766_gl_cv.pdf', 101, NULL, NULL, '2025-09-22 17:48:02', '2025-09-22 17:48:02'),
(29, 'LEDOA 5766 GL CV.pdf', 'D:\\UniSpheres\\backend\\src\\uploads\\annonces\\1758563343992-805152096-ledoa_5766_gl_cv.pdf', 102, NULL, NULL, '2025-09-22 17:49:04', '2025-09-22 17:49:04'),
(32, 'LEDOA 5766 GL CV.pdf', 'D:/UniSpheres/backend/src/uploads/cours/1759760341207-505956364-ledoa_5766_gl_cv.pdf', NULL, 9, NULL, '2025-10-06 14:19:01', '2025-10-06 14:19:01'),
(33, 'Picture.jpg', 'D:\\UniSpheres\\backend\\src\\uploads\\annonces\\1759760512497-275410872-picture.jpg', 103, NULL, NULL, '2025-10-06 14:21:52', '2025-10-06 14:21:52'),
(34, 'Screenshot 2025-09-26 at 11-35-53 UniSphere.png', 'D:\\UniSpheres\\backend\\src\\uploads\\message\\1760593161346-475016639-screenshot_2025-09-26_at_11-35-53_unisphere.png', NULL, NULL, 84, '2025-10-16 05:39:21', '2025-10-16 05:39:21'),
(35, 'LEDOA 5766 GL CV.pdf', 'D:/UniSpheres/backend/src/uploads/cours/1760683571395-704058920-ledoa_5766_gl_cv.pdf', NULL, 15, NULL, '2025-10-17 06:46:11', '2025-10-17 06:46:11'),
(36, 'Capture d\'Ã©cran 2025-08-22 122205.png', 'D:\\UniSpheres\\backend\\src\\uploads\\annonces\\1760702655339-589056453-capture_d_a_cran_2025-08-22_122205.png', 104, NULL, NULL, '2025-10-17 12:04:15', '2025-10-17 12:04:15'),
(38, 'testing.jpg', 'D:\\UniSpheres\\backend\\src\\uploads\\message\\1760810913062-481102506-testing.jpg', NULL, NULL, 93, '2025-10-18 18:08:33', '2025-10-18 18:08:33');

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

--
-- Déchargement des données de la table `filiere`
--

INSERT INTO `filiere` (`id_filiere`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Informatique', '2025-09-16 03:58:26', '2025-09-16 03:58:26'),
(2, 'Mathématique', '2025-09-16 03:58:26', '2025-09-16 03:58:26'),
(3, 'Physiques', '2025-09-16 03:58:26', '2025-09-16 03:58:26'),
(4, 'Agronomie', '2025-09-16 03:58:26', '2025-09-16 03:58:26'),
(5, 'Economie', '2025-09-16 03:58:26', '2025-09-16 03:58:26'),
(6, 'Astronomie', '2025-09-16 13:07:37', '2025-09-16 13:07:37');

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

--
-- Déchargement des données de la table `message`
--

INSERT INTO `message` (`id_message`, `conversation_id`, `sender_id`, `content`, `created_at`, `updated_at`) VALUES
(75, 26, 14, 'Bonjour John', '2025-10-06 14:15:33', '2025-10-06 14:15:33'),
(76, 26, 12, 'Bonjour Anil', '2025-10-06 14:16:03', '2025-10-06 14:16:03'),
(78, 27, 1, 'hello there', '2025-10-16 05:36:51', '2025-10-16 05:36:51'),
(79, 27, 1, 'test', '2025-10-16 05:37:32', '2025-10-16 05:37:32'),
(80, 27, 1, 'hello', '2025-10-16 05:37:45', '2025-10-16 05:37:45'),
(81, 27, 9, 'hye', '2025-10-16 05:38:31', '2025-10-16 05:38:31'),
(82, 27, 9, 'hey', '2025-10-16 05:38:33', '2025-10-16 05:38:33'),
(83, 27, 1, '', '2025-10-16 05:38:58', '2025-10-16 05:38:58'),
(84, 27, 1, '', '2025-10-16 05:39:21', '2025-10-16 05:39:21'),
(85, 27, 1, 'f', '2025-10-16 05:39:49', '2025-10-16 05:39:49'),
(86, 26, 12, 'test', '2025-10-17 06:41:07', '2025-10-17 06:41:07'),
(87, 26, 12, 'test', '2025-10-18 17:48:43', '2025-10-18 17:48:43'),
(89, 26, 14, 'Voila', '2025-10-18 18:03:23', '2025-10-18 18:03:23'),
(90, 29, 14, 'Bonjour', '2025-10-18 18:05:03', '2025-10-18 18:05:03'),
(91, 30, 12, 'Hey', '2025-10-18 18:08:11', '2025-10-18 18:08:11'),
(92, 30, 14, 'Yo', '2025-10-18 18:08:15', '2025-10-18 18:08:15'),
(93, 30, 14, '', '2025-10-18 18:08:33', '2025-10-18 18:08:33'),
(94, 30, 12, 'Why my face', '2025-10-18 18:08:43', '2025-10-18 18:08:43'),
(95, 26, 12, 'So', '2025-10-18 18:08:52', '2025-10-18 18:08:52'),
(96, 26, 12, 'cette approche est moins pratique pour faire des recherches SQL complexes', '2025-10-22 11:58:32', '2025-10-22 11:58:32');

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

--
-- Déchargement des données de la table `note`
--

INSERT INTO `note` (`id_note`, `course_id`, `student_id`, `note_ds`, `note_examen`, `note_final`, `created_at`, `updated_at`) VALUES
(3, 9, 12, 15.00, 10.00, 14.00, '2025-09-19 04:57:33', '2025-10-06 14:19:40'),
(6, 21, 10, 13.00, 13.75, 11.25, '2025-09-19 09:07:38', '2025-09-19 09:08:33'),
(9, 21, 5, 15.00, 15.00, 16.00, '2025-09-19 09:19:17', '2025-09-19 09:19:17'),
(10, 9, 5, 14.00, 14.00, 14.00, '2025-09-19 09:21:13', '2025-09-19 09:21:13'),
(12, 9, 10, 12.00, 9.00, 7.00, '2025-09-19 09:24:45', '2025-09-19 09:24:45'),
(14, 9, 14, 15.00, 10.00, 10.00, '2025-10-06 14:19:59', '2025-10-06 14:19:59'),
(15, 15, 5, 15.00, 20.00, 15.00, '2025-10-17 06:49:04', '2025-10-17 06:49:04'),
(16, 15, 10, 12.00, 14.00, 10.00, '2025-10-17 06:49:23', '2025-10-17 06:49:23');

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

--
-- Déchargement des données de la table `parcours`
--

INSERT INTO `parcours` (`id_parcours`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Génie Logiciel', '2025-09-16 03:57:35', '2025-09-16 03:57:35'),
(2, 'Devéloppement d\'application informatique', '2025-09-16 03:57:35', '2025-09-16 03:57:35'),
(4, 'Génie Industriel', '2025-09-16 03:57:35', '2025-09-16 13:33:57'),
(5, 'Télécommunication', '2025-09-16 03:57:35', '2025-09-16 03:57:35'),
(6, 'Tronc Commun', '2025-09-16 03:59:01', '2025-09-16 03:59:01'),
(7, 'Test', '2025-09-16 13:07:28', '2025-09-16 13:07:28');

-- --------------------------------------------------------

--
-- Structure de la table `schedule`
--

CREATE TABLE `schedule` (
  `id_schedule` int(10) UNSIGNED NOT NULL,
  `teacher_id` int(10) UNSIGNED NOT NULL,
  `class_id` int(10) UNSIGNED NOT NULL,
  `course_id` int(10) UNSIGNED NOT NULL,
  `week_start` date NOT NULL,
  `monday_periods` set('P1','P2','P3','P4') DEFAULT NULL,
  `tuesday_periods` set('P1','P2','P3','P4') DEFAULT NULL,
  `wednesday_periods` set('P1','P2','P3','P4') DEFAULT NULL,
  `thursday_periods` set('P1','P2','P3','P4') DEFAULT NULL,
  `friday_periods` set('P1','P2','P3','P4') DEFAULT NULL,
  `saturday_periods` set('P1','P2','P3','P4') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `schedule`
--

INSERT INTO `schedule` (`id_schedule`, `teacher_id`, `class_id`, `course_id`, `week_start`, `monday_periods`, `tuesday_periods`, `wednesday_periods`, `thursday_periods`, `friday_periods`, `saturday_periods`, `created_at`, `updated_at`) VALUES
(1, 4, 1, 4, '2025-10-27', 'P1,P2', 'P3', 'P1,P4', NULL, 'P2,P3', NULL, '2025-10-21 09:31:01', '2025-10-21 09:31:01'),
(2, 1, 1, 9, '2025-10-27', 'P3,P4', NULL, 'P2', 'P1,P3', NULL, 'P1', '2025-10-21 09:31:14', '2025-10-21 09:31:14'),
(3, 1, 1, 21, '2025-10-27', NULL, 'P1,P2', 'P3,P4', 'P2', 'P1,P4', NULL, '2025-10-21 09:31:24', '2025-10-21 09:31:24');

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

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id_user`, `class_id`, `matricule`, `name`, `lastname`, `email`, `profile_pic`, `password_hash`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(1, NULL, '5766', 'Gaël', 'LEDOA', 'ledoagael@gmail.com', 'D:\\UniSpheres\\backend\\src\\uploads\\profile\\1761033028819-932053558-501d2c3d3146db3dd16d29851010dc1f.jpg', '$2b$10$Qo4Kzrw4ztZgFwJUlNjZFesh8hIXv/TGO.LvRpUwdQ2kfxd57L07y', 'teacher', 1, '2025-09-16 04:31:15', '2025-10-21 08:04:22'),
(4, NULL, '1111', 'gael', 'ledoa', 'ledoaz@gmail.com', NULL, '$2b$10$F0WSHCEh3O4Q2NIs3Sjz4uZUHYDjCKMe8eRb/EkqxrHtvLobFgGXq', 'teacher', 1, '2025-09-16 04:41:17', '2025-09-16 14:15:43'),
(5, 1, '7859', 'Mir', 'Vlad', 'vladmir@gmail.com', 'D:\\UniSpheres\\backend\\src\\uploads\\profile\\1757997908363-269828321-testing.jpg', '$2b$10$xsNBynE3DCYTi8uZGLCp8u8OT28CrWe3TOT3Tp6UxgsJyVSsEYeqi', 'student', 1, '2025-09-16 04:45:08', '2025-09-19 10:52:34'),
(6, NULL, '4857', 'Farah', 'Helen', 'helen@gmail.com', 'D:\\UniSpheres\\backend\\src\\uploads\\profile\\1757998099846-624676310-testing.jpg', '$2b$10$WCcORcA7VlZt9VsN1N/pRepX00QEuSB/0CDsII1BWGLMvf0VDGAkO', 'teacher', 1, '2025-09-16 04:48:20', '2025-09-16 14:15:42'),
(7, NULL, '7441', 'testone', 'testing', 'stone@gmail.com', 'D:\\UniSpheres\\backend\\src\\uploads\\profile\\1757998378161-417765155-testing.jpg', '$2b$10$6V4yLsdoliFxE5iX0VSxaOpnPs1eT9P/ke3sY6CCWe8Q.C1Y/IABK', 'teacher', 1, '2025-09-16 04:52:58', '2025-09-16 14:15:41'),
(8, NULL, '7856', 'Yuan Shi', 'Zhu', 'zhu@gmail.com', 'D:\\UniSpheres\\backend\\src\\uploads\\profile\\1758012934379-839691065-6f5c3436794af6b6fba799df4727300c.jpg', '$2b$10$aqDRXXtwdNMibqaBFZZLe.T8vilpKiTR0ut782LHP3vktSLivKQWC', 'teacher', 1, '2025-09-16 04:54:58', '2025-09-16 14:15:40'),
(9, NULL, '7412', 'Ling', 'Yin', 'yin@gmail.com', 'D:\\UniSpheres\\backend\\src\\uploads\\profile\\1757998548354-775041847-wallhaven-1q3lmg_1448x2048.png', '$2b$10$6.UCfjwr4y52JRzhQ9dvWeIo5NsYJrFQ8LrIVYwp8j6NXcOake4SS', 'teacher', 1, '2025-09-16 04:55:48', '2025-09-16 14:15:39'),
(10, 1, '7854', 'Marco', 'Jacob', 'jacob@gmail.com', 'D:\\UniSpheres\\backend\\src\\uploads\\profile\\1757998607971-99369205-wallhaven-w587zr_4786x4852.png', '$2b$10$Ml9LfKrWU6gfwqYQ0Wpu3.mRTxpYy4kBZxGVtDawy12p7FfXdJvoC', 'student', 1, '2025-09-16 04:56:48', '2025-09-16 14:15:34'),
(11, NULL, NULL, 'theFirstAdmin', 'admin', 'shifu@gmail.com', 'D:\\UniSpheres\\backend\\src\\uploads\\profile\\1760775399657-877007602-0cd77eaf696d6aecf81d7564381e3d24_0_.jpg', '$2b$10$EUnPfU3uYNfkfDxfx.AomO5kZExU2ecEieb/5LdK9xjPheOh.XR.y', 'administrator', 1, '2025-09-16 10:02:23', '2025-10-18 08:16:39'),
(12, 1, '48', 'Franca Lumian', 'jon', 'john@gmail.com', 'D:\\UniSpheres\\backend\\src\\uploads\\profile\\1760774364430-552770499-852f45fa6e37efb87ed3eab2f1f4c84f.jpg', '$2b$10$QuhGGITakW0/eBdLGh5CXeDnjN6j1TS8xk7XdrKug9LOWsym6MBaW', 'student', 1, '2025-09-16 17:20:40', '2025-10-18 07:59:24'),
(13, 5, '7855', 'Clenn', 'Cleavtess', 'clenn@gmail.com', 'D:\\UniSpheres\\backend\\src\\uploads\\profile\\1759655886486-835856090-4d6651f745218ff6de5a68a598939d12.jpg', '$2b$10$bsJLBNUnO86Dg1DGCaHtBeuk0i432fGpph/zSx05.RYPmU6gO1fT.', 'student', 1, '2025-10-05 09:18:06', '2025-10-20 07:27:58'),
(14, 1, '5805', 'Anil', 'TINA', 'anil@gmail.com', 'D:\\UniSpheres\\backend\\src\\uploads\\profile\\1759759227740-29754978-testing.jpg', '$2b$10$QuhGGITakW0/eBdLGh5CXeDnjN6j1TS8xk7XdrKug9LOWsym6MBaW', 'student', 1, '2025-10-06 14:00:28', '2025-10-18 18:02:47');

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
-- Déchargement des données de la table `year`
--

INSERT INTO `year` (`id_year`, `year_value`, `created_at`, `updated_at`) VALUES
(1, 'Licence 1', '2025-09-16 03:56:30', '2025-09-16 03:56:30'),
(2, 'Licence 2', '2025-09-16 03:56:30', '2025-09-16 03:56:30'),
(3, 'Licence 3', '2025-09-16 03:56:30', '2025-09-16 03:56:30'),
(4, 'Master 1', '2025-09-16 03:56:30', '2025-09-16 03:56:30'),
(5, 'Master 2', '2025-09-16 03:56:30', '2025-09-16 03:56:30'),
(6, 'Doctorat 1', '2025-09-16 13:05:00', '2025-09-16 13:05:00'),
(8, 'Doctorat 2', '2025-09-16 13:07:06', '2025-09-16 13:07:06');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `annonce`
--
ALTER TABLE `annonce`
  ADD PRIMARY KEY (`id_annonce`),
  ADD KEY `annonce_posted_by_foreign` (`posted_by`),
  ADD KEY `annonce_target_class_id_foreign` (`target_class_id`),
  ADD KEY `annonce_target_filiere_id_foreign` (`target_filiere_id`),
  ADD KEY `annonce_target_year_id_foreign` (`target_year_id`);

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
  ADD UNIQUE KEY `unique_course_student` (`course_id`,`student_id`),
  ADD KEY `fk_note_course` (`course_id`),
  ADD KEY `fk_note_student` (`student_id`);

--
-- Index pour la table `parcours`
--
ALTER TABLE `parcours`
  ADD PRIMARY KEY (`id_parcours`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `schedule`
--
ALTER TABLE `schedule`
  ADD PRIMARY KEY (`id_schedule`),
  ADD UNIQUE KEY `unique_schedule` (`teacher_id`,`class_id`,`course_id`,`week_start`),
  ADD KEY `schedule_teacher_id_foreign` (`teacher_id`),
  ADD KEY `schedule_class_id_foreign` (`class_id`),
  ADD KEY `schedule_course_id_foreign` (`course_id`);

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
  MODIFY `id_annonce` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT pour la table `classe`
--
ALTER TABLE `classe`
  MODIFY `id_class` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `conversation`
--
ALTER TABLE `conversation`
  MODIFY `id_conversation` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT pour la table `conversation_member`
--
ALTER TABLE `conversation_member`
  MODIFY `id_convo_member` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT pour la table `course`
--
ALTER TABLE `course`
  MODIFY `id_course` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT pour la table `file`
--
ALTER TABLE `file`
  MODIFY `id_file` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT pour la table `filiere`
--
ALTER TABLE `filiere`
  MODIFY `id_filiere` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `message`
--
ALTER TABLE `message`
  MODIFY `id_message` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT pour la table `note`
--
ALTER TABLE `note`
  MODIFY `id_note` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `parcours`
--
ALTER TABLE `parcours`
  MODIFY `id_parcours` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `schedule`
--
ALTER TABLE `schedule`
  MODIFY `id_schedule` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `year`
--
ALTER TABLE `year`
  MODIFY `id_year` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `annonce`
--
ALTER TABLE `annonce`
  ADD CONSTRAINT `annonce_posted_by_foreign` FOREIGN KEY (`posted_by`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `annonce_target_class_id_foreign` FOREIGN KEY (`target_class_id`) REFERENCES `classe` (`id_class`) ON DELETE SET NULL,
  ADD CONSTRAINT `annonce_target_filiere_id_foreign` FOREIGN KEY (`target_filiere_id`) REFERENCES `filiere` (`id_filiere`) ON DELETE SET NULL,
  ADD CONSTRAINT `annonce_target_year_id_foreign` FOREIGN KEY (`target_year_id`) REFERENCES `year` (`id_year`) ON DELETE SET NULL;

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
-- Contraintes pour la table `schedule`
--
ALTER TABLE `schedule`
  ADD CONSTRAINT `schedule_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `classe` (`id_class`) ON DELETE CASCADE,
  ADD CONSTRAINT `schedule_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `course` (`id_course`) ON DELETE CASCADE,
  ADD CONSTRAINT `schedule_teacher_id_foreign` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `classe` (`id_class`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
