import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Book } from './book.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  books: Book[] = [];
  editing: Partial<Book> = { title: '', category: 'novel', price: 0, available: true, imageUrl: '', igUrl: '' };
  isEditing = false;
  showForm = false;
  message = '';
  error = '';
  selectedImage?: File;
  imagePreview = '';

  constructor(private readonly http: HttpClient) { this.load(); }

  load(): void {
    this.http.get<Book[]>('/api/books').subscribe({ next: (books) => this.books = books, error: () => this.error = 'โหลดข้อมูลไม่สำเร็จ' });
  }

  edit(book: Book): void { this.editing = { ...book }; this.isEditing = true; this.showForm = true; this.selectedImage = undefined; this.imagePreview = book.imageUrl || ''; this.message = ''; }
  startNew(): void { this.editing = { title: '', category: 'novel', price: 0, available: true, imageUrl: '', igUrl: '' }; this.isEditing = false; this.showForm = true; this.selectedImage = undefined; this.imagePreview = ''; this.message = ''; this.error = ''; }
  cancel(): void { this.showForm = false; this.isEditing = false; this.selectedImage = undefined; this.imagePreview = ''; }
  chooseImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedImage = input.files?.[0];
    if (this.selectedImage) this.imagePreview = URL.createObjectURL(this.selectedImage);
  }

  save(): void {
    const persist = () => {
      const request = this.editing.id
        ? this.http.put<Book>(`/api/admin/books/${this.editing.id}`, this.editing)
        : this.http.post<Book>('/api/admin/books', this.editing);
      request.subscribe({ next: () => { this.message = 'บันทึกเรียบร้อย'; this.isEditing = false; this.selectedImage = undefined; this.load(); }, error: () => this.error = 'บันทึกไม่สำเร็จ' });
    };
    if (!this.selectedImage && !this.editing.id) { this.error = 'กรุณาเลือกไฟล์รูปปกจากเครื่อง'; return; }
    if (!this.selectedImage) { persist(); return; }
    const form = new FormData();
    form.append('file', this.selectedImage);
    this.http.post<{ imageUrl: string }>('/api/upload', form).subscribe({
      next: ({ imageUrl }) => { this.editing.imageUrl = imageUrl; persist(); },
      error: () => this.error = 'อัปโหลดรูปไม่สำเร็จ'
    });
  }

  remove(book: Book): void {
    if (!book.id || !confirm(`ลบ “${book.title}” ใช่หรือไม่`)) return;
    this.http.delete(`/api/admin/books/${book.id}`).subscribe({ next: () => { this.message = 'ลบเรียบร้อย'; this.load(); }, error: () => this.error = 'ลบไม่สำเร็จ' });
  }
}
