import { Component } from '@angular/core';
import { TicketServiceService } from 'src/app/services/ticket-service.service';
import { OnInit } from '@angular/core'
import { Subject } from 'rxjs';
@Component({
  selector: 'app-seats-grid',
  templateUrl: './seats-grid.component.html',
  styleUrls: ['./seats-grid.component.css']
})
export class SeatsGridComponent implements OnInit {

  data:any[]=[]


  constructor(private TicketServiceService:TicketServiceService){
    this.TicketServiceService.data$.subscribe(data => {
      this.data = [...data];
    });
  }

  ngOnInit() {
    this.fetchData()
  }

  fetchData(): void {
    this.TicketServiceService.getData().subscribe(
      (data) => {
        this.data=[...data]
        this.TicketServiceService.updateData(data)
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }

}
