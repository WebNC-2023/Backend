
DROP TABLE IF EXISTS "Users";
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