import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-chatscreen-filesharing-popup',
  templateUrl: './chatscreen-filesharing-popup.component.html',
  styleUrls: ['./chatscreen-filesharing-popup.component.scss'],
})
export class ChatscreenFilesharingPopupComponent implements OnInit {

  userType: any = "";
  items = [{name:"Camera",image:'camera',isVisible:true},
  {name:"Photo Gallery",image:"images",isVisible:true},
  {name:"Create a Visit Report",image:"document",isVisible:false}];

  constructor(public popOver:PopoverController,public navParams:NavParams) { 
    this.userType =  this.navParams.get("userType");
    this.userType == "minder" ? this.items[2].isVisible = true :  this.items[2].isVisible = false;
  }

  ngOnInit() {}

  
  dismissPopover(){
    this.popOver.dismiss();
  }

  selectedItem(item){
    console.log(item);
    this.popOver.dismiss(item);
  }

}
