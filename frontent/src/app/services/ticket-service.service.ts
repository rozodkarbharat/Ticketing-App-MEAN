import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketServiceService implements OnInit {
  private dataSubject = new Subject<any>();
  data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  getData(): Observable<any> {
    return this.http.get<any>('https://ticketing-1lak.onrender.com/getseats');
  }

  ResetBoard(): Observable<any> {
    return this.http.patch<any>('https://ticketing-1lak.onrender.com/reset', {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  updateData(data: any) {
    this.dataSubject.next(data);
  }
  bookSeats(numberOfSeats:number): Observable<any> {
    console.log(numberOfSeats,"book")
    return this.http.post<any>('https://ticketing-1lak.onrender.com/book',{
      headers: { 'Content-Type': 'application/json'},
      numberOfSeats
    })
  }
}
