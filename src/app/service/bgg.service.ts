import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BggItem } from '../model/bgg.model';

export interface SearchResult {
  result: {
    items: BggItem[];
	  paging: number;
  }
}

@Injectable({
  providedIn: 'root'
})
export class BggService {

  libraryUrl = 'https://tabletop.events/api/library/0AEB11DA-2B7D-11EC-B400-855F800FD618/librarygames';
  itemUrl = (id: string) => `https://tabletop.events/api/librarygame/${id}`;

  constructor(private http: HttpClient) { }

  getBggLibraryInfo(query?: string, page = 1, pageSize = 10, orderBy = 'name', sortBy = 'asc') {
    const params = new HttpParams()
        .append('_include_options', '1')
        .append('_include', 'bgg_icon_uri')
        .append('_items_per_page', pageSize)
        .append('_order_by', orderBy)
        .append('_page_number', page)
        .append('_sort_order', sortBy)
        .append('is_in_circulation', '1')
        .append('query', query || '');
    console.log('params: ', params)
    return this.http.get(this.libraryUrl, {params});
  }

  getBggGameInfo(id: string) {
    const params = new HttpParams()
        .append('_include_options', '1')
        .append('_include', 'bgg_icon_uri')
        .append('_include_related_objects', 'library')
        .append('_include_relationships', '1');
    return this.http.get<BggItem>(this.itemUrl(id), {params});
  }
}