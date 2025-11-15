CREATE TABLE `user` (
  IdUser     int(10) NOT NULL AUTO_INCREMENT, 
  classId    int(10) NOT NULL, 
  Matricule  varchar(255), 
  Name       varchar(255), 
  Lastname   varchar(255), 
  Email      varchar(255), 
  Profilepic varchar(255), 
  Password   varchar(255), 
  Role       int(10), 
  Poste      varchar(255), 
  Created_at timestamp NULL, 
  Updated_at timestamp NULL, 
  PRIMARY KEY (IdUser)) CHARACTER SET UTF8;
CREATE TABLE annonce (
  IdAnnonce  int(10) NOT NULL AUTO_INCREMENT, 
  Title      varchar(255), 
  Content    varchar(255), 
  posted_by  int(10) NOT NULL, 
  Created_at timestamp NULL, 
  Updated_at timestamp NULL, 
  PRIMARY KEY (IdAnnonce)) CHARACTER SET UTF8;
CREATE TABLE classe (
  IdClass    int(10) NOT NULL AUTO_INCREMENT, 
  Name       varchar(255), 
  yearId     int(10) NOT NULL, 
  parcoursId int(10) NOT NULL, 
  filiereId  int(10) NOT NULL, 
  Created_at timestamp NULL, 
  Updated_at timestamp NULL, 
  PRIMARY KEY (IdClass)) CHARACTER SET UTF8;
CREATE TABLE filiere (
  IdFiliere  int(10) NOT NULL AUTO_INCREMENT, 
  Name       varchar(255), 
  Created_at timestamp NULL, 
  Updated_at timestamp NULL, 
  PRIMARY KEY (IdFiliere)) CHARACTER SET UTF8;
CREATE TABLE course (
  IdCourse   int(10) NOT NULL AUTO_INCREMENT, 
  Title      varchar(255), 
  Content    varchar(255), 
  Time       varchar(255), 
  userId     int(10) NOT NULL, 
  classeId   int(10) NOT NULL, 
  Created_at timestamp NULL, 
  Updated_at timestamp NULL, 
  PRIMARY KEY (IdCourse)) CHARACTER SET UTF8;
CREATE TABLE conversation (
  IdConversation int(10) NOT NULL AUTO_INCREMENT, 
  Title          varchar(255), 
  Type           varchar(255), 
  Created_at     timestamp NULL, 
  Updated_at     timestamp NULL, 
  PRIMARY KEY (IdConversation)) CHARACTER SET UTF8;
CREATE TABLE parcours (
  IdParcours int(10) NOT NULL AUTO_INCREMENT, 
  Name       varchar(255), 
  Created_at timestamp NULL, 
  Updated_at timestamp NULL, 
  PRIMARY KEY (IdParcours)) CHARACTER SET UTF8;
CREATE TABLE year (
  IdYear     int(10) NOT NULL AUTO_INCREMENT, 
  Title      varchar(255), 
  Year       int(10) NOT NULL, 
  Created_at timestamp NULL, 
  Updated_at timestamp NULL, 
  PRIMARY KEY (IdYear)) CHARACTER SET UTF8;
CREATE TABLE conversationMember (
  IdConvoMember  int(10) NOT NULL AUTO_INCREMENT, 
  conversationId int(10) NOT NULL, 
  userId         int(10) NOT NULL, 
  Joined_at      timestamp NULL, 
  Left_at        timestamp NULL, 
  PRIMARY KEY (IdConvoMember)) CHARACTER SET UTF8;
CREATE TABLE message (
  IdMessage      int(10) NOT NULL AUTO_INCREMENT, 
  conversationId int(10) NOT NULL, 
  senderId       int(10) NOT NULL, 
  Content        varchar(255), 
  Created_at     timestamp NULL, 
  Updated_at     timestamp NULL, 
  PRIMARY KEY (IdMessage)) CHARACTER SET UTF8;
ALTER TABLE classe ADD CONSTRAINT FKclasse830639 FOREIGN KEY (filiereId) REFERENCES filiere (IdFiliere);
ALTER TABLE classe ADD CONSTRAINT FKclasse730787 FOREIGN KEY (parcoursId) REFERENCES parcours (IdParcours);
ALTER TABLE classe ADD CONSTRAINT FKclasse236762 FOREIGN KEY (yearId) REFERENCES year (IdYear);
ALTER TABLE course ADD CONSTRAINT FKcourse295972 FOREIGN KEY (classeId) REFERENCES classe (IdClass);
ALTER TABLE course ADD CONSTRAINT FKcourse77232 FOREIGN KEY (userId) REFERENCES `user` (IdUser);
ALTER TABLE `user` ADD CONSTRAINT FKuser322168 FOREIGN KEY (classId) REFERENCES classe (IdClass);
ALTER TABLE annonce ADD CONSTRAINT FKannonce668556 FOREIGN KEY (posted_by) REFERENCES `user` (IdUser);
ALTER TABLE message ADD CONSTRAINT FKmessage446984 FOREIGN KEY (senderId) REFERENCES `user` (IdUser);
ALTER TABLE message ADD CONSTRAINT FKmessage112668 FOREIGN KEY (conversationId) REFERENCES conversation (IdConversation);
ALTER TABLE conversationMember ADD CONSTRAINT FKconversati842689 FOREIGN KEY (userId) REFERENCES `user` (IdUser);
ALTER TABLE conversationMember ADD CONSTRAINT FKconversati405656 FOREIGN KEY (conversationId) REFERENCES conversation (IdConversation);
