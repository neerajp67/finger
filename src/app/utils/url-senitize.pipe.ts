import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'urlSenitize'
})
export class UrlSenitizePipe implements PipeTransform {

  constructor(private sanitize: DomSanitizer) { }
  
  transform(value: string): SafeUrl {
    return this.sanitize.bypassSecurityTrustResourceUrl(value);
  }

}
