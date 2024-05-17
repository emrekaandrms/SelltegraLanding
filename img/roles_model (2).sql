-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1:3306
-- Üretim Zamanı: 25 Mar 2024, 09:46:50
-- Sunucu sürümü: 8.0.34-0ubuntu0.22.04.1
-- PHP Sürümü: 8.1.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `boolcrmdb`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `roles_model`
--

CREATE TABLE `roles_model` (
  `roles_model_id` int NOT NULL,
  `model` varchar(100) NOT NULL,
  `name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Tablo döküm verisi `roles_model`
--

INSERT INTO `roles_model` (`roles_model_id`, `model`, `name`) VALUES
(454, 'notifications', 'Bildirim Listeleme Sayfası'),
(455, 'notifications/data', 'Bildirim Listeleme Tablosu'),
(456, 'notifications/edit/:num', 'Bildirim Görüntüleme Sayfası'),
(457, 'notifications/delete', 'Bildirim Silme İşlemi'),
(458, 'lastvisitroute/data', 'Ziyaret Bildirimleri Listeleme Tablosu'),
(459, 'company/print', 'Firma Düzenleme - Firma Detay Çıktı'),
(460, 'company/visitroute', 'Firma Düzenleme - Ziyaret Rotası Oluşturma'),
(461, 'visitroute/add', 'Ziyaret Grubu Ekleme Sayfası'),
(462, 'visitroute/set', 'Ziyaret Grubu Ekleme İşlemi'),
(463, 'visitroute', 'Ziyaret Grubu Listeleme Sayfası'),
(464, 'visitroute/data', 'Ziyaret Grubu Listeleme İşlemi'),
(465, 'visitroute/edit/:num', 'Ziyaret Grubu Düzenleme Sayfası'),
(466, 'visitroute/update', 'Ziyaret Grubu düzenleme İşlemi'),
(467, 'visitroute/delete', 'Ziyaret Grubu Silme İşlemi'),
(468, 'company_vr/set', 'Ziyaret Rotası Ekleme İşlemi'),
(469, 'company_vr', 'Ziyaret Rota Listeleme Sayfası'),
(470, 'company_vr/data', 'Firma Ziyaret Rotalarının Listeleme İşlemi'),
(471, 'company_vr/update', 'Ziyaret Düzenleme İşlemi'),
(472, 'company_vr/add', 'Firma Ziyaret Rotası Ekle');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `roles_model`
--
ALTER TABLE `roles_model`
  ADD PRIMARY KEY (`roles_model_id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `roles_model`
--
ALTER TABLE `roles_model`
  MODIFY `roles_model_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=473;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
