import { Component, OnInit } from '@angular/core';
import { CmsPageService } from '../api/cms-page.service';
import { PetcloudApiService } from '../api/petcloud-api.service';

@Component({
  selector: 'app-help-article',
  templateUrl: './help-article.page.html',
  styleUrls: ['./help-article.page.scss'],
})
export class HelpArticlePage implements OnInit {

  helpArticles: any = [];
  constructor(public cmsPage: CmsPageService,
    public api: PetcloudApiService) {
    this.helpArticles= this.cmsPage.cmsPage[1].helpArticles.helpArticle;
    console.log("help article", this.helpArticles);
   }

  ngOnInit() {
  }

  goToDetails(webUrl){
    this.api.openExteralLinks(webUrl)
  }

}
