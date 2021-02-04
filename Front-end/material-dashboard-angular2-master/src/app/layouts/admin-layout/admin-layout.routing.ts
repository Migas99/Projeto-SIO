import { Routes } from '@angular/router';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { VendasComponent } from '../../vendas/vendas.component';
import { FornecimentoComponent } from '../../fornecimento/fornecimento.component';
import { AuthenticationGuard } from '../../guards/authentication/authentication.guard';
import { UploadFileComponent } from 'app/components/upload-file/upload-file.component';

export const AdminLayoutRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'vendas',
    component: VendasComponent,
  },
  {
    path: 'fornecimento',
    component: FornecimentoComponent,
  },
  {
    path: 'import_saft',
    component: UploadFileComponent,
  },
];
