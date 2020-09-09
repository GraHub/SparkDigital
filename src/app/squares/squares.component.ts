import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-squares',
  templateUrl: './squares.component.html',
  styleUrls: ['./squares.component.css']
})
export class SquaresComponent implements OnInit {

  clicked = '';
  lastClicked = '';


  constructor() {

  }

  ngOnInit() {
  }

  onClick(event) {

    this.lastClicked = this.clicked;
    this.clicked = event.currentTarget.id;

  }


}
