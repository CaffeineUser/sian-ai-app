import os
import sqlite3
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "sianai_db")

# Fallback mechanism if mysql-connector is not installed
USE_MYSQL = False
try:
    import mysql.connector
    from mysql.connector import pooling
    USE_MYSQL = True
    print("Database: Using MySQL database connection.")
except ImportError:
    print("Database WARNING: mysql-connector-python is not installed. Falling back to local SQLite database.")

class Database:
    def __init__(self):
        self.sqlite_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "sianai_db.sqlite")
        os.makedirs(os.path.dirname(self.sqlite_path), exist_ok=True)
        
        self.mysql_pool = None
        if USE_MYSQL:
            try:
                self.mysql_pool = mysql.connector.pooling.MySQLConnectionPool(
                    pool_name="sianai_pool",
                    pool_size=5,
                    host=DB_HOST,
                    port=int(DB_PORT),
                    user=DB_USER,
                    password=DB_PASSWORD,
                    database=DB_NAME
                )
            except Exception as e:
                print(f"MySQL Connection Error: {e}. Falling back to SQLite.")
                self.mysql_pool = None
                
        # Initialize tables
        self.init_db()

    def get_connection(self):
        if USE_MYSQL and self.mysql_pool:
            try:
                return self.mysql_pool.get_connection()
            except Exception:
                # Fallback to sqlite if pool fails
                pass
        
        # SQLite connection
        conn = sqlite3.connect(self.sqlite_path)
        # Enable dictionary-like rows for SQLite
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        """Initializes database tables."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Users Table
        users_sql = """
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(36) PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            phone VARCHAR(20) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            store_name VARCHAR(100) NOT NULL,
            store_address TEXT,
            saldo_bisnis DECIMAL(15,2) DEFAULT 0.00,
            role VARCHAR(20) DEFAULT 'seller',
            is_active TINYINT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        
        # Transaksi Table
        transaksi_sql = """
        CREATE TABLE IF NOT EXISTS transaksi (
            id VARCHAR(36) PRIMARY KEY,
            user_id VARCHAR(36) NOT NULL,
            tanggal DATE NOT NULL,
            nama_barang VARCHAR(200) NOT NULL,
            total_nominal DECIMAL(15,2) NOT NULL,
            kategori VARCHAR(20) NOT NULL,
            url_nota_fisik VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        """
        
        # Kalender Adat Table
        kalender_adat_sql = """
        CREATE TABLE IF NOT EXISTS kalender_adat (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama_bulan VARCHAR(50) NOT NULL,
            musim_adat VARCHAR(100),
            bobot_pengali FLOAT DEFAULT 1.0
        );
        """ if not USE_MYSQL else """
        CREATE TABLE IF NOT EXISTS kalender_adat (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nama_bulan VARCHAR(50) NOT NULL,
            musim_adat VARCHAR(100),
            bobot_pengali FLOAT DEFAULT 1.0
        );
        """

        # Inventory Table
        inventory_sql = """
        CREATE TABLE IF NOT EXISTS inventory (
            id VARCHAR(36) PRIMARY KEY,
            user_id VARCHAR(36) NOT NULL,
            nama_ulos VARCHAR(200) NOT NULL,
            harga_modal DECIMAL(15,2) NOT NULL,
            harga_jual DECIMAL(15,2) NOT NULL,
            jumlah_stok INT DEFAULT 1,
            tanggal_masuk DATE NOT NULL,
            status_stok VARCHAR(30) DEFAULT 'ready',
            batas_diskon_aman DECIMAL(15,2) DEFAULT 0.00,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        """

        # Pengetahuan Adat VDB Table
        pengetahuan_adat_vdb_sql = """
        CREATE TABLE IF NOT EXISTS pengetahuan_adat_vdb (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            jenis_ulos VARCHAR(100) NOT NULL,
            filosofi_dan_pakem TEXT NOT NULL
        );
        """ if not USE_MYSQL else """
        CREATE TABLE IF NOT EXISTS pengetahuan_adat_vdb (
            id INT AUTO_INCREMENT PRIMARY KEY,
            jenis_ulos VARCHAR(100) NOT NULL,
            filosofi_dan_pakem TEXT NOT NULL
        );
        """
        
        if USE_MYSQL and self.mysql_pool:
            try:
                cursor.execute(users_sql)
                cursor.execute(transaksi_sql)
                cursor.execute(kalender_adat_sql)
                cursor.execute(inventory_sql)
                cursor.execute(pengetahuan_adat_vdb_sql)
                conn.commit()
                # Run migration to add column if it doesn't exist
                try:
                    cursor.execute("ALTER TABLE inventory ADD COLUMN jumlah_stok INT DEFAULT 1")
                    conn.commit()
                except Exception:
                    pass
            except Exception as e:
                print(f"Error initializing MySQL tables: {e}")
            finally:
                cursor.close()
                conn.close()
        else:
            cursor.execute(users_sql)
            cursor.execute(transaksi_sql)
            cursor.execute(kalender_adat_sql)
            cursor.execute(inventory_sql)
            cursor.execute(pengetahuan_adat_vdb_sql)
            conn.commit()
            # Run migration for sqlite
            try:
                cursor.execute("ALTER TABLE inventory ADD COLUMN jumlah_stok INT DEFAULT 1")
                conn.commit()
            except Exception:
                pass
            cursor.close()
            conn.close()

    def execute_query(self, query, params=(), fetch_one=False, fetch_all=False):
        """Helper to run queries safely."""
        conn = self.get_connection()
        
        try:
            is_mysql = USE_MYSQL and self.mysql_pool and not isinstance(conn, sqlite3.Connection)
            if is_mysql:
                cursor = conn.cursor(dictionary=True)
            else:
                cursor = conn.cursor()
                
            # SQLite uses '?' placeholder, MySQL uses '%s' placeholder
            if not is_mysql:
                query = query.replace("%s", "?")
                
            cursor.execute(query, params)
            
            if fetch_one:
                row = cursor.fetchone()
                if row:
                    return dict(row)
                return None
            elif fetch_all:
                rows = cursor.fetchall()
                return [dict(r) for r in rows]
                
            conn.commit()
            return True
        except Exception as e:
            print(f"Database Query Error: {e}")
            return None
        finally:
            if 'cursor' in locals():
                cursor.close()
            conn.close()

db = Database()
