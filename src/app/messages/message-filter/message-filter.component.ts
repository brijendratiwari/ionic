import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-message-filter',
    templateUrl: './message-filter.component.html',
    styleUrls: ['./message-filter.component.scss'],
})
export class MessageFilterComponent implements OnInit {
    @Input() viewAs = '';
    @Input() filterByStage = '';

    constructor(public modal: ModalController, protected storage: Storage) {
    }

    ngOnInit() {
    }

    public applyFilter() {
        const statusCode = {
            viewAs: this.viewAs == 'all' ? null: this.viewAs,
            filterByStage: this.filterByStage
        };
        this.modal.dismiss(statusCode);
    }

    public clearFilter() {
        const statusCode = {
            viewAs: 'all',
            filterByStage: '0'
        };
        this.modal.dismiss(statusCode);
    }

    public closeModal() {
        this.modal.dismiss();
    }
}
