-- Active le mode strict et désactive temporairement les FK
SET
  SQL_MODE = 'STRICT_ALL_TABLES';

SET
  FOREIGN_KEY_CHECKS = 0;

-- TABLE Year 
CREATE TABLE
  `year` (
    id_year INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(20) NOT NULL,
    year_value INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

-- TABLE Parcours 
CREATE TABLE
  parcours (
    id_parcours INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

-- TABLE Filiere 
CREATE TABLE
  filiere (
    id_filiere INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

-- TABLE Classe 
CREATE TABLE
  classe (
    id_class INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    filiere_id INT NOT NULL,
    parcours_id INT NOT NULL,
    year_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (filiere_id) REFERENCES filiere (id_filiere),
    FOREIGN KEY (parcours_id) REFERENCES parcours (id_parcours),
    FOREIGN KEY (year_id) REFERENCES `year` (id_year)
  );

-- TABLE User 
CREATE TABLE
  `user` (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    matricule VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    lastname VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    profile_pic VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student', 'teacher') NOT NULL,
    poste VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classe (id_class)
  );

-- TABLE Conversation (CORRIGÉE : Title peut être NULL) 
CREATE TABLE
  conversation (
    id_conversation INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NULL, -- NULL pour les conversations privées 
    type ENUM('private', 'group') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

-- TABLE Conversation Member 
CREATE TABLE
  conversation_member (
    id_convo_member INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    member_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP NULL,
    FOREIGN KEY (conversation_id) REFERENCES conversation (id_conversation) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES `user` (id_user) ON DELETE CASCADE
  );

-- TABLE Message (CORRIGÉE : Content en TEXT, FK ajoutées) 
CREATE TABLE
  message (
    id_message INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversation (id_conversation) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES `user` (id_user) ON DELETE CASCADE
  );

-- TABLE Annonce 
CREATE TABLE
  annonce (
    id_annonce INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    posted_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES `user` (id_user)
  );

-- TABLE Course 
CREATE TABLE
  course (
    id_course INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    content TEXT,
    duration INT,
    teach_by INT NOT NULL,
    class_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teach_by) REFERENCES `user` (id_user),
    FOREIGN KEY (class_id) REFERENCES classe (id_class)
  );

-- TABLE File (CORRIGÉE - Pattern Polymorphique) 
CREATE TABLE
  `file` (
    id_file INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL, -- Nom original du fichier 
    file_path VARCHAR(500) NOT NULL, -- Chemin unique sur le serveur 
    owner_id INT NOT NULL, -- ID de l'entité propriétaire shouldhavenbehind{comma} 
    owner_type ENUM('annonce', 'course', 'message') NOT NULL, -- Type de l'entité 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    -- Pas de FOREIGN KEY possible 
  );

-- Réactive les contraintes de clés étrangères 
SET
  FOREIGN_KEY_CHECKS = 1;