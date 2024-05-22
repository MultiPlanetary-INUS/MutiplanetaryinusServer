/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 80025
Source Host           : localhost:3306
Source Database       : mutiplanetaryinus

Target Server Type    : MYSQL
Target Server Version : 80025
File Encoding         : 65001

Date: 2023-01-29 12:55:33
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for accounts
-- ----------------------------
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts` (
  `ID` bigint NOT NULL,
  `UserName` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `PassWord` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `BirthDay` datetime DEFAULT NULL,
  `Gender` tinyint DEFAULT NULL,
  `Gold` bigint NOT NULL DEFAULT '0',
  `Question` varchar(128) DEFAULT NULL,
  `Answer` varchar(128) DEFAULT NULL,
  `Sate` tinyint NOT NULL DEFAULT '0',
  `Authority` tinyint NOT NULL DEFAULT '0',
  `BlockType` tinyint NOT NULL DEFAULT '0',
  `BlockTime` datetime DEFAULT NULL,
  `CreateTime` datetime NOT NULL,
  `LastTime` datetime DEFAULT NULL,
  `LastIP` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=sjis;

-- ----------------------------
-- Table structure for buff
-- ----------------------------
DROP TABLE IF EXISTS `buff`;
CREATE TABLE `buff` (
  `RoleID` bigint NOT NULL,
  `BuffType` int NOT NULL,
  `Param1` bigint NOT NULL DEFAULT '0',
  `Param2` bigint DEFAULT '0',
  `Life` bigint NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Table structure for duplicatehistory
-- ----------------------------
DROP TABLE IF EXISTS `duplicatehistory`;
CREATE TABLE `duplicatehistory` (
  `RoleID` bigint NOT NULL,
  `DuplicateID` int NOT NULL,
  `DoneTime` datetime NOT NULL,
  `DayTimes` int DEFAULT '0',
  `WeekTimes` int DEFAULT '0',
  `MonthTimes` int DEFAULT '0',
  `YearTimes` int DEFAULT '0',
  `CountTimes` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=sjis;

-- ----------------------------
-- Table structure for quest
-- ----------------------------
DROP TABLE IF EXISTS `quest`;
CREATE TABLE `quest` (
  `RoleID` bigint NOT NULL,
  `QuestID` int NOT NULL,
  `AcceptTime` datetime NOT NULL,
  `State` int DEFAULT '0',
  `Processed` int DEFAULT '0',
  `Content1` int DEFAULT '0',
  `Content2` int DEFAULT '0',
  `Content3` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Table structure for questhistory
-- ----------------------------
DROP TABLE IF EXISTS `questhistory`;
CREATE TABLE `questhistory` (
  `RoleID` bigint NOT NULL,
  `QuestID` int NOT NULL,
  `DoneTime` datetime NOT NULL,
  `DayTimes` int DEFAULT '0',
  `WeekTimes` int DEFAULT '0',
  `MonthTimes` int DEFAULT '0',
  `YearTimes` int DEFAULT '0',
  `CountTimes` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=swe7;

-- ----------------------------
-- Table structure for roleitem
-- ----------------------------
DROP TABLE IF EXISTS `roleitem`;
CREATE TABLE `roleitem` (
  `ItemID` bigint NOT NULL,
  `RoleID` bigint NOT NULL,
  `TypeID` bigint NOT NULL,
  `Count` int NOT NULL DEFAULT '1',
  `Container` int NOT NULL DEFAULT '0',
  `Index` int NOT NULL DEFAULT '0',
  `Binded` tinyint NOT NULL DEFAULT '0',
  `Durability` int NOT NULL,
  `DurabilityMax` int NOT NULL,
  `Duration` int NOT NULL DEFAULT '-1',
  `GetTime` datetime NOT NULL,
  `TimesRemain` int DEFAULT '1',
  `Locked` tinyint DEFAULT '0',
  `LockedTime` datetime DEFAULT NULL,
  PRIMARY KEY (`ItemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `AccountsID` bigint NOT NULL,
  `RoleID` bigint NOT NULL,
  `RoleName` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `Vocation` tinyint NOT NULL,
  `Gender` tinyint NOT NULL,
  `Hair` int DEFAULT '0',
  `HairColor` int DEFAULT '0',
  `Face` int DEFAULT '0',
  `CreateTime` datetime NOT NULL,
  `LastTime` datetime DEFAULT NULL,
  `DelTime` datetime DEFAULT NULL,
  `State` tinyint(1) NOT NULL DEFAULT '0',
  `BlockType` tinyint DEFAULT NULL,
  `BlockTime` datetime DEFAULT NULL,
  PRIMARY KEY (`RoleID`)
) ENGINE=InnoDB DEFAULT CHARSET=swe7;

