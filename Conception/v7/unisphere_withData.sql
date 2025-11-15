-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 11 sep. 2025 à 00:26
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
-- Base de données : `unisphere`
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

--
-- Déchargement des données de la table `annonce`
--

INSERT INTO `annonce` (`id_annonce`, `title`, `content`, `posted_by`, `created_at`, `updated_at`) VALUES
(1, 'Priere', 'The accessibility semantics of role=\"menu\" are fairly strict and any children of a Menu that are not MenuItem components will be automatically hidden from assistive technology to make sure the menu works the way screen reader users expect.\r\n\r\nFor this reason, rendering any children other than MenuItem components is discouraged as that content will be inaccessible to people using assistive technology.\r\n\r\nIf you want to build a dropdown with more flexible content, consider using Popover instead', 14, '2025-09-08 12:42:42', '2025-09-08 13:38:15'),
(2, 'Jolie', 'The accessibility semantics of role=\"menu\" are fairly strict and any children of a Menu that are not MenuItem components will be automatically hidden from assistive technology to make sure the menu works the way screen reader users expect.\r\n\r\nFor this reason, rendering any children other than MenuItem components is discouraged as that content will be inaccessible to people using assistive technology.\r\n\r\nIf you want to build a dropdown with more flexible content, consider using Popover instead', 14, '2025-09-08 12:42:42', '2025-09-08 13:38:15'),
(5, 'Annonce 3', 'Contenu fictif pour tester l\'annonce numéro 3. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(6, 'Annonce 4', 'Contenu fictif pour tester l\'annonce numéro 4. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(8, 'Annonce 6', 'Contenu fictif pour tester l\'annonce numéro 6. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(9, 'Annonce 7', 'Contenu fictif pour tester l\'annonce numéro 7. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(10, 'Annonce 8', 'Contenu fictif pour tester l\'annonce numéro 8. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(11, 'Annonce 9', 'Contenu fictif pour tester l\'annonce numéro 9. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(12, 'Annonce 10', 'Contenu fictif pour tester l\'annonce numéro 10. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(13, 'Annonce 11', 'Contenu fictif pour tester l\'annonce numéro 11. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(14, 'Annonce 12', 'Contenu fictif pour tester l\'annonce numéro 12. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(15, 'Annonce 13', 'Contenu fictif pour tester l\'annonce numéro 13. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(18, 'Annonce 16', 'Contenu fictif pour tester l\'annonce numéro 16. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(19, 'Annonce 17', 'Contenu fictif pour tester l\'annonce numéro 17. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(20, 'Annonce 18', 'Contenu fictif pour tester l\'annonce numéro 18. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(21, 'Annonce 19', 'Contenu fictif pour tester l\'annonce numéro 19. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(22, 'Annonce 20', 'Contenu fictif pour tester l\'annonce numéro 20. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(24, 'Annonce 22', 'Contenu fictif pour tester l\'annonce numéro 22. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(25, 'Annonce 23', 'Contenu fictif pour tester l\'annonce numéro 23. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(26, 'Annonce 24', 'Contenu fictif pour tester l\'annonce numéro 24. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(27, 'Annonce 25', 'Contenu fictif pour tester l\'annonce numéro 25. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(28, 'Annonce 26', 'Contenu fictif pour tester l\'annonce numéro 26. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(29, 'Annonce 27', 'Contenu fictif pour tester l\'annonce numéro 27. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(30, 'Annonce 28', 'Contenu fictif pour tester l\'annonce numéro 28. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(32, 'Annonce 30', 'Contenu fictif pour tester l\'annonce numéro 30. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(33, 'Annonce 31', 'Contenu fictif pour tester l\'annonce numéro 31. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(34, 'Annonce 32', 'Contenu fictif pour tester l\'annonce numéro 32. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(35, 'Annonce 33', 'Contenu fictif pour tester l\'annonce numéro 33. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(36, 'Annonce 34', 'Contenu fictif pour tester l\'annonce numéro 34. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(37, 'Annonce 35', 'Contenu fictif pour tester l\'annonce numéro 35. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(38, 'Annonce 36', 'Contenu fictif pour tester l\'annonce numéro 36. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(39, 'Annonce 37', 'Contenu fictif pour tester l\'annonce numéro 37. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(40, 'Annonce 38', 'Contenu fictif pour tester l\'annonce numéro 38. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(41, 'Annonce 39', 'Contenu fictif pour tester l\'annonce numéro 39. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(42, 'Annonce 40', 'Contenu fictif pour tester l\'annonce numéro 40. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(43, 'Annonce 41', 'Contenu fictif pour tester l\'annonce numéro 41. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(44, 'Annonce 42', 'Contenu fictif pour tester l\'annonce numéro 42. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(45, 'Annonce 43', 'Contenu fictif pour tester l\'annonce numéro 43. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(46, 'Annonce 44', 'Contenu fictif pour tester l\'annonce numéro 44. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(47, 'Annonce 45', 'Contenu fictif pour tester l\'annonce numéro 45. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(48, 'Annonce 46', 'Contenu fictif pour tester l\'annonce numéro 46. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(49, 'Annonce 47', 'Contenu fictif pour tester l\'annonce numéro 47. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(50, 'Annonce 48', 'Contenu fictif pour tester l\'annonce numéro 48. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(51, 'Annonce 49', 'Contenu fictif pour tester l\'annonce numéro 49. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(52, 'Annonce 50', 'Contenu fictif pour tester l\'annonce numéro 50. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(53, 'Annonce 51', 'Contenu fictif pour tester l\'annonce numéro 51. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(54, 'Annonce 52', 'Contenu fictif pour tester l\'annonce numéro 52. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(55, 'Annonce 53', 'Contenu fictif pour tester l\'annonce numéro 53. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(56, 'Annonce 54', 'Contenu fictif pour tester l\'annonce numéro 54. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(57, 'Annonce 55', 'Contenu fictif pour tester l\'annonce numéro 55. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(58, 'Annonce 56', 'Contenu fictif pour tester l\'annonce numéro 56. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(59, 'Annonce 57', 'Contenu fictif pour tester l\'annonce numéro 57. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(60, 'Annonce 58', 'Contenu fictif pour tester l\'annonce numéro 58. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(61, 'Annonce 59', 'Contenu fictif pour tester l\'annonce numéro 59. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(62, 'Annonce 60', 'Contenu fictif pour tester l\'annonce numéro 60. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(63, 'Annonce 61', 'Contenu fictif pour tester l\'annonce numéro 61. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(64, 'Annonce 62', 'Contenu fictif pour tester l\'annonce numéro 62. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(65, 'Annonce 63', 'Contenu fictif pour tester l\'annonce numéro 63. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(66, 'Annonce 64', 'Contenu fictif pour tester l\'annonce numéro 64. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(67, 'Annonce 65', 'Contenu fictif pour tester l\'annonce numéro 65. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(68, 'Annonce 66', 'Contenu fictif pour tester l\'annonce numéro 66. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(69, 'Annonce 67', 'Contenu fictif pour tester l\'annonce numéro 67. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(70, 'Annonce 68', 'Contenu fictif pour tester l\'annonce numéro 68. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(71, 'Annonce 69', 'Contenu fictif pour tester l\'annonce numéro 69. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(72, 'Annonce 70', 'Contenu fictif pour tester l\'annonce numéro 70. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(73, 'Annonce 71', 'Contenu fictif pour tester l\'annonce numéro 71. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(74, 'Annonce 72', 'Contenu fictif pour tester l\'annonce numéro 72. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(75, 'Annonce 73', 'Contenu fictif pour tester l\'annonce numéro 73. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(76, 'Annonce 74', 'Contenu fictif pour tester l\'annonce numéro 74. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(77, 'Annonce 75', 'Contenu fictif pour tester l\'annonce numéro 75. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(78, 'Annonce 76', 'Contenu fictif pour tester l\'annonce numéro 76. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(79, 'Annonce 77', 'Contenu fictif pour tester l\'annonce numéro 77. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(80, 'Annonce 78', 'Contenu fictif pour tester l\'annonce numéro 78. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(81, 'Annonce 79', 'Contenu fictif pour tester l\'annonce numéro 79. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(82, 'Annonce 80', 'Contenu fictif pour tester l\'annonce numéro 80. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(83, 'Annonce 81', 'Contenu fictif pour tester l\'annonce numéro 81. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(84, 'Annonce 82', 'Contenu fictif pour tester l\'annonce numéro 82. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(85, 'Annonce 83', 'Contenu fictif pour tester l\'annonce numéro 83. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(86, 'Annonce 84', 'Contenu fictif pour tester l\'annonce numéro 84. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(87, 'Annonce 85', 'Contenu fictif pour tester l\'annonce numéro 85. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(88, 'Annonce 86', 'Contenu fictif pour tester l\'annonce numéro 86. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(89, 'Annonce 87', 'Contenu fictif pour tester l\'annonce numéro 87. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(90, 'Annonce 88', 'Contenu fictif pour tester l\'annonce numéro 88. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(91, 'Annonce 89', 'Contenu fictif pour tester l\'annonce numéro 89. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(92, 'Annonce 90', 'Contenu fictif pour tester l\'annonce numéro 90. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(93, 'Annonce 91', 'Contenu fictif pour tester l\'annonce numéro 91. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(94, 'Annonce 92', 'Contenu fictif pour tester l\'annonce numéro 92. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(95, 'Annonce 93', 'Contenu fictif pour tester l\'annonce numéro 93. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(96, 'Annonce 94', 'Contenu fictif pour tester l\'annonce numéro 94. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(97, 'Annonce 95', 'Contenu fictif pour tester l\'annonce numéro 95. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(98, 'Annonce 96', 'Contenu fictif pour tester l\'annonce numéro 96. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(99, 'Annonce 97', 'Contenu fictif pour tester l\'annonce numéro 97. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(100, 'Annonce 98', 'Contenu fictif pour tester l\'annonce numéro 98. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(101, 'Annonce 99', 'Contenu fictif pour tester l\'annonce numéro 99. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(102, 'Annonce 100', 'Contenu fictif pour tester l\'annonce numéro 100. Lorem ipsum dolor sit amet.', 14, '2025-09-08 13:48:28', '2025-09-08 13:48:28'),
(108, 'ddddsss', 'sdsdsds', 14, '2025-09-09 08:39:23', '2025-09-09 08:39:23'),
(109, 'Fichier', 'de merde ty', 14, '2025-09-09 09:10:41', '2025-09-09 09:10:41'),
(110, 'Annonce de la fete', 'Fete', 14, '2025-09-09 09:12:03', '2025-09-09 09:12:03'),
(111, 'pourta', '75896', 14, '2025-09-09 13:26:45', '2025-09-09 13:26:45'),
(112, 'Image', 'Image 1', 14, '2025-09-09 13:28:31', '2025-09-09 13:28:31'),
(113, 'image2', 'image2', 14, '2025-09-09 13:31:12', '2025-09-09 13:31:12'),
(114, 'Image 3', 'image 3', 14, '2025-09-09 13:32:05', '2025-09-09 13:32:05'),
(115, 'image 4', '4', 14, '2025-09-09 13:34:00', '2025-09-09 13:34:00'),
(116, '5', '5', 14, '2025-09-09 13:35:23', '2025-09-09 13:35:23'),
(117, '6', '6', 14, '2025-09-09 13:35:47', '2025-09-09 13:35:47');

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
(1, 'info L1 A', 1, 4, 1, '2025-09-04 11:20:08', '2025-09-06 04:39:34'),
(2, 'info B', 1, 4, 1, '2025-09-08 17:25:24', '2025-09-09 05:34:34'),
(4, 'Droit A', 3, 4, 2, '2025-09-08 20:39:55', '2025-09-08 20:39:55'),
(5, 'Eco A', 5, 4, 2, '2025-09-08 20:40:28', '2025-09-08 20:40:28'),
(6, 'Info C', 1, 3, 3, '2025-09-09 04:45:33', '2025-09-09 04:45:33');

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

