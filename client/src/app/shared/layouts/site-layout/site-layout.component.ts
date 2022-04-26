import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent {

  links = [
    {url: '/file', name: 'Мои файлы'},
    {url: '/file/new', name: 'Добавить файл'}
  ]


  constructor(private auth: AuthService,
              private router: Router) {
  }


  logout(event: Event) {
    event.preventDefault()
    this.auth.logout()
    this.router.navigate(['/login'])

  }

}
