
DROP TABLE IF EXISTS "Users";
CREATE TABLE "Users" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "firstName" varchar(50) NOT NULL,
  "lastName" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL UNIQUE,
  "password" varchar(255) NOT NULL,
	"refreshToken" varchar(255),
	"avatar" varchar(255)
);
