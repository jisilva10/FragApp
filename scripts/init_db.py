import csv
import sqlite3
import os

DB_PATH = 'fragrantica.db'
CLEANED_CSV_PATH = '/Users/joseignaciosilva/.cache/kagglehub/datasets/olgagmiufana1/fragrantica-com-fragrance-dataset/versions/3/fra_cleaned.csv'
PERFUMES_CSV_PATH = '/Users/joseignaciosilva/.cache/kagglehub/datasets/olgagmiufana1/fragrantica-com-fragrance-dataset/versions/3/fra_perfumes.csv'

def init_db():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create perfumes table
    cursor.execute('''
        CREATE TABLE perfumes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            brand TEXT,
            gender TEXT,
            rating REAL,
            year TEXT,
            top_notes TEXT,
            middle_notes TEXT,
            base_notes TEXT,
            accords TEXT,
            description TEXT,
            url TEXT UNIQUE
        )
    ''')
    
    conn.commit()
    return conn

def populate_db(conn):
    cursor = conn.cursor()
    
    # We will use a dictionary to merge by URL
    perfumes_data = {}
    
    print("Reading fra_cleaned.csv...")
    with open(CLEANED_CSV_PATH, 'r', encoding='latin-1') as f:
        # Delimiter is semicolon
        reader = csv.DictReader(f, delimiter=';')
        for row in reader:
            url = row.get('url', '').strip()
            if not url:
                continue
            
            # Extract accords
            accords = []
            for i in range(1, 6):
                acc = row.get(f'mainaccord{i}')
                if acc:
                    accords.append(acc.strip())
            
            rating_str = row.get('Rating Value', '0').replace(',', '.')
            try:
                rating = float(rating_str)
            except ValueError:
                rating = 0.0
                
            perfumes_data[url] = {
                'name': row.get('Perfume', ''),
                'brand': row.get('Brand', ''),
                'gender': row.get('Gender', ''),
                'rating': rating,
                'year': row.get('Year', ''),
                'top_notes': row.get('Top', ''),
                'middle_notes': row.get('Middle', ''),
                'base_notes': row.get('Base', ''),
                'accords': ', '.join(accords),
                'url': url,
                'description': '' # Will be filled from fra_perfumes
            }
            
    print("Reading fra_perfumes.csv...")
    with open(PERFUMES_CSV_PATH, 'r', encoding='latin-1') as f:
        # Delimiter is comma
        reader = csv.DictReader(f)
        for row in reader:
            url = row.get('url', '').strip()
            if not url:
                continue
            
            description = row.get('Description', '').strip()
            
            if url in perfumes_data:
                perfumes_data[url]['description'] = description
                
    print(f"Inserting {len(perfumes_data)} perfumes into database...")
    count = 0
    
    for url, data in perfumes_data.items():
        cursor.execute('''
            INSERT INTO perfumes (
                name, brand, gender, rating, year, 
                top_notes, middle_notes, base_notes, accords, description, url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['name'], data['brand'], data['gender'], data['rating'], data['year'],
            data['top_notes'], data['middle_notes'], data['base_notes'], data['accords'], data['description'], data['url']
        ))
        count += 1
        
    conn.commit()
    print(f"Successfully inserted {count} records.")

if __name__ == '__main__':
    conn = init_db()
    populate_db(conn)
    conn.close()
    print("Database initialization complete.")
