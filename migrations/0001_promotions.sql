-- Apply once to the customer's dedicated D1 database. Never replace saved posts on deploy.
CREATE TABLE IF NOT EXISTS promo_board (id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL, posts TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS promo_images (id TEXT PRIMARY KEY, bytes BLOB NOT NULL CHECK(length(bytes)<=1000000), created_at TEXT NOT NULL);
