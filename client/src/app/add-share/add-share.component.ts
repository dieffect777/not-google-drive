import { Component, OnInit } from '@angular/core';
import {MaterialService} from "../shared/classes/material.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-add-share',
  templateUrl: './add-share.component.html',
  styleUrls: ['./add-share.component.css']
})
export class AddShareComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router) { }

  shareHash: string

  async ngOnInit() {
    this.route.params.subscribe((params:Params) => {
      if(params['sharehash']){
        this.shareHash = params['sharehash']
      }
    })
    let temp = window.localStorage.getItem('auth-token')
    let r = await fetch(`/api/file/share/add/${this.shareHash}`, {
      method: 'POST',
      headers: {
        'Authorization': temp
      }})
    let data = await r.json()
    await this.router.navigate(['/file'])
    MaterialService.toast(data.message)
  }

}
