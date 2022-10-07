import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-contact-other-sitter',
  templateUrl: './contact-other-sitter.page.html',
  styleUrls: ['./contact-other-sitter.page.scss'],
})
export class ContactOtherSitterPage implements OnInit {

  constructor(public navcntl:NavController) { }

  ngOnInit() {
  }
  
  goToMessages(){
    this.navcntl.navigateRoot("home/tabs/messages", { skipLocationChange: true });
  }

  sendInquiry(){
    
  }
}
