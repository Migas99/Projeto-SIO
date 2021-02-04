import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UploadFileComponent } from './upload-file/upload-file.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [NavbarComponent, SidebarComponent, UploadFileComponent],
  exports: [NavbarComponent, SidebarComponent],
})
export class ComponentsModule {}
