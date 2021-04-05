import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { HoldingsComponent } from '@pages/holdings/holdings.component';
import { DexComponent } from '@pages/dex/dex.component';
import { DefiComponent } from '@pages/defi/defi.component';
import { CalculatorComponent } from '@pages/calculator/calculator.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'holdings', component: HoldingsComponent },
  { path: 'dex', component: DexComponent },
  { path: 'defi', component: DefiComponent },
  { path: 'calculator', component: CalculatorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
