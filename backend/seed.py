import os
from dotenv import load_dotenv
import pymysql

load_dotenv()

def seed_database():
    connection = pymysql.connect(
        host=os.getenv("DB_HOST", "127.0.0.1"),
        port=int(os.getenv("DB_PORT", 3306)),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "sianai_db"),
        cursorclass=pymysql.cursors.DictCursor
    )
    
    try:
        with connection.cursor() as cursor:
            print("Seeding kalender_adat...")
            cursor.execute("""
            INSERT INTO kalender_adat (id, nama_bulan, musim_adat, bobot_pengali) VALUES
            (1, 'Januari', 'Ulaon Unjuk / Pesta Pernikahan (Ramai)', 1.5),
            (2, 'Februari', 'Pesta Mengket Rumah / Masuk Rumah Baru (Sedang)', 1.1),
            (3, 'Maret', 'Ulaon Saur Matua / Pemakaman Adat (Stabil)', 1.0),
            (4, 'April', 'Masa Tenang Pertanian (Sepi)', 0.6),
            (5, 'Mei', 'Pesta Bona Taon (Ramai)', 1.4),
            (6, 'Juni', 'Ulaon Unjuk / Pesta Pernikahan (Sangat Ramai)', 1.8),
            (7, 'Juli', 'Musim Liburan Sekolah (Stabil)', 1.0),
            (8, 'Agustus', 'Peringatan & Syukuran (Sedang)', 1.1),
            (9, 'September', 'Masa Tanam Padi (Sepi)', 0.7),
            (10, 'Oktober', 'Pesta Pembangunan Gereja / Adat (Sedang)', 1.2),
            (11, 'November', 'Ulaon Saur Matua (Stabil)', 1.0),
            (12, 'Desember', 'Pesta Pernikahan & Bona Taon (Sangat Ramai)', 1.9)
            ON DUPLICATE KEY UPDATE bobot_pengali=VALUES(bobot_pengali), musim_adat=VALUES(musim_adat), nama_bulan=VALUES(nama_bulan);
            """)
            
            print("Seeding pengetahuan_adat_vdb...")
            cursor.execute("""
            INSERT INTO pengetahuan_adat_vdb (id, jenis_ulos, filosofi_dan_pakem) VALUES
            (1, 'Ulos Ragidup', 'Pakem & Filosofi: Melambangkan kehidupan dan doa restu panjang umur. Merupakan ulos tertinggi derajatnya. Diberikan oleh orang tua pengantin wanita kepada pengantin pria dalam pesta pernikahan (Ulaon Unjuk) sebagai simbol restu kehidupan baru.'),
            (2, 'Ulos Sadum', 'Pakem & Filosofi: Melambangkan keceriaan, kegembiraan, dan kehangatan keluarga. Sangat cocok diberikan untuk syukuran melahirkan anak, masuk rumah baru, atau hadiah penghargaan prestasi. Warna dasarnya biasanya sangat cerah.'),
            (3, 'Ulos Ragi Hotang', 'Pakem & Filosofi: Melambangkan ikatan kasih sayang yang kuat seperti rotan. Biasanya diberikan kepada sepasang pengantin baru sebagai simbol pengikat pernikahan yang kokoh dan tidak mudah patah dalam menjalani rintangan hidup.'),
            (4, 'Ulos Bintang Maratur', 'Pakem & Filosofi: Melambangkan ketertiban, kebersamaan, dan kepatuhan dalam kehidupan keluarga agar rezeki mengalir teratur seperti bintang-bintang di langit. Ulos ini sering diberikan pada acara syukuran kehamilan tujuh bulan (Tujuh Bulanan).'),
            (5, 'Ulos Mangiring', 'Pakem & Filosofi: Melambangkan iringan kesuksesan dan harapan kelak memiliki adik-adik yang banyak. Ulos ini biasanya diberikan oleh nenek/kakek (oppung) kepada cucu pertama yang baru lahir sebagai simbol kain gendongan.')
            ON DUPLICATE KEY UPDATE filosofi_dan_pakem=VALUES(filosofi_dan_pakem), jenis_ulos=VALUES(jenis_ulos);
            """)
            
        connection.commit()
        print("Database seeded successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        connection.rollback()
    finally:
        connection.close()

if __name__ == "__main__":
    seed_database()
