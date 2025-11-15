-- TABLE parcours
CREATE TABLE
  parcours (
    id_parcours INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) CHARACTER SET utf8mb4;

-- TABLE filiere 
CREATE TABLE
  filiere (
    id_filiere INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) CHARACTER SET utf8mb4;

-- TABLE annee (renommée de 'year') 
CREATE TABLE
  annee (
    id_annee INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(100) NOT NULL,
    valeur_annee INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) CHARACTER SET utf8mb4;

-- TABLE classe 
CREATE TABLE
  classe (
    id_classe INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    id_filiere INT NOT NULL,
    id_parcours INT NOT NULL,
    id_annee INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_classe_filiere FOREIGN KEY (id_filiere) REFERENCES filiere (id_filiere) ON DELETE RESTRICT,
    CONSTRAINT fk_classe_parcours FOREIGN KEY (id_parcours) REFERENCES parcours (id_parcours) ON DELETE RESTRICT,
    CONSTRAINT fk_classe_annee FOREIGN KEY (id_annee) REFERENCES annee (id_annee) ON DELETE RESTRICT
  ) CHARACTER SET utf8mb4;

-- TABLE utilisateur (renommée de 'user') 
CREATE TABLE
  utilisateur (
    id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
    id_classe INT,
    matricule VARCHAR(50) UNIQUE NOT NULL,
    prenom VARCHAR(150) NOT NULL,
    nom VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    photo_profil VARCHAR(255),
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    role ENUM('administrateur', 'étudiant', 'enseignant') NOT NULL DEFAULT 'étudiant',
    poste VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_utilisateur_classe FOREIGN KEY (id_classe) REFERENCES classe (id_classe) ON DELETE SET NULL
  ) CHARACTER SET utf8mb4;

-- TABLE annonce 
CREATE TABLE
  annonce (
    id_annonce INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    contenu TEXT NOT NULL,
    id_auteur INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_annonce_auteur FOREIGN KEY (id_auteur) REFERENCES utilisateur (id_utilisateur) ON DELETE CASCADE
  ) CHARACTER SET utf8mb4;

-- TABLE cours (renommée de 'course') 
CREATE TABLE
  cours (
    id_cours INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    contenu TEXT,
    duree_minutes INT NOT NULL,
    id_enseignant INT NOT NULL,
    id_classe INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cours_enseignant FOREIGN KEY (id_enseignant) REFERENCES utilisateur (id_utilisateur) ON DELETE RESTRICT,
    CONSTRAINT fk_cours_classe FOREIGN KEY (id_classe) REFERENCES classe (id_classe) ON DELETE RESTRICT
  ) CHARACTER SET utf8mb4;

-- TABLE conversation 
CREATE TABLE
  conversation (
    id_conversation INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(100),
    type ENUM('privée', 'groupe') NOT NULL DEFAULT 'privée',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) CHARACTER SET utf8mb4;

-- TABLE membre_conversation (renommée de 'conversation_member') 
CREATE TABLE
  membre_conversation (
    id_membre_conversation INT AUTO_INCREMENT PRIMARY KEY,
    id_conversation INT NOT NULL,
    id_utilisateur INT NOT NULL,
    date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_left TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_membre_conversation FOREIGN KEY (id_conversation) REFERENCES conversation (id_conversation) ON DELETE CASCADE,
    CONSTRAINT fk_membre_utilisateur FOREIGN KEY (id_utilisateur) REFERENCES utilisateur (id_utilisateur) ON DELETE CASCADE,
    UNIQUE KEY unique_membre_conversation (id_conversation, id_utilisateur)
  ) CHARACTER SET utf8mb4;

-- TABLE message 
CREATE TABLE
  message (
    id_message INT AUTO_INCREMENT PRIMARY KEY,
    id_conversation INT NOT NULL,
    id_expediteur INT NOT NULL,
    contenu TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_message_conversation FOREIGN KEY (id_conversation) REFERENCES conversation (id_conversation) ON DELETE CASCADE,
    CONSTRAINT fk_message_expediteur FOREIGN KEY (id_expediteur) REFERENCES utilisateur (id_utilisateur) ON DELETE CASCADE
  ) CHARACTER SET utf8mb4;