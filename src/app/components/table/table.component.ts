import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { TokenService } from 'src/app/services/token.service';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { AuthService } from 'src/app/services/auth.service';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  values: any[] = [];
  isLoading: boolean = true;
  million = Math.pow(10, 6);
  quoteName: string = '';
  hasError: boolean = false;
  error: string = '';


  constructor(
    private dataService: DataService,
    private tokenService: TokenService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    if (this.tokenService.getToken()) {
      this.loadData();
    } else {
      this.dataService.getToken().subscribe(res => {
        if (res) {
          this.tokenService.saveToken(res.access_token);
          this.tokenService.saveRefreshToken(res.refresh_token);
          this.loadData();
        }
      }, err => {
        console.log('Error getting token!!! -->', err.status, err.error.error_description);
      });
    }   
    
  }

  loadData() {

    this.dataService.getItemData().subscribe(res => {
      let name_url = res.links[0].href;
      this.dataService.getItemName(name_url).subscribe(res => {
        this.quoteName = res.quotes[0]['fields']['M_NAME'].v;
      }, err => console.log('Error getting item name!!! -->', err.status, err.error.error_description));
      this.values.push(res.quotes[0].fields);
      this.isLoading = false;
    }, err => {      
      console.log('Error getting data!!! -->', err.status,err.error.error_description);
    });

  }

}
