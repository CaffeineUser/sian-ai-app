-- MySQL Database Schema for SianAI
CREATE DATABASE IF NOT EXISTS sianai_db;
USE sianai_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    store_name VARCHAR(100) NOT NULL,
    store_address TEXT,
    saldo_bisnis DECIMAL(15,2) DEFAULT 0.00,
    role VARCHAR(20) DEFAULT 'seller',
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Transaksi Table
CREATE TABLE IF NOT EXISTS transaksi (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    tanggal DATE NOT NULL,
    nama_barang VARCHAR(200) NOT NULL,
    total_nominal DECIMAL(15,2) NOT NULL,
    kategori ENUM('pemasukan', 'pengeluaran') NOT NULL,
    url_nota_fisik VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Kalender Adat Table
CREATE TABLE IF NOT EXISTS kalender_adat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_bulan VARCHAR(50) NOT NULL,
    musim_adat VARCHAR(100),
    bobot_pengali FLOAT DEFAULT 1.0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    nama_ulos VARCHAR(200) NOT NULL,
    harga_modal DECIMAL(15,2) NOT NULL,
    harga_jual DECIMAL(15,2) NOT NULL,
    tanggal_masuk DATE NOT NULL,
    status_stok ENUM('ready', 'unsold_90_days', 'terjual') DEFAULT 'ready',
    batas_diskon_aman DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Pengetahuan Adat VDB (Vector Database simulation table)
CREATE TABLE IF NOT EXISTS pengetahuan_adat_vdb (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jenis_ulos VARCHAR(100) NOT NULL,
    filosofi_dan_pakem TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Kalender Adat Reference
INSERT INTO kalender_adat (nama_bulan, musim_adat, bobot_pengali) VALUES
('Januari', 'Ulaon Unjuk / Pesta Pernikahan (Ramai)', 1.5),
('Februari', 'Pesta Mengket Rumah / Masuk Rumah Baru (Sedang)', 1.1),
('Maret', 'Ulaon Saur Matua / Pemakaman Adat (Stabil)', 1.0),
('April', 'Masa Tenang Pertanian (Sepi)', 0.6),
('Mei', 'Pesta Bona Taon (Ramai)', 1.4),
('Juni', 'Ulaon Unjuk / Pesta Pernikahan (Sangat Ramai)', 1.8),
('Juli', 'Musim Liburan Sekolah (Stabil)', 1.0),
('Agustus', 'Peringatan & Syukuran (Sedang)', 1.1),
('September', 'Masa Tanam Padi (Sepi)', 0.7),
('Oktober', 'Pesta Pembangunan Gereja / Adat (Sedang)', 1.2),
('November', 'Ulaon Saur Matua (Stabil)', 1.0),
('Desember', 'Pesta Pernikahan & Bona Taon (Sangat Ramai)', 1.9)
ON DUPLICATE KEY UPDATE bobot_pengali=VALUES(bobot_pengali);

-- Seed Pengetahuan Adat facts
INSERT INTO pengetahuan_adat_vdb (jenis_ulos, filosofi_dan_pakem) VALUES
('Ulos Ragidup', 'Pakem & Filosofi: Melambangkan kehidupan dan doa restu panjang umur. Merupakan ulos tertinggi derajatnya. Diberikan oleh orang tua pengantin wanita kepada pengantin pria dalam pesta perk Pernikahan (Ulaon Unjuk) sebagai simbol restu kehidupan baru.'),
('Ulos Sadum', 'Pakem & Filosofi: Melambangkan keceriaan, kegembiraan, dan kehangatan keluarga. Sangat cocok diberikan untuk syukuran melahirkan anak, masuk rumah baru, atau hadiah penghargaan prestasi. Warna dasarnya biasanya sangat cerah.'),
('Ulos Ragi Hotang', 'Pakem & Filosofi: Melambangkan ikatan kasih sayang yang kuat seperti rotan. Biasanya diberikan kepada sepasang pengantin baru sebagai simbol pengikat pernikahan yang kokoh dan tidak mudah patah dalam menjalani rintangan hidup.'),
('Ulos Bintang Maratur', 'Pakem & Filosofi: Melambangkan ketertiban, kebersamaan, dan kepatuhan dalam kehidupan keluarga agar rezeki mengalir teratur seperti bintang-bintang di langit. Ulos ini sering diberikan pada acara syukuran kehamilan tujuh bulan (Tujuh Bulanan).'),
('Ulos Mangiring', 'Pakem & Filosofi: Melambangkan iringan kesuksesan dan harapan kelak memiliki adik-adik yang banyak. Ulos ini biasanya diberikan oleh nenek/kakek (oppung) kepada cucu pertama yang baru lahir sebagai simbol kain gendongan.')
ON DUPLICATE KEY UPDATE filosofi_dan_pakem=VALUES(filosofi_dan_pakem);
