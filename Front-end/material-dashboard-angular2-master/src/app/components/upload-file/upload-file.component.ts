import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'app/services/api/api.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css'],
})
export class UploadFileComponent implements OnInit {
  form: FormGroup;
  file: File;
  uploading: boolean = false;
  constructor(
    private api: ApiService,
    public fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      file: [null],
    });
  }

  onFileSelect(event): void {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.form.patchValue({
        file: this.file,
      });
    }
  }

  public onSubmit(): void {
    if (!this.uploading) {
      this.uploading = true;
      const formData: any = new FormData();
      formData.append('file', this.form.get('file').value);
      this.api.fileUpload(formData).subscribe(
        (res) => {
          this.uploading = false;
          this.router.navigate(['/']).then(() => window.location.reload());
        },
        (err) => {
          this.uploading = false;
          console.log(err);
        }
      );
    }
  }
}
