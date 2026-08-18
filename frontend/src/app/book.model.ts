export type BookCategory = 'comic' | 'novel';

export interface Book {
  id: number;
  title: string;
  category: BookCategory;
  price: number;
  available: boolean;
  imageUrl: string;
  igUrl: string;
}
