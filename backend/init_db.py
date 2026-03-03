import pymysql
from app.database import settings

def init_db():
    # Parse the connection string (simplified)
    # mysql+pymysql://user:password@host:port/dbname
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
            port=int(port)
        )
        with connection.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_part}")
        print(f"✅ Database '{db_part}' checked/created successfully.")
        connection.close()
    except Exception as e:
        print(f"❌ Failed to connect/create database: {e}")
        print("Make sure your MySQL server is running and credentials in .env are correct.")

if __name__ == "__main__":
    init_db()
