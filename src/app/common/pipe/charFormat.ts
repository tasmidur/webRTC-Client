import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'charFormat'
})
export class charFormat implements PipeTransform {

  transform(value: string): string {
    let str = value.split(' ');
    if(str.length == 1){
      return value.charAt(0).toUpperCase();
    }else if(str.length > 1 && Number(str[str.length-1])){
      return str[str.length-1];
    }
    let shortName = value.replace(/[^\w\s]/gi, "");
    return shortName.match(/^(\w)\w*\s+(\w{1,1})/)?.slice(1).join('') || '';
  }
}