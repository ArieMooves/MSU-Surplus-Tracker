import psycopg2
from faker import Faker
import random

# Database connection details 
DB_PARAMS = {
    "dbname": "postgres",
    "user": "postgres",
    "password": "postgres",
    "host": "localhost",
    "port": "5432" 
}

fake = Faker()
items = [
    "Dell Latitude Laptop", 
    "Herman Miller Chair", 
    "Epson Projector", 
    "Apple iPad Air", 
    "Lab Microscope",
    "Lenovo ThinkPad",
    "Steelcase Desk",
    "HP LaserJet Printer"
]
conditions = ["New", "Good", "Fair", "Poor"]
statuses = ["active", "surplus", "disposed"]

def seed_data():
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()

        
        print("Cleaning old database entries...")
        cur.execute("TRUNCATE TABLE assets RESTART IDENTITY CASCADE;")

        print("Seeding MSU Surplus Database with 5-digit tags...")

        for _ in range(25):
            # Generates a number between 40000 and 59999
            tag_number = random.randint(40000, 59999)
            asset_tag = str(tag_number) 
            
            item_name = random.choice(items)
            condition = random.choice(conditions)
            status = random.choice(statuses)
            
            
            cur.execute(
                """
                INSERT INTO assets (asset_tag, item_name, condition, current_status) 
                VALUES (%s, %s, %s, %s)
                """,
                (asset_tag, item_name, condition, status)
            )

        conn.commit()
        cur.close()
        conn.close()
        print("Successfully added 25 pseudo-assets starting with 4 or 5!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")

if __name__ == "__main__":
    seed_data()
