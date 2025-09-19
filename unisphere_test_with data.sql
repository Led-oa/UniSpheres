-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 19 sep. 2025 à 12:25
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

--
-- Déchargement des données de la table `classe`
--

INSERT INTO `classe` (`id_class`, `name`, `filiere_id`, `parcours_id`, `year_id`, `created_at`, `updated_at`) VALUES
(1, 'Info L1 A', 1, 6, 1, '2025-09-16 04:01:17', '2025-09-16 04:01:17'),
(2, 'Info L1 B', 1, 6, 1, '2025-09-16 04:01:17', '2025-09-16 04:01:17'),
(3, 'Info L3 C', 1, 1, 3, '2025-09-16 07:39:17', '2025-09-16 13:51:35'),
(4, 'Info DAI', 1, 2, 3, '2025-09-16 07:39:17', '2025-09-16 07:39:17'),
(5, 'Math L1 F', 2, 6, 1, '2025-09-16 13:51:58', '2025-09-16 13:51:58'),
(8, 'Nasa L1', 6, 6, 1, '2025-09-16 13:54:35', '2025-09-16 13:54:35');

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
(1, NULL, 'private', '2025-09-17 04:51:36', '2025-09-17 04:51:36'),
(2, NULL, 'private', '2025-09-17 04:51:36', '2025-09-17 04:51:36'),
(3, NULL, 'private', '2025-09-17 06:17:03', '2025-09-17 06:17:03'),
(4, NULL, 'private', '2025-09-17 06:17:03', '2025-09-17 06:17:03'),
(5, NULL, 'private', '2025-09-17 15:08:47', '2025-09-17 15:08:47'),
(6, NULL, 'private', '2025-09-17 15:09:08', '2025-09-17 15:09:08'),
(7, NULL, 'private', '2025-09-17 15:15:22', '2025-09-17 15:15:22'),
(8, NULL, 'private', '2025-09-17 15:17:09', '2025-09-17 15:17:09'),
(9, NULL, 'private', '2025-09-17 15:19:13', '2025-09-17 15:19:13'),
(10, NULL, 'private', '2025-09-17 15:20:04', '2025-09-17 15:20:04'),
(11, NULL, 'private', '2025-09-17 15:21:50', '2025-09-17 15:21:50'),
(12, NULL, 'private', '2025-09-17 15:23:37', '2025-09-17 15:23:37'),
(13, NULL, 'private', '2025-09-17 15:28:09', '2025-09-17 15:28:09'),
(14, NULL, 'private', '2025-09-17 15:33:03', '2025-09-17 15:33:03'),
(15, NULL, 'private', '2025-09-17 15:35:02', '2025-09-17 15:35:02'),
(16, NULL, 'private', '2025-09-17 15:41:49', '2025-09-17 15:41:49'),
(17, NULL, 'private', '2025-09-17 15:42:29', '2025-09-17 15:42:29'),
(18, 'Web 2 Examen', 'group', '2025-09-17 15:43:23', '2025-09-17 15:43:23');

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
(1, 1, 12, '2025-09-17 04:53:13', NULL, '2025-09-17 04:53:13', '2025-09-17 04:53:13'),
(2, 1, 10, '2025-09-17 04:53:13', NULL, '2025-09-17 04:53:13', '2025-09-17 04:53:13'),
(3, 2, 12, '2025-09-17 06:17:26', NULL, '2025-09-17 06:17:26', '2025-09-17 06:17:26'),
(4, 2, 2, '2025-09-17 06:17:26', NULL, '2025-09-17 06:17:26', '2025-09-17 06:17:26'),
(16, 17, 10, '2025-09-17 15:42:29', NULL, '2025-09-17 15:42:29', '2025-09-17 15:42:29'),
(17, 17, 2, '2025-09-17 15:42:29', NULL, '2025-09-17 15:42:29', '2025-09-17 15:42:29'),
(18, 18, 10, '2025-09-17 15:43:23', NULL, '2025-09-17 15:43:23', '2025-09-17 15:43:23'),
(19, 18, 4, '2025-09-17 15:43:23', NULL, '2025-09-17 15:43:23', '2025-09-17 15:43:23'),
(20, 18, 5, '2025-09-17 15:43:23', NULL, '2025-09-17 15:43:23', '2025-09-17 15:43:23');

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

