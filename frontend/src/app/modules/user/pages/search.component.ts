import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
//import { UserResponse } from '@app/api/models';
//import { UserService } from '@app/core/services/user.service';
import { DatePickerComponent } from '@app/shared/components/datepicker/date-picker.component';

@Component({
  standalone: true,
  templateUrl: 'search.component.html',
  imports: [
    NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault,
    FormsModule, ReactiveFormsModule,
    MatPaginatorModule, MatIconModule, MatGridListModule, MatInputModule, MatDatepickerModule, MatTableModule,
    MatNativeDateModule, MatButtonModule,
    DatePickerComponent
  ]
})
export class SearchPageComponent implements AfterViewInit {
  searchForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    createdFromDate: new FormControl('', []),
    createdToDate: new FormControl('', []),
    ceaseFromDate: new FormControl('', []),
    ceaseToDate: new FormControl('', []),
    userId: new FormControl(''),
    displayName: new FormControl(''),
    employeeId: new FormControl(''),
  });

  displayedColumns: string[] = ['firstName', 'lastName', 'userId', 'employeeId', 'edit'];
  dataSource = new MatTableDataSource<UserResponse>();

  constructor(private userService: UserService, private router: Router) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onSubmit() {
    if (!this.searchForm.valid) {
      return;
    }
    // TODO remove console.logs when search results are completed
    console.log("searchForm", this.searchForm.value);
    this.userService.search(this.searchForm.value).then(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      console.log("data", data);
    });
  }

  edit(id: number) {
    this.router.navigate([`/user/edit/${id}`]);
  }
}

export class UserSearchRequest {
  firstName: string | null = null;
  lastName: string | null = null;
}
