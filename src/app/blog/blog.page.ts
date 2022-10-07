import { Component, OnInit } from '@angular/core';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit {
  blogs = [];

    // Set Limit in filter
  public offsetLimit = 0;
  isLoading: boolean = true;
  constructor(public api:PetcloudApiService,
    public router: Router) { }

  ngOnInit() {
    this.getBlog(0,"");
  }

  getBlog(offsetLimit,infiniteScroll){
    const pagination= {
      offset:offsetLimit,
      limit:10
    }
    if(pagination.offset === 0){
      this.isLoading = true;
      this.api.showLoader();
    }
    this.api.getBlog(pagination).pipe(
      finalize(() => {
        if(pagination.offset === 0){
          this.api.hideLoader();
          this.isLoading = false;
        }
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
      })
    ).subscribe((res:any)=>{
      if(res.blog){
        res.blog.forEach(element => {
            this.blogs.push(element)
        });
      }
    },err=>{
      this.api.autoLogout(err,pagination)
    })
  }

  goToBlogDetails(blog){
    this.router.navigate(["/blog-details"], {
      queryParams: { blogId: blog.id },
    });

  }

  loadData(infiniteScroll){
    this.offsetLimit = this.offsetLimit + 10;
    this.getBlog(this.offsetLimit, infiniteScroll);
  }

}
