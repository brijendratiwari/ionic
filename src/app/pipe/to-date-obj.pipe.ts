import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'toDateObj'
})

export class ToDateObjPipe implements PipeTransform {

  transform(date, format) {
    return moment(date).format(format);
  }

}