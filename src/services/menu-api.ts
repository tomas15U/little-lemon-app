import { MenuItem } from '@/types/menu-item';

const MENU_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';

const IMAGE_BASE_URL =
  'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images';

export async function fetchMenuItems(): Promise<MenuItem[]> {
  const response = await fetch(MENU_URL);
  const json: { menu: MenuItem[] } = await response.json();
  return json.menu;
}

export function getMenuItemImageUrl(imageFileName: string): string {
  return `${IMAGE_BASE_URL}/${imageFileName}?raw=true`;
}
