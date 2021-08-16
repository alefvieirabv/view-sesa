import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[apenasNumeros]'
})
export class ApenasNumerosDirective {
  private regex: RegExp = new RegExp(/^[0-9]+(\.[0-9]*)?$/g);
  private teclasEspeciais: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
      if (this.teclasEspeciais.indexOf(event.key) !== -1) {
          return;
      }

      let atual: string = this.el.nativeElement.value;
      let proximo: string = atual.concat(event.key);
      if (proximo && !String(proximo).match(this.regex)) {
          event.preventDefault();
      }
  }
  
}
