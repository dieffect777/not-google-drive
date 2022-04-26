import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FileService} from "../shared/services/file.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-add-file-page',
  templateUrl: './add-file-page.component.html',
  styleUrls: ['./add-file-page.component.css']
})
export class AddFilePageComponent implements OnInit {

  @ViewChild('input') inputRef: ElementRef
  form: FormGroup
  file: File
  fileNamePreview: string
  constructor(private fileService: FileService,
              private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })
  }

  onFileUpload(event: any){
    const file = event.target.files[0]
    this.fileNamePreview = file.name
    this.file = file
    this.form.enable()
  }

  triggerClick(){
    this.inputRef.nativeElement.click()
  }

  onSubmit(){
    let obs$
    this.form.disable()
    obs$ = this.fileService.create(this.form.value.name, this.file)
    obs$.subscribe(
      file =>{
        this.file = file
        this.router.navigate(['/file'])
        this.form.enable()
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }
}
