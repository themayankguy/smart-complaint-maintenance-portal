import secrets
import os

def generate_env():
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    
    if os.path.exists(env_path):
        print(".env file already exists. Skipping generation.")
        return

    secret_key = secrets.token_urlsafe(32)
    
    env_content = f"""# Database Configuration
# Format: mysql+pymysql://user:password@localhost:3306/dbname
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/scmp_db

# Security
SECRET_KEY={secret_key}
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
"""
    
    with open(env_path, "w") as f:
        f.write(env_content)
    
    print(f"✅ Generated new .env file at {env_path}")
    print("⚠️  ACTION REQUIRED: Edit the .env file and set your actual MySQL password.")

if __name__ == "__main__":
    generate_env()
