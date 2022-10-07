import { Component, Input, OnInit } from "@angular/core";
import { NavController, ModalController } from "@ionic/angular";


@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {

  @Input() categories: any[] = [];

  constructor(
    public modal: ModalController,
    public navCtrl: NavController
  ) {}

  ngOnInit() { }

  public dismissModal() {
    this.modal.dismiss();
  }

  async goToDashboardCategory(category) {
    this.modal.dismiss(category, 'redirect');
  }

}
