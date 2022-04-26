import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Observable} from "rxjs";
import {FileI} from "../shared/interfaces";
import {FileService} from "../shared/services/file.service";
import {MaterialService} from "../shared/classes/material.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-open-file-page',
  templateUrl: './open-file-page.component.html',
  styleUrls: ['./open-file-page.component.css']
})
export class OpenFilePageComponent implements OnInit {

  loading = false
  file$: Observable<FileI>
  fileId: string
  file: string
  msg: string

  constructor(private route: ActivatedRoute,
              private fileService: FileService,
              private router: Router) { }

  async ngOnInit() {
    this.route.params.subscribe((params:Params) => {
      if(params['fileid']){
        this.fileId = params['fileid']
        this.file$ = this.fileService.fetchById(this.fileId)
      }
    })
    let temp = window.localStorage.getItem('auth-token')
    let r = await fetch(`/api/file/get/${this.fileId}`, {
      headers: {
        'Authorization': temp
      }})
    let data = await r.text()
    this.file = data
  }

  deleteFile(){
    const  decision = window.confirm("Вы уверены, что хотите удалить этот файл?")
    if(decision){
      return this.fileService.delete(this.fileId).subscribe(
        response => MaterialService.toast(response.message),
        error => MaterialService.toast(error.error.message),
        ()=> this.router.navigate(['file'])
      )
    }

  }

  async downloadFile(){
    let blob = new Blob([this.file], {
      type: "text/plain;charset=utf-8"
    });
    saveAs(blob, this.fileId);
  }

  async createShare(){
    let temp = window.localStorage.getItem('auth-token')
    let r = await fetch(`/api/file/share/c/${this.fileId}`, {
      method: 'POST',
      headers: {
        'Authorization': temp
      }})
    let data = await r.json()
    if (data == '[object Object]') {
      MaterialService.toast('Вы не являетесь владельцем этого файла.');
    } else {
      this.msg = `Ссылка для добавдения в доступ: http://localhost:4200/file/add/${data}`
    }
  }

  async removeAccess(){
    let temp = window.localStorage.getItem('auth-token')
    let r = await fetch(`/api/file/share/rmv/${this.fileId}`, {
      method: 'POST',
      headers: {
        'Authorization': temp
      }})
    let data = await r.json()
    MaterialService.toast(data.message)
  }

}
