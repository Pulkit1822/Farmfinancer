import { Component } from '@angular/core';

interface FAQItem {
  title: string;
  content: string;
  isOpen?: boolean;
}

@Component({
  selector: 'app-faq-accordion',
  templateUrl: './faq-accordion.component.html',
  styleUrls: ['./faq-accordion.component.css']
})
export class FaqAccordionComponent {
  public faqItems: FAQItem[] = [
    {
      title: 'What is Farm Financer?',
      content: 'Farm Financer is a digital platform designed to support farmers and agricultural businesses in securing reliable and flexible financial assistance. It offers a comprehensive selection of loan options tailored to various agricultural needs such as crop cultivation, equipment purchases, and land expansion.',
      isOpen: false
    },
    {
      title: 'What loan options does Farm Financer offer?',
      content: 'The platform provides various loan types, each with detailed descriptions, competitive interest rates, repayment tenure, eligibility criteria, and required documents. This empowers users to make well-informed decisions about their financial needs.',
      isOpen: false
    },
    {
      title: 'How does the application process work?',
      content: 'Farmers can view available loans, apply by submitting necessary details including farm location, size, and purpose, and upload required proofs. The system provides a user-friendly application interface and manages loan requests with status updates.',
      isOpen: false
    },
    {
      title: 'Who are the users of Farm Financer?',
      content: 'The system caters to both Admin and User roles. Admins manage loans, approve or reject loan applications, and view user feedback. Users can register, login, view loans, apply for loans, submit feedback, and view applied loans.',
      isOpen: false
    },
    {
      title: 'What technologies are used in Farm Financer?',
      content: 'The frontend is built using Angular 10 with HTML and CSS, while the backend uses .NET Web API with Entity Framework Core and Microsoft SQL Server for data management. The system also implements JWT-based authentication for security.',
      isOpen: false
    }
  ];

  public toggleItem(index: number): void {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }
}
