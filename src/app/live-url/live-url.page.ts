import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PetcloudApiService} from '../api/petcloud-api.service';

@Component({
    selector: 'app-live-url',
    templateUrl: './live-url.page.html',
    styleUrls: ['./live-url.page.scss'],
})
export class LiveUrlPage implements OnInit {

    constructor(public api: PetcloudApiService, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.openWebpage(this.activatedRoute.snapshot.paramMap.get('liveUrl'));
    }

    // Open's Web View..
    public openWebpage(url: string) {
        localStorage.setItem(PetcloudApiService.TRAININGDONE, 'yes');
        this.api.openExteralLinks(url);
    }
}
