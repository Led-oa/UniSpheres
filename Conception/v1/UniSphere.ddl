CREATE TABLE `user` (
  Id         int(10) NOT NULL AUTO_INCREMENT, 
  classeId   int(10) NOT NULL, 
  Matricule  varchar(255), 
  Name       varchar(255), 
  Lastname   varchar(255), 
  Email      varchar(255), 
  Profilepic varchar(255), 
  Password   varchar(255), 
  Role       int(10), 
  ClassId    int(10) NOT NULL, 
  Poste      varchar(255), 
  Created_at timestamp NULL, 
  Updated_at timestamp NULL, 
  PRIMARY KEY (Id)) CHARACTER SET UTF8;
CREATE TABLE annonce (
  Id         int(10) NOT NULL AUTO_INCREMENT, 
  userId     int(10) NOT NULL, 
  Title      varchar(255), 
  Content    varchar(255), 
  Posted_by  int(10) NOT NULL, 
  Created_at timestamp NULL, 
  Updated_at timestamp NULL, 
  PRIMARY KEY (Id)) CHARACTER SET UTF8;
CREATE TABLE classe (
  Id         int(10) NOT NULL AUTO_INCREMENT, 
  yearId     int(10) NOT NULL, 
  parcoursId int(10) NOT NULL, 
  filiereId  int(10) NOT NULL, 
  Name       varchar(255), 
  Created_at timestamp NULL, 
  Updated_at timestamp NULL, 
  PRIMARY KEY (Id)) CHARACTER SET UTF8;
CREATE TABLE filiere (
  Id         int(10) NOT NULL AUTO_INCREMENT, 
  Name       varchar(255), 
  Created_at timestamp NULL, 
  Updated_at timestamp NULL, 
  PRIMARY KEY (Id)) CHARACTER SET UTF8;
CREATE TABLE course (
  Id         int(10) NOT NULL AUTO_INCREMENT, 
  userId     int(10) NOT NULL, 
  classeId   int(10) NOT NULL, 
  Title      varchar(255), 
  Content    varchar(255), 
  Time       varchar(255), 
  Teach_by   int(10) NOT NULL, 
  Class      int(10) NOT NULL, 
  Created_at timestamp NULL, 
  Updated_at timestamp NULL, 
  PRIMARY KEY (Id)) CHARACTER SET UTF8;
CREATE TABLE conversation (
  Id         int(10) NOT NULL AUTO_INCREMENT, 
  Title      varchar(255), 
  Type       varchar(255), 
  Created_at timestamp NULL, 
  Updated_at timestamp NULL, 
  PRIMARY KEY (Id)) CHARACTER SET UTF8;
CREATE TABLE parcours (
  Id         int(10) NOT NULL AUTO_INCREMENT, 
  Name       varchar(255), 
  Created_at timestamp NULL, 
  Updated_at timestamp NULL, 
  PRIMARY KEY (Id)) CHARACTER SET UTF8;
CREATE TABLE year (
  Id         int(10) NOT NULL AUTO_INCREMENT, 
  Title      varchar(255), 
  Year       int(10) NOT NULL, 
  Created_at timestamp NULL, 
  Updated_at timestamp NULL, 
  PRIMARY KEY (Id)) CHARACTER SET UTF8;
CREATE TABLE conversationMember (
  Id             int(10) NOT NULL AUTO_INCREMENT, 
  conversationId int(10) NOT NULL, 
  userId         int(10) NOT NULL, 
  UserId         int(10) NOT NULL, 
  CoversationId  int(10) NOT NULL, 
  Joined_at      timestamp NULL, 
  Left_at        timestamp NULL, 
  PRIMARY KEY (Id)) CHARACTER SET UTF8;
CREATE TABLE message (
  Id             int(10) NOT NULL AUTO_INCREMENT, 
  conversationId int(10) NOT NULL, 
  userId         int(10) NOT NULL, 
  ConversationId int(10) NOT NULL, 
  SenderId       int(10) NOT NULL, 
  Content        varchar(255), 
  Created_at     timestamp NULL, 
  Updated_at     timestamp NULL, 
  PRIMARY KEY (Id)) CHARACTER SET UTF8;
ALTER TABLE classe ADD CONSTRAINT FKclasse869960 FOREIGN KEY (filiereId) REFERENCES filiere (Id);
ALTER TABLE classe ADD CONSTRAINT FKclasse145726 FOREIGN KEY (parcoursId) REFERENCES parcours (Id);
ALTER TABLE classe ADD CONSTRAINT FKclasse794763 FOREIGN KEY (yearId) REFERENCES year (Id);
ALTER TABLE course ADD CONSTRAINT FKcourse69561 FOREIGN KEY (classeId) REFERENCES classe (Id);
ALTER TABLE course ADD CONSTRAINT FKcourse968418 FOREIGN KEY (userId) REFERENCES `user` (Id);
ALTER TABLE `user` ADD CONSTRAINT FKuser897146 FOREIGN KEY (classeId) REFERENCES classe (Id);
ALTER TABLE annonce ADD CONSTRAINT FKannonce677478 FOREIGN KEY (userId) REFERENCES `user` (Id);
ALTER TABLE message ADD CONSTRAINT FKmessage495949 FOREIGN KEY (userId) REFERENCES `user` (Id);
ALTER TABLE message ADD CONSTRAINT FKmessage986709 FOREIGN KEY (conversationId) REFERENCES conversation (Id);
ALTER TABLE conversationMember ADD CONSTRAINT FKconversati202961 FOREIGN KEY (userId) REFERENCES `user` (Id);
ALTER TABLE conversationMember ADD CONSTRAINT FKconversati693721 FOREIGN KEY (conversationId) REFERENCES conversation (Id);
