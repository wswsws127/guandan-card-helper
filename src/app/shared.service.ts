import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private cardsSource = new BehaviorSubject<{ cardName: string; count: number; maxCount: number }[]>([]);
  cards$ = this.cardsSource.asObservable();

  updateCards(cards: { cardName: string; count: number; maxCount: number }[]) {
    this.cardsSource.next(cards);
  }
}