--
-- Déchargement des données de la table `course`
--

INSERT INTO `course` (`id_course`, `title`, `content`, `duration`, `teach_by`, `class_id`, `created_at`, `updated_at`) VALUES
(1, 'Introduction à la Programmation', 'Cours de base sur les variables, structures de contrôle et fonctions en Python.', 50, 15, 1, '2025-09-09 10:01:12', '2025-09-09 13:24:27'),
(3, 'Algèbre Linéaire', 'Vecteurs, matrices, déterminants et applications en sciences informatiques.', 50, 15, 4, '2025-09-09 10:01:12', '2025-09-09 10:01:12'),
(4, 'Développement Web', 'HTML, CSS et JavaScript pour créer des applications web dynamiques.', 75, 18, 5, '2025-09-09 10:01:12', '2025-09-09 10:01:12'),
(5, 'Intelligence Artificielle', 'Concepts fondamentaux : recherche, algorithmes, apprentissage supervisé.', 90, 15, 6, '2025-09-09 10:01:12', '2025-09-09 10:01:12'),
(6, 'Systèmes d’Exploitation', 'Gestion de la mémoire, processus, synchronisation et systèmes de fichiers.', 60, 18, 1, '2025-09-09 10:01:12', '2025-09-09 10:01:12'),
(7, 'Analyse de Données', 'Statistiques descriptives, nettoyage et visualisation des données avec Python.', 70, 15, 2, '2025-09-09 10:01:12', '2025-09-09 10:01:12'),
(8, 'Sécurité Informatique', 'Chiffrement, authentification et protection contre les attaques réseau.', 80, 18, 4, '2025-09-09 10:01:12', '2025-09-09 10:01:12'),
(9, 'Méthodologie de Recherche', 'Introduction aux méthodes scientifiques, rédaction académique et citations.', 30, 15, 5, '2025-09-09 10:01:12', '2025-09-09 10:01:12'),
(10, 'Réseaux Informatiques', 'Protocoles TCP/IP, routage, commutation et architecture des réseaux.', 65, 18, 6, '2025-09-09 10:01:12', '2025-09-09 10:01:12'),
(11, 'UML 2', 'Apprentissage de la conception de logiciel avec UML 2', 40, 15, 2, '2025-09-09 13:19:21', '2025-09-09 13:19:21');

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
) ;