-- ----------------------------
-- Table structure for rolesattr
-- ----------------------------
DROP TABLE IF EXISTS `rolesattr`;
CREATE TABLE `rolesattr` (
  `RoleID` bigint NOT NULL,
  `Level` int NOT NULL DEFAULT '1',
  `CurHP` bigint DEFAULT '0',
  `CurMP` bigint DEFAULT '0',
  `CurExp` bigint DEFAULT '0',
  `Money` bigint DEFAULT '0',
  `GuildID` bigint DEFAULT '0',
  `GuildLevel` int DEFAULT '0',
  `MapID` int DEFAULT NULL,
  `PosX` float DEFAULT NULL,
  `PosY` float DEFAULT NULL,
  `PosZ` float DEFAULT NULL,
  `Direction` float DEFAULT '0',
  `Power` int DEFAULT '0',
  `Accurate` int DEFAULT '0',
  `Resistibility` int DEFAULT '0',
  `Vitality` int DEFAULT '0',
  `Lucky` int DEFAULT '0',
  `Cooling` int DEFAULT '0',
  `FreePoint` int DEFAULT '0',
  PRIMARY KEY (`RoleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Table structure for skill
-- ----------------------------
DROP TABLE IF EXISTS `skill`;
CREATE TABLE `skill` (
  `RoleID` bigint NOT NULL,
  `SkillID` int NOT NULL,
  `SkillLevel` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Procedure structure for CreateRole
-- ----------------------------
DROP PROCEDURE IF EXISTS `CreateRole`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateRole`(IN Act BIGINT, IN rid BIGINT, IN rname VARCHAR(32), IN vc INT, IN gd INT, IN ha INT, IN hc INT, IN fc INT)
BEGIN
	DECLARE TRID BIGINT;
	SELECT RoleID FROM roles WHERE RoleName=rname INTO TRID;
	
	IF NOT ISNULL(TRID) THEN  #??????
		SELECT -1 AS RoleID;
	ELSE
		UPDATE roles SET State=0 WHERE State=1 AND AccountsID=act;
		INSERT roles SET AccountsID=act, RoleID=rid, RoleName=rname, Vocation=vc, Gender=gd, Hair=ha, HairColor=hc, Face=fc, CreateTime=NOW(), State=1;
		SELECt rid AS RoleID; 
	END IF;

END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for LoginAccount
-- ----------------------------
DROP PROCEDURE IF EXISTS `LoginAccount`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `LoginAccount`(IN act VARCHAR(32), IN pwd VARCHAR(32), IN ip VARCHAR(16))
BEGIN
	DECLARE AccountID BIGINT;

	SELECT ID FROM accounts WHERE UserName=act AND  PassWord = pwd INTO AccountID;
	IF ISNULL(AccountID) THEN #??????
		SELECT -1 AS ID;
	ELSE
		SELECT * FROM accounts WHERE UserName=act AND PassWord = pwd;
		UPDATE accounts SET LastIP=ip, LastTime=NOW() WHERE UserName=act;
	END IF;
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for QueryRoleList
-- ----------------------------
DROP PROCEDURE IF EXISTS `QueryRoleList`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `QueryRoleList`(IN aid BIGINT)
BEGIN
	SELECT * FROM roles WHERE AccountsID=aid;
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for RegistAccount
-- ----------------------------
DROP PROCEDURE IF EXISTS `RegistAccount`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `RegistAccount`(IN id BIGINT, IN act VARCHAR(32), IN pwd VARCHAR(32), IN bd VARCHAR(32), IN gd INT, IN ip VARCHAR(16))
BEGIN
	DECLARE AccountID BIGINT;

	SELECT ID FROM accounts WHERE UserName=act INTO AccountID;

	IF NOT ISNULL(AccountID) THEN  #?????
		SELECT -1 AS ID;
	ELSE
		INSERT accounts SET ID=id, UserName=act, PassWord=pwd, BirthDay=bd, Gender=gd, CreateTime=NOW(), LastTime=NOW(), LastIP=ip;
		SELECT * FROM accounts WHERE ID=id AND UserName=act;
	END IF;

END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for UpdateBuff
-- ----------------------------
DROP PROCEDURE IF EXISTS `UpdateBuff`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateBuff`(IN rid BIGINT, IN bt INT, IN p1 BIGINT, IN p2 BIGINT, IN lf BIGINT)
BEGIN
	#Routine body goes here...
	DECLARE LT BIGINT;
	SELECT Life FROM buff WHERE RoleID=rid AND BuffType=bt INTO LT;

	IF ISNULL(LT) THEN
		INSERT buff SET RoleID=rid, BuffType=bt, Param1=p1, Param2=p2, Life=lf;
	ELSE
		UPDATE buff SET Param1=p1, Param2=p2, Life=lf WHERE RoleID=rid AND BuffType=bt;
	END IF;

END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for UpdateItem
-- ----------------------------
DROP PROCEDURE IF EXISTS `UpdateItem`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateItem`(IN itid BIGINT, IN roid BIGINT, IN tid INT, IN cnt INT, IN ct INT, IN idx INT, IN bind TINYINT, IN dul INT, IN dulmax INT, IN du INT, IN tr INT, IN lck TINYINT, IN gt VARCHAR(32),IN lkt VARCHAR(32))
BEGIN
	DECLARE TMD BIGINT;
	SET TMD = NULL;
	
	SELECT TypeID FROM roleitem WHERE ItemID=itid INTO TMD;
	
	IF NOT ISNULL(TMD) THEN #????
		UPDATE roleitem SET RoleID=roid, Count=cnt, Container=ct, `Index`=idx, Binded=bind, Durability=dul, DurabilityMax=dulmax, TimesRemain=tr, Duration=du, Locked=lck, LockedTime=lkt WHERE ItemID = itid;
	ELSE
		INSERT roleitem SET ItemID=itid, RoleID=roid, TypeID=tid, Count=cnt, Container=ct, `Index`=idx, Binded=bind, Durability=dul, DurabilityMax=dulmax, GetTime=gt, TimesRemain=tr, Duration=du, Locked=lck, LockedTime=lkt;
	END IF;
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for UpdateQuest
-- ----------------------------
DROP PROCEDURE IF EXISTS `UpdateQuest`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateQuest`(IN roid BIGINT, IN qid INT, IN sta INT, IN pr INT, IN ct1 INT, IN ct2 INT, IN ct3 INT)
BEGIN
	DECLARE TMD BIGINT;
	SET TMD = NULL;
	
	SELECT RoleID FROM quest WHERE RoleID=roid AND QuestID=qid INTO TMD;
	
	IF NOT ISNULL(TMD) THEN #????
		UPDATE quest SET State=sta, Processed=pr, Content1=ct1, Content2=ct2, Content3=ct3 WHERE RoleID=roid AND QuestID=qid;
	ELSE
		INSERT quest SET RoleID=roid, QuestID=qid, AcceptTime=NOW(), State=sta, Processed=pr, Content1=ct1, Content2=ct2, Content3=ct3;
	END IF;
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for UpdateSkill
-- ----------------------------
DROP PROCEDURE IF EXISTS `UpdateSkill`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateSkill`(IN rid BIGINT, IN sid INT, IN lvl INT)
BEGIN
	#Routine body goes here...
	DECLARE LT INT;
	SELECT SkillLevel FROM skill WHERE RoleID=rid AND SkillID=sid INTO LT;

	IF ISNULL(LT) THEN
		INSERT skill SET RoleID=rid, SkillID=sid, SkillLevel=lvl;
	ELSE
		UPDATE skill SET SkillLevel=lvl WHERE RoleID=rid AND SkillID=sid;
	END IF;

END
;;
DELIMITER ;
