import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AgGridModule } from 'ag-grid-angular';

import { AppComponent } from './app.component';
import { AdmineditloanComponent } from './components/admineditloan/admineditloan.component';
import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';
import { CreateLoanComponent } from './components/createloan/createloan.component';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { LoanFormComponent } from './components/loanform/loanform.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { RequestedloanComponent } from './components/requestedloan/requestedloan.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UserappliedloanComponent } from './components/userappliedloan/userappliedloan.component';
import { UsernavComponent } from './components/usernav/usernav.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { UserviewloanComponent } from './components/userviewloan/userviewloan.component';
import { ViewloanComponent } from './components/viewloan/viewloan.component';
import { AdminnavComponent } from './components/adminnav/adminnav.component';

import { AnimatedGridPatternComponent } from './components/animated-grid-pattern/animated-grid-pattern.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { FaqAccordionComponent } from './components/faq-accordion/faq-accordion.component';
import { LetterGlitchComponent } from './components/letter-glitch/letter-glitch.component';

import { MagicEffectsService } from './services/magic-effects.service';
import { ConfettiService } from './services/confetti.service';
import { SparklesTextComponent } from './components/sparkles-text/sparkles-text.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { LoadingAnimationComponent } from './components/loading-animation/loading-animation.component';

@NgModule({
  declarations: [
    AppComponent,
    AdmineditloanComponent,
    AdminviewfeedbackComponent,
    CreateLoanComponent,
    ErrorComponent,
    HomeComponent,
    LoanFormComponent,
    LoginComponent,
    NavbarComponent,
    RegistrationComponent,
    RequestedloanComponent,
    UseraddfeedbackComponent,
    UserappliedloanComponent,
    UsernavComponent,
    UserviewfeedbackComponent,
    UserviewloanComponent,
    ViewloanComponent,
    AdminnavComponent,
    AnimatedGridPatternComponent,
    ThemeToggleComponent,
    FaqAccordionComponent,
    LetterGlitchComponent,
    SparklesTextComponent,
    LoadingAnimationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AgGridModule,
    RecaptchaModule,
  ],
  providers: [MagicEffectsService, ConfettiService],
  bootstrap: [AppComponent]
})
export class AppModule {}
