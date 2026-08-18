import { Component, OnInit } from '@angular/core';
import { Book } from './book.model';
import { BooksService } from './books.service';
import { AdminComponent } from './admin.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [AdminComponent]
})
export class App implements OnInit {
  readonly isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  books: Book[] = [];
  availabilityFilter: 'all' | 'available' | 'unavailable' = 'available';
  loading = false;
  errorMessage = '';

  constructor(private readonly booksService: BooksService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  onAvailabilityChange(value: 'all' | 'available' | 'unavailable'): void {
    this.availabilityFilter = value;
    this.loadBooks();
  }

  private loadBooks(): void {
    this.loading = true;
    this.errorMessage = '';

    let available: boolean | undefined;

    if (this.availabilityFilter === 'available') {
      available = true;
    } else if (this.availabilityFilter === 'unavailable') {
      available = false;
    } else {
      available = undefined;
    }

    this.booksService.getBooks(available).subscribe({
      next: (books) => {
        this.books = books;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'โหลดรายการหนังสือไม่สำเร็จ กรุณาตรวจสอบว่า backend รันอยู่';
        this.loading = false;
      }
    });
  }
}
