-- CreateTable
CREATE TABLE `admin` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `role` ENUM('owner', 'sales', 'marketing', 'IT') NOT NULL,
    `name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NOT NULL,
    `hashed_password` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NULL,
    `avatar` VARCHAR(255) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `amenity_property` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_property` INTEGER NULL,
    `name` TEXT NOT NULL,
    `name_eng` TEXT NOT NULL,
    `img_url` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avisos_privacidad` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` TEXT NULL,
    `html_content` LONGTEXT NULL,
    `active` BOOLEAN NULL,
    `slug` TEXT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `billing` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NULL,
    `billing_address` INTEGER NULL,
    `id_property` INTEGER NULL,
    `cp` VARCHAR(255) NULL,
    `rfc` VARCHAR(255) NULL,
    `real_estate_advisor` VARCHAR(255) NULL,
    `credit_type` INTEGER NULL,
    `status` ENUM('requested', 'proceseed') NULL,
    `notario` VARCHAR(255) NULL,
    `notaria` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_posts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `language` VARCHAR(10) NULL DEFAULT 'es',
    `region` VARCHAR(20) NULL,
    `post_author` VARCHAR(255) NOT NULL DEFAULT 'por Javer',
    `post_date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `post_date_gmt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `post_title` TEXT NOT NULL,
    `breadcrumb_title` VARCHAR(255) NULL,
    `post_name` VARCHAR(200) NULL,
    `post_excerpt` TEXT NULL,
    `description` TEXT NULL,
    `post_content` LONGTEXT NOT NULL,
    `post_image1` VARCHAR(255) NOT NULL DEFAULT '',
    `post_image2` VARCHAR(255) NOT NULL DEFAULT '',
    `post_status` VARCHAR(20) NOT NULL DEFAULT 'draft',
    `post_modified` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `post_modified_gmt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `version` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `post_content_filtered` LONGTEXT NULL,
    `post_type` VARCHAR(20) NOT NULL DEFAULT 'post',
    `post_mime_type` VARCHAR(100) NULL DEFAULT 'text/html',
    `permalink` VARCHAR(255) NOT NULL,
    `permalink_hash` VARCHAR(32) NOT NULL,
    `post_section` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT false,

    INDEX `permalink_idx`(`permalink`),
    INDEX `post_date_idx`(`post_date`),
    INDEX `post_status_idx`(`post_status`),
    INDEX `post_title_idx`(`post_title`(255)),
    INDEX `post_type_idx`(`post_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `city` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `id_state` INTEGER UNSIGNED NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),

    INDEX `city_state_fk`(`id_state`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `credit_type` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `thumb_image` VARCHAR(255) NULL,
    `external_link` VARCHAR(255) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `active` BOOLEAN NOT NULL,
    `page` ENUM('decalogo', 'avisos_privacidad', 'contratos_adhesion') NOT NULL,
    `section` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `keeper_old_posts` (
    `ID` INTEGER NULL,
    `post_author` INTEGER NULL,
    `post_date` VARCHAR(50) NULL,
    `post_date_gmt` VARCHAR(50) NULL,
    `post_content` VARCHAR(8192) NULL,
    `post_title` VARCHAR(128) NULL,
    `post_excerpt` VARCHAR(50) NULL,
    `post_status` VARCHAR(50) NULL,
    `comment_status` VARCHAR(50) NULL,
    `ping_status` VARCHAR(50) NULL,
    `post_password` VARCHAR(50) NULL,
    `post_name` VARCHAR(128) NULL,
    `to_ping` VARCHAR(50) NULL,
    `pinged` VARCHAR(50) NULL,
    `post_modified` VARCHAR(50) NULL,
    `post_modified_gmt` VARCHAR(50) NULL,
    `post_content_filtered` VARCHAR(50) NULL,
    `post_parent` INTEGER NULL,
    `guid` VARCHAR(50) NULL,
    `menu_order` INTEGER NULL,
    `post_type` VARCHAR(50) NULL,
    `post_mime_type` VARCHAR(50) NULL,
    `comment_count` INTEGER NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_activities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_admin` INTEGER NULL,
    `name` TEXT NULL,
    `email` TEXT NULL,
    `activity` LONGTEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lotes_form` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(255) NULL,
    `company` VARCHAR(255) NULL,
    `state` VARCHAR(255) NULL,
    `square_meters` VARCHAR(255) NULL,
    `message` TEXT NULL,
    `active` TINYINT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `media` (
    `media_id` INTEGER NOT NULL AUTO_INCREMENT,
    `media_data` VARCHAR(255) NOT NULL,
    `media_type` ENUM('image', 'video') NOT NULL,

    PRIMARY KEY (`media_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pdfs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `s3_url` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prices_list_property` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_property` INTEGER NULL,
    `name` TEXT NULL,
    `price_base` FLOAT NULL,
    `price_m2_ext` FLOAT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_city` INTEGER UNSIGNED NOT NULL,
    `type_project` ENUM('residences', 'land', 'building') NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `short_name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `description_eng` TEXT NULL DEFAULT (`description`),
    `long_description` LONGTEXT NULL,
    `long_description_eng` TEXT NULL DEFAULT (`long_description`),
    `logo_color` VARCHAR(255) NOT NULL,
    `logo_grey` VARCHAR(255) NULL,
    `video_url` VARCHAR(255) NOT NULL,
    `email_contact` VARCHAR(255) NULL,
    `phone_contact` VARCHAR(255) NULL,
    `featured` VARCHAR(255) NOT NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),
    `latitud` VARCHAR(255) NULL,
    `longitud` VARCHAR(255) NULL,
    `link_map` VARCHAR(255) NULL,
    `ciudad` VARCHAR(255) NULL,
    `colonia` VARCHAR(255) NULL,
    `calle` VARCHAR(255) NULL,
    `numero_ext` VARCHAR(255) NULL,
    `numero_int` VARCHAR(255) NULL,
    `cp` VARCHAR(255) NULL,

    INDEX `project_city_fk`(`id_city`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_credits` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_project` INTEGER UNSIGNED NOT NULL,
    `id_credit` INTEGER UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),

    INDEX `project_credits_credit_type_id_fk`(`id_credit`),
    INDEX `project_credits_project_fk`(`id_project`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_promo` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_project` INTEGER NOT NULL,
    `id_credit` INTEGER NOT NULL,
    `valid_until` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_property_blueprints` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_property` INTEGER UNSIGNED NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_property_images` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_property` INTEGER UNSIGNED NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),
    `order` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promo` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `square_image_url` VARCHAR(255) NULL,
    `banner_image_url` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `property` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_project` INTEGER UNSIGNED NULL,
    `type` VARCHAR(255) NULL,
    `name` VARCHAR(255) NULL,
    `short_name` VARCHAR(255) NULL,
    `description` LONGTEXT NULL,
    `description_eng` TEXT NULL DEFAULT (`description`),
    `rooms` INTEGER NULL,
    `bathrooms` INTEGER NULL,
    `restrooms` INTEGER NULL,
    `delivery_status` ENUM('ready_to_move', 'white building', 'gray building', 'preesale') NULL,
    `construction_status` VARCHAR(255) NULL,
    `architectural_plans_url` VARCHAR(255) NULL,
    `360_video` VARCHAR(255) NULL,
    `materport_video` VARCHAR(255) NULL,
    `cars_garage_capacity` INTEGER NULL,
    `cars_parking_lot_capacity` INTEGER NULL DEFAULT 0,
    `floors` INTEGER NULL,
    `square_meters` FLOAT NULL,
    `price_base_mxn` FLOAT NULL,
    `price_m2_extra_mxn` FLOAT NULL,
    `ubication` INTEGER NULL,
    `email_contact` VARCHAR(255) NULL,
    `phone_contact` VARCHAR(255) NULL,
    `featured` VARCHAR(255) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `main_image` TEXT NULL,
    `main_image_vertical` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `project_order` INTEGER NULL,
    `banner` TEXT NULL,

    INDEX `property_project_fk`(`id_project`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservas_form` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(255) NULL,
    `Apellido` VARCHAR(255) NULL,
    `Correo` VARCHAR(255) NULL,
    `Telefono` VARCHAR(255) NULL,
    `InfoTerreno` VARCHAR(255) NULL,
    `Estado` VARCHAR(255) NULL,
    `MetrosCuadrados` INTEGER NULL,
    `CodigoPostal` VARCHAR(10) NULL,
    `Hectareas` DECIMAL(10, 2) NULL,
    `PrecioPorMetroCuadrado` DECIMAL(10, 2) NULL,
    `Descripcion` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sections_footer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,
    `name_eng` TEXT NOT NULL,
    `path` TEXT NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT false,
    `section` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sections_navbar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,
    `path` TEXT NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT false,
    `name_eng` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `state` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stylings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` TEXT NULL,
    `value` TEXT NULL,
    `name` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ubication` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `colonia` VARCHAR(255) NULL,
    `city` INTEGER NOT NULL,
    `municipality` VARCHAR(255) NULL,
    `street` VARCHAR(255) NULL,
    `zip_code` VARCHAR(255) NOT NULL,
    `address_line_1` VARCHAR(255) NOT NULL,
    `address_line_2` VARCHAR(255) NULL,
    `longitude` VARCHAR(255) NULL,
    `latitude` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),
    `city_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `primary_email` VARCHAR(255) NULL,
    `secondary_email` VARCHAR(255) NULL,
    `primary_phone` VARCHAR(255) NULL,
    `secondary_phone` VARCHAR(255) NULL,
    `avatar` VARCHAR(255) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `password` VARCHAR(255) NULL,
    `auth_provider` ENUM('Google', 'Email', 'Facebook', 'Manual') NULL,
    `email_promos` BOOLEAN NULL DEFAULT true,
    `phone_promos` BOOLEAN NULL DEFAULT true,
    `ubication` INTEGER NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),
    `last_name` VARCHAR(255) NULL,
    `first_name` VARCHAR(255) NULL,

    UNIQUE INDEX `primary_email`(`primary_email`),
    UNIQUE INDEX `secondary_email`(`secondary_email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_favorites_property` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `id_property` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `city` ADD CONSTRAINT `city_state_fk` FOREIGN KEY (`id_state`) REFERENCES `state`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `project` ADD CONSTRAINT `project_city_fk` FOREIGN KEY (`id_city`) REFERENCES `city`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `project_credits` ADD CONSTRAINT `project_credits_credit_type_id_fk` FOREIGN KEY (`id_credit`) REFERENCES `credit_type`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `project_credits` ADD CONSTRAINT `project_credits_project_fk` FOREIGN KEY (`id_project`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