--
-- Déchargement des données de la table `file`
--

INSERT INTO `file` (`id_file`, `file_name`, `file_path`, `annonce_id`, `course_id`, `message_id`, `created_at`, `updated_at`) VALUES
(1, 'Liste Etudiant Genie Logiciel M2.pdf', 'D:\\UniSphere\\Projet\\server\\source\\uploads\\annonces\\1757409123331-821582455-liste_etudiant_genie_logiciel_m2.pdf', 110, NULL, NULL, '2025-09-09 09:12:03', '2025-09-09 09:12:03'),
(2, 'Taille T-Shirt.pdf', 'D:\\UniSphere\\Projet\\server\\source\\uploads\\annonces\\1757424405543-480854617-taille_t-shirt.pdf', 111, NULL, NULL, '2025-09-09 13:26:45', '2025-09-09 13:26:45'),
(3, '1.jpg', 'D:\\UniSphere\\Projet\\server\\source\\uploads\\annonces\\1757424511141-548589360-1.jpg', 112, NULL, NULL, '2025-09-09 13:28:31', '2025-09-09 13:28:31'),
(4, '20250224_200133.jpg', 'D:\\UniSphere\\Projet\\server\\source\\uploads\\annonces\\1757424672173-328528838-20250224_200133.jpg', 113, NULL, NULL, '2025-09-09 13:31:12', '2025-09-09 13:31:12'),
(5, '4843212671292560735c8989a396945a.jpg', 'D:\\UniSphere\\Projet\\server\\source\\uploads\\annonces\\1757424725120-660170370-4843212671292560735c8989a396945a.jpg', 114, NULL, NULL, '2025-09-09 13:32:05', '2025-09-09 13:32:05'),
(6, 'eb22700e8ca404abe0bf3248c2ce907d.jpg', 'D:\\UniSphere\\Projet\\server\\source\\uploads\\annonces\\1757424840140-609070468-eb22700e8ca404abe0bf3248c2ce907d.jpg', 115, NULL, NULL, '2025-09-09 13:34:00', '2025-09-09 13:34:00'),
(7, 'c447b336d5dd26c142f22824d580b19f.jpg', 'D:\\UniSphere\\Projet\\server\\source\\uploads\\annonces\\1757424922987-893331747-c447b336d5dd26c142f22824d580b19f.jpg', 116, NULL, NULL, '2025-09-09 13:35:23', '2025-09-09 13:35:23'),
(8, '00f380a978efaddf0be17176c9a87e61.jpg', 'D:\\UniSphere\\Projet\\server\\source\\uploads\\annonces\\1757424947290-414843808-00f380a978efaddf0be17176c9a87e61.jpg', 117, NULL, NULL, '2025-09-09 13:35:47', '2025-09-09 13:35:47');

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
(1, 'informatique', '2025-09-04 11:16:58', '2025-09-04 11:16:58'),
(2, 'agronomie', '2025-09-04 11:16:58', '2025-09-04 11:16:58'),
(3, 'droit', '2025-09-04 11:16:58', '2025-09-04 11:16:58'),
(4, 'science de la terre', '2025-09-04 11:16:58', '2025-09-04 11:16:58'),
(5, 'économie', '2025-09-04 11:16:58', '2025-09-04 11:16:58');

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

