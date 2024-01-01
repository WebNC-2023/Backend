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
  "orderAssignment" varchar(255),
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

DROP TABLE IF EXISTS "AttendanceInvite";
CREATE TABLE "AttendanceInvite" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "email" varchar(100) NOT NULL,
  "classId" varchar(10) NOT NULL REFERENCES "Classes"(id) ON DELETE CASCADE,
  "role" VARCHAR(10) CHECK (role IN ('teacher', 'student')) NOT NULL,
  UNIQUE ("email", "classId")
);

DROP TABLE IF EXISTS "AttendanceInvite";
CREATE TABLE "AttendanceInvite" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "email" varchar(100) NOT NULL,
  "classId" varchar(10) NOT NULL REFERENCES "Classes"(id) ON DELETE CASCADE,
  "role" VARCHAR(10) CHECK (role IN ('teacher', 'student')) NOT NULL,
  UNIQUE ("email", "classId")
);

DROP TABLE IF EXISTS "Assignments" CASCADE;
CREATE TABLE "Assignments" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "classId" varchar(10) NOT NULL REFERENCES "Classes"(id) ON DELETE CASCADE,
  "title" VARCHAR(255) NOT NULL,
  "description" VARCHAR(255),
  "deadline" TIMESTAMP,
  "type" VARCHAR(10) CHECK (type IN ('exercise', 'exam')) NOT NULL,
  "dateCreated" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS "Scores" CASCADE;
CREATE TABLE "Scores" (
  "id" SERIAL PRIMARY KEY NOT NULL ,
  "studentId" INT NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
  "assignmentId" INT NOT NULL REFERENCES "Assignments"(id) ON DELETE CASCADE,
  "score" INT,
  "isReturned" BOOLEAN DEFAULT FALSE,
  UNIQUE ("studentId", "assignmentId")
);

DROP TABLE IF EXISTS "Reviews" CASCADE;
CREATE TABLE "Reviews" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "scoreId" INT NOT NULL UNIQUE REFERENCES "Scores"(id) ON DELETE CASCADE,
  "expectScore" INT NOT NULL,
  "explanation" VARCHAR(255),
  "scoreAgain" INT NOT NULL,
);

DROP TABLE IF EXISTS "Comments";
CREATE TABLE "Comments" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "userId" INT NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
  "reviewId" INT NOT NULL REFERENCES "Reviews"(id) ON DELETE CASCADE,
  "comment" varchar(255) NOT NULL,
  "dateCreated" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

