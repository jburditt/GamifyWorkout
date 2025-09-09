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
import { HttpClient } from '@angular/common/http';
import buildQuery from 'odata-query'

@Component({
  standalone: true,
  templateUrl: 'search.component.html',
  imports: [
    FormsModule, ReactiveFormsModule,
    MatPaginatorModule, MatIconModule, MatGridListModule, MatInputModule, MatDatepickerModule, MatTableModule,
    MatNativeDateModule, MatButtonModule,
  ]
})
export class SearchPageComponent implements AfterViewInit {
  searchForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
  });

  displayedColumns: string[] = ['firstName', 'lastName', 'username', 'email', 'edit'];
  dataSource = new MatTableDataSource<any>();

  constructor(private http: HttpClient, public router: Router) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onSubmit() {
    if (!this.searchForm.valid) {
      return;
    }
    console.log("searchForm", this.searchForm.value);
    const filter = { and: { FirstName: { contains: this.searchForm.value.firstName }, LastName: { contains: this.searchForm.value.lastName } } };
    const query = buildQuery({ filter });
    this.http.get<any[]>(`/api/User${query}`).subscribe((data) => {
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
