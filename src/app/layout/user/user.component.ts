import { Component, OnInit } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserCreateComponent } from './user-create/user-create.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [routerTransition()]
})
export class UserComponent implements OnInit {
  constructor(private modalService: NgbModal) {}

  ngOnInit() {}

  open() {
    this.modalService.open(UserCreateComponent, { windowClass: 'dark-modal' });
  }
}