--
-- Déchargement des données de la table `note`
--

INSERT INTO `note` (`id_note`, `course_id`, `student_id`, `note_ds`, `note_examen`, `note_final`, `created_at`, `updated_at`) VALUES
(1, 1, 16, 15.00, 15.00, 15.00, '2025-09-10 17:40:22', '2025-09-10 17:40:22');

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
(2, 'Télécommunication', '2025-09-04 11:18:19', '2025-09-04 11:18:19'),
(3, 'Génie Industriel', '2025-09-04 11:18:19', '2025-09-04 11:18:19'),
(4, 'Tronc Commun', '2025-09-04 11:19:47', '2025-09-04 11:19:47');

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
(13, 1, '5766', 'Gaël', 'Ledoa', 'ledoa@gmail.com', 'D:\\UniSphere\\Projet\\server\\source\\uploads\\profile\\1757272634631-529746313-0cd77eaf696d6aecf81d7564381e3d24_0_.jpg', '$2b$12$PLPrh55iB/fnkb951OlIr.Hag9uKaNfEuyqNIOyZgfLY0fiCZCT6u', 'student', 0, '2025-09-07 19:17:14', '2025-09-08 20:13:17'),
(14, NULL, NULL, 'Maitre', 'Shifu', 'shifu@gmail.com', 'D:\\UniSphere\\Projet\\server\\source\\uploads\\profile\\1757309720484-803529032-0fa7d3b35844fba434263879f768d671.jpg', '$2b$12$WJIo1KeryE65fqqlCX7yIOIrVqFY3ep0DtJibyeYdfZ22GirUmxJG', 'administrator', 1, '2025-09-08 05:35:20', '2025-09-08 14:55:49'),
(15, NULL, '7748', 'Nika', 'Vero', 'vero@gmail.com', 'D:\\UniSphere\\Projet\\server\\source\\uploads\\profile\\1757312081634-145536248-0f13de0468b1b45f592b643232bc4d25.jpg', '$2b$12$lY1YnCISddDjHuOD56VGheeiX/8vSHKSXwOSgXj0NSJw7MKtSKgCe', 'teacher', 1, '2025-09-08 06:14:41', '2025-09-09 09:43:58'),
(16, 1, '2255', 'Wise Mario', 'Phanteon', 'wise@gmail.com', 'D:\\UniSphere\\Projet\\server\\source\\uploads\\profile\\1757324665310-189947690-ac3b39a14558e80a520438fb6960a484.jpg', '$2b$12$cOzFTvQfo4QG0dP5Z2PADelgfOajZSux2qVXz7GpbZil7r/Sp8b2C', 'student', 1, '2025-09-08 09:44:25', '2025-09-10 07:56:14'),
(17, 1, '2254', 'Belle', 'Phateon', 'belle@gmail.com', 'D:\\UniSphere\\Projet\\server\\source\\uploads\\profile\\1757324720191-385031760-b2903db8f9b7c05ffe2deb6311affc95.jpg', '$2b$12$R9w1YSEnfiFIA7IiXysh9O7pe9tm8hbfRIzdvhnrF313LcmuXEIcW', 'student', 1, '2025-09-08 09:45:20', '2025-09-08 16:44:15'),
(18, NULL, '8859', 'Yuan', 'Zhu', 'zhu@gmail.com', 'D:\\UniSphere\\Projet\\server\\source\\uploads\\profile\\1757324775940-808819725-dd20e52e2705f757303c672221d20bcf.jpg', '$2b$12$9BPVZrBYoWBWwFhf2i.KrOWoj1k2D6mXFc2uAnywsdcLTwqBLnWIi', 'teacher', 0, '2025-09-08 09:46:16', '2025-09-08 09:46:16'),
(19, 1, '4859', 'Paradis', 'Vannessa', 'paradis@gmail.com', 'D:\\UniSphere\\Projet\\server\\source\\uploads\\profile\\1757522608658-699369367-a_on_twitter.png', '$2b$12$2UVXsI5BXoME3k1CvbBvnOVhypsnIBlb.lK5d8mLiQBuQMuyRym2G', 'student', 0, '2025-09-10 16:43:29', '2025-09-10 16:43:29'),
(20, 1, '4856', 'Vertigo', 'Alexina', 'alexina@gmail.com', 'D:\\UniSphere\\Projet\\server\\source\\uploads\\profile\\1757522655194-824466724-b05b7295618e02399278c35382a95939.jpg', '$2b$12$q/6YfC3L2EraGL3rzC4SE.6efSS.OZS3BW/MXdxaeCM7vIHG7P/mS', 'student', 0, '2025-09-10 16:44:15', '2025-09-10 16:44:15'),
(21, 1, '4855', 'Lost', 'Hercule', 'lost@gmail.com', 'D:\\UniSphere\\Projet\\server\\source\\uploads\\profile\\1757522695386-327141547-77515c97a44eb0de0a4bbd83bf4d3f37.jpg', '$2b$12$Y66bgQahZAywGrw5soTyhuR51/8qqrlN/7UpwBiZTUjRoZ0j4efsK', 'student', 0, '2025-09-10 16:44:55', '2025-09-10 16:44:55'),
(22, 1, '4844', 'Love', 'Youth', 'lov@gmail.com', 'D:\\UniSphere\\Projet\\server\\source\\uploads\\profile\\1757522750493-191204511-1f77dccbb5a070bf536dcb73e3471bb8_0_.jpg', '$2b$12$6Gph1l8hqfBkt9jdzhekbesp1.9S2Irpdqf4yv.9zncTM8/yGdUte', 'student', 0, '2025-09-10 16:45:50', '2025-09-10 16:45:50');

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
(1, 'licence 1', '2025-09-04 11:16:04', '2025-09-04 12:12:03'),
(2, 'licence 2', '2025-09-04 11:16:04', '2025-09-04 12:12:04'),
(3, 'licence 3', '2025-09-04 11:16:04', '2025-09-04 12:12:04'),
(4, 'master 1', '2025-09-04 11:16:04', '2025-09-04 12:12:04'),
(5, 'master 2', '2025-09-04 11:16:04', '2025-09-04 12:12:04');

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
  MODIFY `id_annonce` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT pour la table `classe`
--
ALTER TABLE `classe`
  MODIFY `id_class` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
  MODIFY `id_course` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `file`
--
ALTER TABLE `file`
  MODIFY `id_file` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `filiere`
--
ALTER TABLE `filiere`
  MODIFY `id_filiere` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `message`
--
ALTER TABLE `message`
  MODIFY `id_message` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `note`
--
ALTER TABLE `note`
  MODIFY `id_note` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `parcours`
--
ALTER TABLE `parcours`
  MODIFY `id_parcours` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `year`
--
ALTER TABLE `year`
  MODIFY `id_year` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
