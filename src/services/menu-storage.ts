import * as SQLite from 'expo-sqlite';

import { MenuItem } from '@/types/menu-item';

const DATABASE_NAME = 'little_lemon';

function getDatabase() {
  return SQLite.openDatabaseAsync(DATABASE_NAME);
}

export async function initMenuTable(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL
    );`
  );
}

export async function readMenuItems(): Promise<MenuItem[]> {
  const db = await getDatabase();
  return db.getAllAsync<MenuItem>('SELECT name, price, description, image FROM menu_items;');
}

export async function writeMenuItems(items: MenuItem[]): Promise<void> {
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    for (const item of items) {
      await db.runAsync(
        'INSERT INTO menu_items (name, price, description, image) VALUES (?, ?, ?, ?);',
        [item.name, item.price, item.description, item.image]
      );
    }
  });
}
