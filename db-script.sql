DROP TABLE IF EXISTS "Users" CASCADE;
CREATE TABLE "Users" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "firstName" varchar(50),
  "lastName" varchar(50) NOT NULL,
  "email" varchar(100) NOT NULL UNIQUE,
  "isSSO" BOOLEAN DEFAULT FALSE,
  "password" varchar(255),
  "avatar" varchar(255),
  "activeCode" varchar(255),
  "resetPasswordCode" varchar(255)
);

DROP TABLE IF EXISTS "Classes" CASCADE;
CREATE TABLE "Classes" (
  "id" varchar(10) PRIMARY KEY NOT NULL,
  "name" varchar(100) NOT NULL,
  "part" varchar(100),
  "topic" varchar(100),
  "room" varchar(100),
  "avatar" varchar(255),
  "inviteTeacherCode" varchar(255),
  "ownerId" INT NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
  "dateCreated" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS "Attendance";
CREATE TABLE "Attendance" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "userId" INT NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
  "classId" varchar(10) NOT NULL REFERENCES "Classes"(id) ON DELETE CASCADE,
  "role" VARCHAR(10) CHECK (role IN ('teacher', 'student')) NOT NULL,
  UNIQUE ("userId", "classId")
);

INSERT INTO "Users"("firstName", "lastName", "email") 
VALUES ('Tan', 'Tân', 'duytan030522@gmail.com');

INSERT INTO "Classes"(id, "name", "ownerId") 
VALUES ('avc', 'new Class', 1);

INSERT INTO "Attendance"("userId", "classId", "role") 
VALUES (1, 'avc', 'teacher');