--
-- Déchargement des données de la table `course`
--

INSERT INTO `course` (`id_course`, `title`, `content`, `duration`, `teach_by`, `class_id`, `created_at`, `updated_at`) VALUES
(1, 'Thermo dynamique', 'Cours thermo dynamique', 45, 4, 4, '2025-09-18 05:11:49', '2025-09-18 06:36:13'),
(3, 'Introduction à la Programmation', 'Bases de la programmation et algorithmes', 60, 6, 4, '2025-09-18 06:08:05', '2025-09-18 06:38:32'),
(4, 'Algèbre Linéaire', 'Vecteurs, matrices et applications', 90, 4, 2, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(5, 'Physique Mécanique', 'Lois de Newton et mouvement', 75, 6, 3, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(6, 'Chimie Organique', 'Composés carbonés et réactions', 60, 7, 4, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(7, 'Électromagnétisme', 'Champs électriques et magnétiques', 90, 8, 5, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(8, 'Biologie Cellulaire', 'Structure et fonction des cellules', 60, 9, 8, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(9, 'Calcul Différentiel', 'Dérivées et applications', 75, 1, 1, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(10, 'Statistiques Appliquées', 'Analyses de données et probabilités', 90, 4, 2, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(11, 'Optique Géométrique', 'Lumière et systèmes optiques', 60, 6, 3, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(12, 'Biochimie', 'Processus chimiques dans les organismes', 75, 7, 4, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(13, 'Programmation Web', 'HTML, CSS et JavaScript', 90, 8, 5, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(14, 'Génétique', 'Hérédité et ADN', 60, 9, 8, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(15, 'Algorithmes Avancés', 'Structures de données complexes', 90, 1, 1, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(16, 'Géométrie Analytique', 'Coordonnées et transformations', 75, 4, 2, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(17, 'Thermodynamique Avancée', 'Cycles thermodynamiques', 90, 6, 3, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(18, 'Chimie Inorganique', 'Éléments et composés minéraux', 60, 7, 4, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(19, 'Réseaux Informatiques', 'Protocoles et architecture réseau', 75, 8, 5, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(20, 'Écologie', 'Écosystèmes et biodiversité', 60, 9, 8, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(21, 'Intelligence Artificielle', 'Machine Learning et réseaux neuronaux', 90, 1, 1, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(22, 'Analyse Complexe', 'Fonctions complexes et intégration', 75, 4, 2, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(23, 'Physique Quantique', 'Mécanique quantique et particules', 90, 6, 3, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(24, 'Pharmacologie', 'Médicaments et mécanismes d action', 60, 7, 4, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(25, 'Sécurité Informatique', 'Cryptographie et protection des données', 75, 8, 5, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(26, 'Anatomie Humaine', 'Structure du corps humain', 90, 9, 8, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(27, 'Base de Données', 'SQL et modélisation des données', 60, 1, 1, '2025-09-18 06:08:05', '2025-09-18 06:08:05'),
(28, 'UML 2', 'Base de la conception de projet', 40, 9, 2, '2025-09-18 06:37:41', '2025-09-18 06:37:41');

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
(1, '#\'\'artdrawÄ±ng\'\'.jpg', 'D:\\UniSpheres\\backend\\src\\uploads\\message\\1758093907414-329020459-artdrawa_ng_.jpg', NULL, NULL, 21, '2025-09-17 07:25:07', '2025-09-17 07:25:07'),
(2, '_ (2).jpeg', 'D:\\UniSpheres\\backend\\src\\uploads\\message\\1758093915355-939177476-2_.jpeg', NULL, NULL, 22, '2025-09-17 07:25:15', '2025-09-17 07:25:15'),
(3, '[Media] Evil Subaru and Betty.jpg', 'D:\\UniSpheres\\backend\\src\\uploads\\message\\1758094684969-897996035-media_evil_subaru_and_betty.jpg', NULL, NULL, 25, '2025-09-17 07:38:05', '2025-09-17 07:38:05'),
(4, '16574011ad9905c2db01a327291f32d5.jpg', 'D:\\UniSpheres\\backend\\src\\uploads\\message\\1758095676526-53766277-16574011ad9905c2db01a327291f32d5.jpg', NULL, NULL, 26, '2025-09-17 07:54:36', '2025-09-17 07:54:36'),
(5, '1bd773c93d2927e62bc94394026a6f51.jpg', 'D:\\UniSpheres\\backend\\src\\uploads\\message\\1758096259014-978628050-1bd773c93d2927e62bc94394026a6f51.jpg', NULL, NULL, 27, '2025-09-17 08:04:19', '2025-09-17 08:04:19'),
(6, '#\'\'artdrawÄ±ng\'\'.jpg', 'D:\\UniSpheres\\backend\\src\\uploads\\message\\1758096980890-179505331-artdrawa_ng_.jpg', NULL, NULL, 34, '2025-09-17 08:16:20', '2025-09-17 08:16:20'),
(7, '2c495c1b3626390baaba91badac4361f.jpg', 'D:\\UniSpheres\\backend\\src\\uploads\\message\\1758097606246-6604891-2c495c1b3626390baaba91badac4361f.jpg', NULL, NULL, 35, '2025-09-17 08:26:46', '2025-09-17 08:26:46'),
(8, 'NORME CANEVAS MEMOIRE MASTER ASJA.docx', 'D:\\UniSpheres\\backend\\src\\uploads\\message\\1758130652664-452935996-norme_canevas_memoire_master_asja.docx', NULL, NULL, 42, '2025-09-17 17:37:32', '2025-09-17 17:37:32'),
(9, '1c0470301d329fadb03062103d7c7139.jpg', 'D:\\UniSpheres\\backend\\src\\uploads\\message\\1758130922475-590310139-1c0470301d329fadb03062103d7c7139.jpg', NULL, NULL, 43, '2025-09-17 17:42:02', '2025-09-17 17:42:02'),
(10, 'NORME CANEVAS MEMOIRE MASTER ASJA.docx', 'D:\\UniSpheres\\backend\\src\\uploads\\message\\1758133687524-625387396-norme_canevas_memoire_master_asja.docx', NULL, NULL, 46, '2025-09-17 18:28:07', '2025-09-17 18:28:07'),
(11, '#ãªã¼ã­ ã¼ã­ããï¼ï¼ï¼ï¼ç°ä¸ççæ´» - ãã¡ãã®ã¤ã©ã¹ã - pixiv.png', 'D:\\UniSpheres\\backend\\src\\uploads\\message\\1758136285485-791545562-a_a_a_a_a_a_a_i_i_i_i_c_a_c_c_-_a_a_a_a_a_a_a_a_-_pixiv.png', NULL, NULL, 51, '2025-09-17 19:11:25', '2025-09-17 19:11:25'),
(12, '2bae9ed3721a512ce3fce8cf438bbca5.jpg', 'D:\\UniSpheres\\backend\\src\\uploads\\message\\1758137036817-441217512-2bae9ed3721a512ce3fce8cf438bbca5.jpg', NULL, NULL, 53, '2025-09-17 19:23:57', '2025-09-17 19:23:57'),
(13, '_ (4).jpeg', 'D:\\UniSpheres\\backend\\src\\uploads\\message\\1758137062090-912600064-4_.jpeg', NULL, NULL, 55, '2025-09-17 19:24:22', '2025-09-17 19:24:22'),
(15, 'Piper.png', 'D:\\UniSpheres\\backend\\src\\uploads\\message\\1758146625189-464975501-piper.png', NULL, NULL, 66, '2025-09-17 22:03:45', '2025-09-17 22:03:45'),
(16, '20250224_200338.jpg', 'D:\\UniSpheres\\backend\\src\\uploads\\message\\1758146643703-693471644-20250224_200338.jpg', NULL, NULL, 67, '2025-09-17 22:04:03', '2025-09-17 22:04:03'),
(17, '20250224_200133.jpg', 'D:\\UniSpheres\\backend\\src\\uploads\\message\\1758146859863-815954964-20250224_200133.jpg', NULL, NULL, 68, '2025-09-17 22:07:39', '2025-09-17 22:07:39'),
(18, 'BenColor.png', 'D:\\UniSpheres\\backend\\src\\uploads\\message\\1758146955185-4766634-bencolor.png', NULL, NULL, 72, '2025-09-17 22:09:15', '2025-09-17 22:09:15'),
(21, 'Cours OGE partie I.pdf', 'D:/UniSpheres/backend/src/uploads/cours/1758189163317-612507585-cours_oge_partie_i.pdf', NULL, 13, NULL, '2025-09-18 09:52:43', '2025-09-18 09:52:43'),
(22, 'DROIT DE PROPRIETE INTELLECTUELLE.pdf', 'D:/UniSpheres/backend/src/uploads/cours/1758189950308-864242196-droit_de_propriete_intellectuelle.pdf', NULL, 13, NULL, '2025-09-18 10:05:50', '2025-09-18 10:05:50'),
(23, 'Codage arithemtique exemple.docx', 'D:/UniSpheres/backend/src/uploads/cours/1758191884416-503933098-codage_arithemtique_exemple.docx', NULL, 7, NULL, '2025-09-18 10:38:04', '2025-09-18 10:38:04'),
(24, 'LZ 77 Exemples.docx', 'D:/UniSpheres/backend/src/uploads/cours/1758207607304-787404547-lz_77_exemples.docx', NULL, 9, NULL, '2025-09-18 15:00:07', '2025-09-18 15:00:07'),
(25, 'Quantification par moyenne intervalle.docx', 'D:/UniSpheres/backend/src/uploads/cours/1758207675638-579954663-quantification_par_moyenne_intervalle.docx', NULL, 15, NULL, '2025-09-18 15:01:15', '2025-09-18 15:01:15');

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
(1, 1, 12, 'Hello', '2025-09-17 05:44:52', '2025-09-17 05:44:52'),
(2, 1, 12, 'How are you', '2025-09-17 05:44:52', '2025-09-17 05:44:52'),
(4, 1, 12, 'test', '2025-09-17 06:26:17', '2025-09-17 06:26:17'),
(5, 1, 12, 'test', '2025-09-17 06:27:01', '2025-09-17 06:27:01'),
(6, 1, 12, 'voyions voir', '2025-09-17 06:27:48', '2025-09-17 06:27:48'),
(7, 1, 10, 'hey', '2025-09-17 06:30:24', '2025-09-17 06:30:24'),
(8, 1, 12, 'you', '2025-09-17 06:30:59', '2025-09-17 06:30:59'),
(9, 1, 10, 'this is a test for socket.io', '2025-09-17 06:31:38', '2025-09-17 06:31:38'),
(10, 1, 10, 'do you receiv this', '2025-09-17 06:31:55', '2025-09-17 06:31:55'),
(11, 1, 12, 'not', '2025-09-17 06:32:01', '2025-09-17 06:32:01'),
(12, 1, 12, 'test', '2025-09-17 06:47:59', '2025-09-17 06:47:59'),
(13, 1, 10, 'hello', '2025-09-17 06:48:16', '2025-09-17 06:48:16'),
(14, 1, 10, 'speed', '2025-09-17 06:48:53', '2025-09-17 06:48:53'),
(15, 1, 12, 'deep', '2025-09-17 06:49:06', '2025-09-17 06:49:06'),
(16, 1, 10, 'peer', '2025-09-17 06:52:13', '2025-09-17 06:52:13'),
(17, 1, 12, 'read', '2025-09-17 06:55:39', '2025-09-17 06:55:39'),
(18, 1, 12, 'dread', '2025-09-17 07:04:15', '2025-09-17 07:04:15'),
(19, 1, 10, 'drum', '2025-09-17 07:04:25', '2025-09-17 07:04:25'),
(20, 1, 12, 'marketing', '2025-09-17 07:04:47', '2025-09-17 07:04:47'),
(21, 1, 12, '', '2025-09-17 07:25:07', '2025-09-17 07:25:07'),
(22, 1, 12, '', '2025-09-17 07:25:15', '2025-09-17 07:25:15'),
(23, 1, 10, 'test', '2025-09-17 07:25:27', '2025-09-17 07:25:27'),
(24, 1, 10, 'voici la version maudite', '2025-09-17 07:25:43', '2025-09-17 07:25:43'),
(25, 1, 12, '', '2025-09-17 07:38:05', '2025-09-17 07:38:05'),
(26, 1, 12, 'Fichier: 16574011ad9905c2db01a327291f32d5.jpg', '2025-09-17 07:54:36', '2025-09-17 07:54:36'),
(27, 1, 12, 'Fichier: 1bd773c93d2927e62bc94394026a6f51.jpg', '2025-09-17 08:04:19', '2025-09-17 08:04:19'),
(28, 1, 10, 'Test', '2025-09-17 08:09:37', '2025-09-17 08:09:37'),
(29, 1, 10, 'Voici mon ajout je Jacob', '2025-09-17 08:09:51', '2025-09-17 08:09:51'),
(30, 1, 12, 'fer', '2025-09-17 08:14:14', '2025-09-17 08:14:14'),
(31, 1, 12, 'fet', '2025-09-17 08:14:27', '2025-09-17 08:14:27'),
(32, 1, 10, 'Je suis jacob', '2025-09-17 08:14:59', '2025-09-17 08:14:59'),
(33, 1, 12, 'Je juis jon', '2025-09-17 08:15:59', '2025-09-17 08:15:59'),
(34, 1, 12, '', '2025-09-17 08:16:20', '2025-09-17 08:16:20'),
(35, 1, 12, '', '2025-09-17 08:26:46', '2025-09-17 08:26:46'),
(36, 1, 12, 'Yo it me mario', '2025-09-17 08:31:27', '2025-09-17 08:31:27'),
(37, 1, 10, 'yo mario', '2025-09-17 08:31:36', '2025-09-17 08:31:36'),
(38, 1, 10, 'test', '2025-09-17 08:35:18', '2025-09-17 08:35:18'),
(39, 1, 12, 'speed', '2025-09-17 08:43:54', '2025-09-17 08:43:54'),
(40, 1, 12, 'hello', '2025-09-17 17:35:06', '2025-09-17 17:35:06'),
(41, 1, 10, 'hello i am jadida', '2025-09-17 17:35:14', '2025-09-17 17:35:14'),
(42, 1, 10, '', '2025-09-17 17:37:32', '2025-09-17 17:37:32'),
(43, 1, 12, '', '2025-09-17 17:42:02', '2025-09-17 17:42:02'),
(44, 1, 12, 'test 01', '2025-09-17 17:42:19', '2025-09-17 17:42:19'),
(45, 1, 10, 'test 02', '2025-09-17 17:42:24', '2025-09-17 17:42:24'),
(46, 1, 10, '', '2025-09-17 18:28:07', '2025-09-17 18:28:07'),
(47, 1, 12, 'test', '2025-09-17 18:28:17', '2025-09-17 18:28:17'),
(48, 1, 12, 'yiu', '2025-09-17 19:05:16', '2025-09-17 19:05:16'),
(49, 1, 12, 'test Hello Francio', '2025-09-17 19:10:50', '2025-09-17 19:10:50'),
(50, 1, 12, 'ty', '2025-09-17 19:11:15', '2025-09-17 19:11:15'),
(51, 1, 12, '', '2025-09-17 19:11:25', '2025-09-17 19:11:25'),
(52, 2, 12, 'hey', '2025-09-17 19:15:57', '2025-09-17 19:15:57'),
(53, 1, 12, '', '2025-09-17 19:23:57', '2025-09-17 19:23:57'),
(54, 1, 12, 'test', '2025-09-17 19:24:08', '2025-09-17 19:24:08'),
(55, 1, 12, '', '2025-09-17 19:24:22', '2025-09-17 19:24:22'),
(56, 1, 10, 'yo', '2025-09-17 21:16:28', '2025-09-17 21:16:28'),
(57, 1, 12, 'test', '2025-09-17 21:17:35', '2025-09-17 21:17:35'),
(58, 1, 10, 'why', '2025-09-17 21:17:46', '2025-09-17 21:17:46'),
(66, 1, 10, '', '2025-09-17 22:03:45', '2025-09-17 22:03:45'),
(67, 1, 12, '', '2025-09-17 22:04:03', '2025-09-17 22:04:03'),
(68, 1, 12, '', '2025-09-17 22:07:39', '2025-09-17 22:07:39'),
(69, 1, 10, 'alors', '2025-09-17 22:07:47', '2025-09-17 22:07:47'),
(70, 1, 12, 'commen ca va testons', '2025-09-17 22:07:52', '2025-09-17 22:31:21'),
(71, 1, 10, 'hello', '2025-09-17 22:09:09', '2025-09-17 22:09:09'),
(72, 1, 10, '', '2025-09-17 22:09:15', '2025-09-17 22:09:15');

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
(3, 9, 12, 15.00, 16.00, 14.00, '2025-09-19 04:57:33', '2025-09-19 09:21:23'),
(6, 21, 10, 13.00, 13.75, 11.25, '2025-09-19 09:07:38', '2025-09-19 09:08:33'),
(8, 21, 2, 10.00, 12.00, 15.00, '2025-09-19 09:17:47', '2025-09-19 09:17:47'),
(9, 21, 5, 15.00, 15.00, 16.00, '2025-09-19 09:19:17', '2025-09-19 09:19:17'),
(10, 9, 5, 14.00, 14.00, 14.00, '2025-09-19 09:21:13', '2025-09-19 09:21:13'),
(12, 9, 10, 12.00, 9.00, 7.00, '2025-09-19 09:24:45', '2025-09-19 09:24:45');

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
(1, NULL, '5766', 'Gael', 'LEDOA', 'ledoagael@gmail.com', 'D:\\UniSpheres\\backend\\src\\uploads\\profile\\1758207758511-298364886-5c3c8ada21bf58e004d23410e7bbeb46.jpg', '$2b$10$Qo4Kzrw4ztZgFwJUlNjZFesh8hIXv/TGO.LvRpUwdQ2kfxd57L07y', 'teacher', 1, '2025-09-16 04:31:15', '2025-09-18 15:02:38'),
(2, 1, '4859', 'Gael', 'LEDOA', 'ledoa@gmail.com', NULL, '$2b$10$ADCqpi9hILFf1N/bvlEeiuBVCxiUSk3Cxyv/Uv8Q/zt7g6IIlU34m', 'student', 1, '2025-09-16 04:35:01', '2025-09-16 14:15:51'),
(4, NULL, '1111', 'gael', 'ledoa', 'ledoaz@gmail.com', NULL, '$2b$10$F0WSHCEh3O4Q2NIs3Sjz4uZUHYDjCKMe8eRb/EkqxrHtvLobFgGXq', 'teacher', 1, '2025-09-16 04:41:17', '2025-09-16 14:15:43'),
(5, 1, '7859', 'Mir', 'Vlad', 'vladmir@gmail.com', 'D:\\UniSpheres\\backend\\src\\uploads\\profile\\1757997908363-269828321-testing.jpg', '$2b$10$xsNBynE3DCYTi8uZGLCp8u8OT28CrWe3TOT3Tp6UxgsJyVSsEYeqi', 'student', 0, '2025-09-16 04:45:08', '2025-09-18 16:56:29'),
(6, NULL, '4857', 'Farah', 'Helen', 'helen@gmail.com', 'D:\\UniSpheres\\backend\\src\\uploads\\profile\\1757998099846-624676310-testing.jpg', '$2b$10$WCcORcA7VlZt9VsN1N/pRepX00QEuSB/0CDsII1BWGLMvf0VDGAkO', 'teacher', 1, '2025-09-16 04:48:20', '2025-09-16 14:15:42'),
(7, NULL, '7441', 'testone', 'testing', 'stone@gmail.com', 'D:\\UniSpheres\\backend\\src\\uploads\\profile\\1757998378161-417765155-testing.jpg', '$2b$10$6V4yLsdoliFxE5iX0VSxaOpnPs1eT9P/ke3sY6CCWe8Q.C1Y/IABK', 'teacher', 1, '2025-09-16 04:52:58', '2025-09-16 14:15:41'),
(8, NULL, '7856', 'Yuan Shi', 'Zhu', 'zhu@gmail.com', 'D:\\UniSpheres\\backend\\src\\uploads\\profile\\1758012934379-839691065-6f5c3436794af6b6fba799df4727300c.jpg', '$2b$10$aqDRXXtwdNMibqaBFZZLe.T8vilpKiTR0ut782LHP3vktSLivKQWC', 'teacher', 1, '2025-09-16 04:54:58', '2025-09-16 14:15:40'),
(9, NULL, '7412', 'Ling', 'Yin', 'yin@gmail.com', 'D:\\UniSpheres\\backend\\src\\uploads\\profile\\1757998548354-775041847-wallhaven-1q3lmg_1448x2048.png', '$2b$10$6.UCfjwr4y52JRzhQ9dvWeIo5NsYJrFQ8LrIVYwp8j6NXcOake4SS', 'teacher', 1, '2025-09-16 04:55:48', '2025-09-16 14:15:39'),
(10, 1, '7854', 'Marco', 'Jacob', 'jacob@gmail.com', 'D:\\UniSpheres\\backend\\src\\uploads\\profile\\1757998607971-99369205-wallhaven-w587zr_4786x4852.png', '$2b$10$Ml9LfKrWU6gfwqYQ0Wpu3.mRTxpYy4kBZxGVtDawy12p7FfXdJvoC', 'student', 1, '2025-09-16 04:56:48', '2025-09-16 14:15:34'),
(11, NULL, NULL, 'theFirstAdmin', 'admin', 'shifu@gmail.com', 'D:\\UniSpheres\\backend\\src\\uploads\\profile\\1758031370133-123537899-8eae3fde74273481354c312871065bec.jpg', '$2b$10$EUnPfU3uYNfkfDxfx.AomO5kZExU2ecEieb/5LdK9xjPheOh.XR.y', 'administrator', 1, '2025-09-16 10:02:23', '2025-09-16 14:02:50'),
(12, 1, '48', 'Franca Lumian', 'jon', 'john@gmail.com', 'D:\\UniSpheres\\backend\\src\\uploads\\profile\\1758216672655-61707114-41183a5f9aac75908dedead2157c0536.jpg', '$2b$10$QuhGGITakW0/eBdLGh5CXeDnjN6j1TS8xk7XdrKug9LOWsym6MBaW', 'student', 1, '2025-09-16 17:20:40', '2025-09-18 18:16:26');

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
  MODIFY `id_class` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `conversation`
--
ALTER TABLE `conversation`
  MODIFY `id_conversation` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `conversation_member`
--
ALTER TABLE `conversation_member`
  MODIFY `id_convo_member` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pour la table `course`
--
ALTER TABLE `course`
  MODIFY `id_course` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT pour la table `file`
--
ALTER TABLE `file`
  MODIFY `id_file` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT pour la table `filiere`
--
ALTER TABLE `filiere`
  MODIFY `id_filiere` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `message`
--
ALTER TABLE `message`
  MODIFY `id_message` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT pour la table `note`
--
ALTER TABLE `note`
  MODIFY `id_note` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `parcours`
--
ALTER TABLE `parcours`
  MODIFY `id_parcours` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
