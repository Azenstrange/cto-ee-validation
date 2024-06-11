import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifOtpPage } from './verif-otp.page';

const routes: Routes = [
  {
    path: '',
    component: VerifOtpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifOtpPageRoutingModule {}
