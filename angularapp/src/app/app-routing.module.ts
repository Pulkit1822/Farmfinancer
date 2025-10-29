import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AdminnavComponent } from './components/adminnav/adminnav.component';
import { UsernavComponent } from './components/usernav/usernav.component';
import { ErrorComponent } from './components/error/error.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { UserviewloanComponent } from './components/userviewloan/userviewloan.component';
import { CreateLoanComponent } from './components/createloan/createloan.component';
import { ViewloanComponent } from './components/viewloan/viewloan.component';
import { RequestedloanComponent } from './components/requestedloan/requestedloan.component';
import { AuthGuard } from './components/authguard/auth.guard';
import { AdmineditloanComponent } from './components/admineditloan/admineditloan.component';
import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { UserappliedloanComponent } from './components/userappliedloan/userappliedloan.component';
import { LoanFormComponent } from './components/loanform/loanform.component';

const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'home',component:HomeComponent},
  {path:'admin',component:AdminnavComponent, data:{role:'Admin'}, canActivate:[AuthGuard]},
  {path:'user',component:UsernavComponent, data:{role:'User'}, canActivate:[AuthGuard] },
  { path: 'registration', component: RegistrationComponent },
  { path: 'admin/createloan', component: CreateLoanComponent , data:{role:'Admin'}, canActivate:[AuthGuard]},
  { path: 'admin/editloan/:id', component: AdmineditloanComponent , data:{role:'Admin'}, canActivate:[AuthGuard]},
  { path: 'admin/viewloan', component: ViewloanComponent, data:{role:'Admin'}, canActivate:[AuthGuard]},
  { path: 'admin/requestedloan', component: RequestedloanComponent, data:{role:'Admin'}, canActivate:[AuthGuard] },
  { path: 'admin/adminviewfeedback', component: AdminviewfeedbackComponent, data:{role:'Admin'}, canActivate:[AuthGuard] },
  { path: 'user/useraddfeedback', component: UseraddfeedbackComponent, data:{role:'User'}, canActivate:[AuthGuard] },
  { path: 'user/userviewfeedback', component: UserviewfeedbackComponent, data:{role:'User'}, canActivate:[AuthGuard] },
  { path: 'user/userappliedloan', component: UserappliedloanComponent, data:{role:'User'}, canActivate:[AuthGuard] },
  { path: 'user/userviewloan', component: UserviewloanComponent ,data:{role:'User'}, canActivate:[AuthGuard] },
  { path: 'user/loanform/:id', component: LoanFormComponent ,data:{role:'User'}, canActivate:[AuthGuard] },

  {path:'',component:HomeComponent},
  {path:'**',component:ErrorComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
