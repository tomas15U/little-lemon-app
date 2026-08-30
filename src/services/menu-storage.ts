import * as SQLite from 'expo-sqlite';

import { MenuItem } from '@/types/menu-item';

const DATABASE_NAME = 'little_lemon';

function getDatabase() {
  return SQLite.openDatabaseAsync(DATABASE_NAME);
}

export async function initMenuTable(): Promise<void> {
  const db = await getDatabase();
  const columns = await db.getAllAsync<{ name: string }>('PRAGMA table_info(menu_items);');
  const hasCategoryColumn = columns.some((column) => column.name === 'category');

  if (columns.length > 0 && !hasCategoryColumn) {
    await db.execAsync('DROP TABLE menu_items;');
  }

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL
    );`
  );
}

export async function readMenuItems(): Promise<MenuItem[]> {
  const db = await getDatabase();
  return db.getAllAsync<MenuItem>(
    'SELECT name, price, description, image, category FROM menu_items;'
  );
}

export async function writeMenuItems(items: MenuItem[]): Promise<void> {
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    for (const item of items) {
      await db.runAsync(
        'INSERT INTO menu_items (name, price, description, image, category) VALUES (?, ?, ?, ?, ?);',
        [item.name, item.price, item.description, item.image, item.category]
      );
    }
  });
}

export async function getMenuCategories(): Promise<string[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ category: string }>(
    'SELECT DISTINCT category FROM menu_items ORDER BY category;'
  );
  return rows.map((row) => row.category);
}

export async function filterMenuItems(
  categories: string[],
  searchText: string
): Promise<MenuItem[]> {
  const db = await getDatabase();
  const conditions: string[] = [];
  const params: string[] = [];

  if (categories.length > 0) {
    conditions.push(`category IN (${categories.map(() => '?').join(', ')})`);
    params.push(...categories);
  }

  if (searchText.length > 0) {
    conditions.push('name LIKE ?');
    params.push(`%${searchText}%`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  return db.getAllAsync<MenuItem>(
    `SELECT name, price, description, image, category FROM menu_items ${whereClause};`,
    params
  );
}
