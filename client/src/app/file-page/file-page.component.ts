import { Component, OnInit } from '@angular/core';
import {FileService} from "../shared/services/file.service";
import {FileI} from "../shared/interfaces";
import {Observable} from "rxjs";

@Component({
  selector: 'app-file-page',
  templateUrl: './file-page.component.html',
  styleUrls: ['./file-page.component.css']
})
export class FilePageComponent implements OnInit {

  loading = false
  files$: Observable<FileI[]>

  constructor(private fileService: FileService) {
  }

  ngOnInit() {
    this.files$ = this.fileService.fetch()
  }

}
