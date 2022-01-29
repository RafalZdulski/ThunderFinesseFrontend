import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';
import {SortTable} from "../util/table-sort";

@Directive({
  selector: '[appSortTable]'
})
export class SortTableDirective {


  @Input() appSortTable?: Array<any>;

  constructor(private renderer: Renderer2, private targetElement: ElementRef) { }

  @HostListener("click")
  sortData() {
    const sort = new SortTable();
    const elem = this.targetElement.nativeElement;
    const order = elem.getAttribute("data-order");
    const type = elem.getAttribute("data-type");
    const property = elem.getAttribute("data-name");

    if (order === "desc") {
      this.appSortTable?.sort(sort.startSort(property, order, type));
      elem.setAttribute("data-order", "asc");
      elem.setAttribute("sorted","sorted")
    } else {
      this.appSortTable?.sort(sort.startSort(property, order, type));
      elem.setAttribute("data-order", "desc");
    }

  }

  /*TODO set and remove appropriate attributes in targetElement sibling from directive
  sortData() should also
  setAttribute("data-order", "desc") and removeAttribute("sorted')
  in every targetElement sibling - other table headers
  but for now i do not know how to access siblings form directive
  so proper jquery function is doing it in
  ngOnInit() of player-vehicle-stats.component.ts:
  said function looks like this:
  $('thead tr th').on('click',function (){
      $(this).siblings('[data-name]').each(function (i,el){
        el.setAttribute('data-order','desc');
        el.removeAttribute("sorted");
      })
    })
   */
}
