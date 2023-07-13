import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { TicketServiceService } from 'src/app/services/ticket-service.service';
@Component({
  selector: 'app-bookingform',
  templateUrl: './bookingform.component.html',
  styleUrls: ['./bookingform.component.css'],
})
export class BookingformComponent {
  seats: number = 1;
  showToast: boolean = false;
  data: any[] = [];
  recentlyBookedSeats: number[] = [];
  constructor(private TicketServiceService: TicketServiceService) {
    this.TicketServiceService.data$.subscribe((data) => {
      this.data = [...data];
    });
  }

  onSubmit() {
    if (this.seats > 0 && this.seats <= 7) {
      this.TicketServiceService.bookSeats(this.seats).subscribe(data=>{
        this.TicketServiceService.updateData(data.result)
        this.recentlyBookedSeats= [...data.recentlyBookedseats]
        this.seats=1
      })

    }
  }

  Reset() {
    this.TicketServiceService.ResetBoard().subscribe((data) => {
      this.TicketServiceService.updateData(data.result)
      this.recentlyBookedSeats=[]
    });

  }
}
