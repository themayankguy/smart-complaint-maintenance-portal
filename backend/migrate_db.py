import pymysql
from app.database import settings

def migrate_db():
    print("🚀 Starting Database Migration...")
    url = settings.DATABASE_URL.replace("mysql+pymysql://", "")
    auth_part, db_part = url.split("/")
    user_pass, host_port = auth_part.split("@")
    user, password = user_pass.split(":")
    host, port = host_port.split(":") if ":" in host_port else (host_port, 3306)

    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            port=int(port),
            database=db_part
        )
        with connection.cursor() as cursor:
            # Add category column
            try:
                cursor.execute("ALTER TABLE complaints ADD COLUMN category VARCHAR(50) DEFAULT 'General'")
                print("✅ Added 'category' column to 'complaints' table.")
            except pymysql.err.OperationalError as e:
                # 1060 is "Duplicate column name"
                if e.args[0] == 1060:
                    print("ℹ️ Column 'category' already exists. Skipping.")
                else:
                    raise e
            
            # Add resolved_at column
            try:
                cursor.execute("ALTER TABLE complaints ADD COLUMN resolved_at DATETIME")
                print("✅ Added 'resolved_at' column to 'complaints' table.")
            except pymysql.err.OperationalError as e:
                if e.args[0] == 1060:
                    print("ℹ️ Column 'resolved_at' already exists. Skipping.")
                else:
                    raise e
                    
        connection.commit()
        connection.close()
        print("✨ Migration completed successfully.")
    except Exception as e:
        print(f"❌ Migration failed: {e}")

if __name__ == "__main__":
    migrate_db()
