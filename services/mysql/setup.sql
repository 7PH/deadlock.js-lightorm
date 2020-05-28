
SET NAMES utf8mb4;

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pseudo` varchar(22) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pseudo_custom` varchar(22) COLLATE utf8mb4_unicode_ci NOT NULL,
  `right` int(11) NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `points` int(11) NOT NULL DEFAULT '0',
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `old_password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `tms_created` int(11) NOT NULL,
  `tms_last_seen` int(11) NOT NULL,
  `ip_created` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_pseudo_unique` (`pseudo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;


-- 2020-05-28 12:46:17
