CREATE DATABASE  IF NOT EXISTS `restaurant` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `restaurant`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: restaurant
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `type` enum('Allergen') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dish`
--

DROP TABLE IF EXISTS `dish`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dish` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(5,2) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dish`
--

LOCK TABLES `dish` WRITE;
/*!40000 ALTER TABLE `dish` DISABLE KEYS */;
/*!40000 ALTER TABLE `dish` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dish_has_category`
--

DROP TABLE IF EXISTS `dish_has_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dish_has_category` (
  `dish_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`dish_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `dish_has_category_ibfk_1` FOREIGN KEY (`dish_id`) REFERENCES `dish` (`id`),
  CONSTRAINT `dish_has_category_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dish_has_category`
--

LOCK TABLES `dish_has_category` WRITE;
/*!40000 ALTER TABLE `dish_has_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `dish_has_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `date` date NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (4,NULL,'2024-11-18',0.00),(5,NULL,'2024-11-18',0.00),(6,NULL,'2024-11-18',0.00);
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_has_category`
--

DROP TABLE IF EXISTS `menu_has_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_has_category` (
  `menu_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`menu_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `menu_has_category_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`),
  CONSTRAINT `menu_has_category_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_has_category`
--

LOCK TABLES `menu_has_category` WRITE;
/*!40000 ALTER TABLE `menu_has_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `menu_has_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_has_dish`
--

DROP TABLE IF EXISTS `menu_has_dish`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_has_dish` (
  `menu_id` int NOT NULL,
  `dish_id` int NOT NULL,
  PRIMARY KEY (`menu_id`,`dish_id`),
  KEY `dish_id` (`dish_id`),
  CONSTRAINT `menu_has_dish_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`),
  CONSTRAINT `menu_has_dish_ibfk_2` FOREIGN KEY (`dish_id`) REFERENCES `dish` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_has_dish`
--

LOCK TABLES `menu_has_dish` WRITE;
/*!40000 ALTER TABLE `menu_has_dish` DISABLE KEYS */;
/*!40000 ALTER TABLE `menu_has_dish` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `time` enum('breakfast','lunch','dinner') NOT NULL,
  `guests` int NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'confirmed',
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reversation_has_table`
--

DROP TABLE IF EXISTS `reversation_has_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reversation_has_table` (
  `reservation_id` int NOT NULL,
  `table_id` int NOT NULL,
  `date` date NOT NULL,
  `time` enum('breakfast','lunch','dinner') DEFAULT NULL,
  PRIMARY KEY (`reservation_id`,`table_id`),
  UNIQUE KEY `table_id` (`table_id`,`date`,`time`),
  CONSTRAINT `reversation_has_table_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`),
  CONSTRAINT `reversation_has_table_ibfk_2` FOREIGN KEY (`table_id`) REFERENCES `table` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reversation_has_table`
--

LOCK TABLES `reversation_has_table` WRITE;
/*!40000 ALTER TABLE `reversation_has_table` DISABLE KEYS */;
/*!40000 ALTER TABLE `reversation_has_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rating` int NOT NULL,
  `comment` text NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `review_ibfk_1` (`user_id`),
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (3,1,'Great service!',21);
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `table`
--

DROP TABLE IF EXISTS `table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `location` enum('outside','inside') DEFAULT NULL,
  `number` int NOT NULL,
  `capacity` int NOT NULL,
  `status` enum('available','ocupied','reserved','maintenance') NOT NULL DEFAULT 'available',
  PRIMARY KEY (`id`),
  UNIQUE KEY `number` (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `table`
--

LOCK TABLES `table` WRITE;
/*!40000 ALTER TABLE `table` DISABLE KEYS */;
/*!40000 ALTER TABLE `table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(64) NOT NULL,
  `surname` varchar(64) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `role` enum('admin','client') DEFAULT 'client',
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (21,'andry.html@gmail.com','Andry','Reyes','1234567890','admin','$2a$10$SuTEoS4aTm87uUUqm1Y.we6Jf4dsSuhlpngQPBBJFMIRjGcs7n00u'),(40,'cabezon.rg@gmail.com','Cabezon','Reyes Garcia','637398857','client','$2a$10$U.2n6SZAaYCRyy4gHtSrAuZ73Hx8k4Ls9nsjMSJTbQS6TL2YB8LHq'),(41,'john.doe@example.com','John','Doe','123-456-7890','client','password123'),(42,'jane.smith@example.com','Jane','Smith','234-567-8901','client','password123'),(43,'michael.johnson@example.com','Michael','Johnson','345-678-9012','client','password123'),(44,'emily.brown@example.com','Emily','Brown','456-789-0123','client','password123'),(45,'chris.davis@example.com','Chris','Davis','567-890-1234','admin','password123'),(46,'laura.martin@example.com','Laura','Martin','678-901-2345','client','password123'),(47,'daniel.garcia@example.com','Daniel','Garcia','789-012-3456','client','password123'),(48,'sophia.anderson@example.com','Sophia','Anderson','890-123-4567','client','password123'),(49,'james.lee@example.com','James','Lee','901-234-5678','admin','password123'),(50,'olivia.clark@example.com','Olivia','Clark','012-345-6789','client','password123'),(51,'noah.thompson@example.com','Noah','Thompson','123-456-7891','client','password123'),(52,'mia.white@example.com','Mia','White','234-567-8902','client','password123'),(53,'liam.moore@example.com','Liam','Moore','345-678-9013','client','password123'),(54,'amelia.jackson@example.com','Amelia','Jackson','456-789-0124','client','password123'),(55,'benjamin.taylor@example.com','Benjamin','Taylor','567-890-1235','client','password123'),(56,'harper.martinez@example.com','Harper','Martinez','678-901-2346','admin','password123'),(57,'lucas.rodriguez@example.com','Lucas','Rodriguez','789-012-3457','client','password123'),(58,'ella.hall@example.com','Ella','Hall','890-123-4568','client','password123'),(59,'henry.young@example.com','Henry','Young','901-234-5679','client','password123'),(60,'grace.hernandez@example.com','Grace','Hernandez','012-345-6781','admin','password123'),(61,'jack.king@example.com','Jack','King','123-456-7892','client','password123'),(62,'isabella.scott@example.com','Isabella','Scott','234-567-8903','client','password123'),(63,'logan.green@example.com','Logan','Green','345-678-9014','client','password123'),(64,'sophia.adams@example.com','Sophia','Adams','456-789-0125','client','password123'),(65,'alexander.baker@example.com','Alexander','Baker','567-890-1236','client','password123'),(66,'emma.nelson@example.com','Emma','Nelson','678-901-2347','admin','password123'),(67,'ethan.carter@example.com','Ethan','Carter','789-012-3458','client','password123'),(68,'ava.perez@example.com','Ava','Perez','890-123-4569','client','password123'),(69,'mason.evans@example.com','Mason','Evans','901-234-5671','client','password123'),(70,'sophia.turner@example.com','Sophia','Turner','012-345-6782','client','password123'),(71,'logan.morris@example.com','Logan','Morris','123-456-7893','admin','password123'),(72,'chloe.collins@example.com','Chloe','Collins','234-567-8904','client','password123'),(73,'lucas.reed@example.com','Lucas','Reed','345-678-9015','client','password123'),(74,'lily.bell@example.com','Lily','Bell','456-789-0126','client','password123'),(75,'oliver.allen@example.com','Oliver','Allen','567-890-1237','client','password123'),(76,'sofia.ward@example.com','Sofia','Ward','678-901-2348','client','password123'),(77,'jacob.brooks@example.com','Jacob','Brooks','789-012-3459','admin','password123'),(78,'mia.cook@example.com','Mia','Cook','890-123-4561','client','password123'),(79,'daniel.rivera@example.com','Daniel','Rivera','901-234-5672','client','password123');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-20 11:02:36
