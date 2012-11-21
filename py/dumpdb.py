# Convert file existing_db.db to SQL dump file dump.sql
import sqlite3, os

con = sqlite3.connect('measuredhs-mobile.db')
with open('dump.sql', 'w') as f:
    for line in con.iterdump():
        f.write(str(line.encode("utf-8")) + '\n')