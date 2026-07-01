import os
from dotenv import load_dotenv
import pymysql

load_dotenv()

def clear_database():
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
            # Disable foreign key checks temporarily
            cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
            
            print("Clearing transactions...")
            cursor.execute("DELETE FROM transactions;")
            
            print("Clearing inventory items...")
            cursor.execute("DELETE FROM inventory_items;")
            
            # Re-enable foreign key checks
            cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
            
        connection.commit()
        print("Database cleared successfully!")
    except Exception as e:
        print(f"Error clearing database: {e}")
        connection.rollback()
    finally:
        connection.close()

if __name__ == "__main__":
    clear_database()
