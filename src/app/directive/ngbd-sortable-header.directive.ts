import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { BggItem } from '../model/bgg.model';

export type SortColumn = keyof BggItem | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: 'asc'};

export interface SortEvent {
	column: SortColumn;
	direction: SortDirection;
}

@Directive({
	selector: 'th[sortable]',
	host: {
		'[class.asc]': 'direction === "asc"',
		'[class.desc]': 'direction === "desc"',
		'(click)': 'rotate()',
	},
  standalone: true,
})
export class NgbdSortableHeader {
	@Input() sortable: SortColumn = '';
	@Input() direction: SortDirection = '';
	@Output() sort = new EventEmitter<SortEvent>();

	rotate() {
		this.direction = this.direction === '' ? 'asc' : rotate[this.direction];
		this.sort.emit({ column: this.sortable, direction: this.direction });
	}
}
