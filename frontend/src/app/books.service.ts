import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Book } from './book.model';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private readonly apiBaseUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3100'
    : '/api';
  private readonly staticBooks: Book[] = [
    { id: 1, title: 'Nightmare Error', category: 'novel', price: 30, available: true, imageUrl: '/books/NightmareError.png', igUrl: 'https://www.instagram.com/my_little_shelf_/' },
    { id: 2, title: 'คดีฆาตกรรมในคฤหาสน์กังหันทดน้ำ', category: 'novel', price: 35, available: true, imageUrl: '/books/คดีฆาตกรรมในคฤหาสน์กังหันทดน้ำ.png', igUrl: 'https://www.instagram.com/my_little_shelf_/' },
    { id: 3, title: 'ฆาตกรมนุษย์กบกับศพปริศนา', category: 'novel', price: 35, available: false, imageUrl: '/books/ฆาตกรมนุษย์กบกับศพปริศนา.png', igUrl: 'https://www.instagram.com/my_little_shelf_/' },
    { id: 4, title: 'เกิดเป็นหญิงเริดบ้างร้ายบ้างดีออก', category: 'novel', price: 25, available: true, imageUrl: '/books/เกิดเป็นหญิงเริดบ้างร้ายบ้างดีออก.jpg', igUrl: 'https://www.instagram.com/my_little_shelf_/' },
    { id: 5, title: 'เดนดาว Never Die', category: 'novel', price: 25, available: true, imageUrl: '/books/เดนดาวNeverDie.jpeg', igUrl: 'https://www.instagram.com/my_little_shelf_/' },
  ];

  constructor(private readonly http: HttpClient) {}

  getBooks(available?: boolean): Observable<Book[]> {
    let params = new HttpParams();

    if (available !== undefined) {
      params = params.set('available', String(available));
    }

    return this.http.get<Book[]>(`${this.apiBaseUrl}/books`, { params }).pipe(
      catchError(() => of(this.filterBooks(available)))
    );
  }

  private filterBooks(available?: boolean): Book[] {
    return available === undefined
      ? this.staticBooks
      : this.staticBooks.filter((book) => book.available === available);
  }
}
