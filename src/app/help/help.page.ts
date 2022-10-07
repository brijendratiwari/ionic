import {Component, OnInit} from '@angular/core';
import { PetcloudApiService } from '../api/petcloud-api.service';

@Component({
    selector: 'app-help',
    templateUrl: './help.page.html',
    styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

    constructor(public api: PetcloudApiService) {
    }

    ngOnInit() {
    }

    // Open's Web View..
    public openWebpage(url: string) {
        this.api.openExteralLinks(url);
    }

}
