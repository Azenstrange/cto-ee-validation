import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifOtpPageRoutingModule } from './verif-otp-routing.module';

import { VerifOtpPage } from './verif-otp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifOtpPageRoutingModule
  ],
  declarations: [VerifOtpPage]
})
export class VerifOtpPageModule {}
