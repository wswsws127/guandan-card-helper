import { Component } from '@angular/core';
import { AnalysisComponent } from './analysis/analysis.component';
import { DeckComponent } from './deck/deck.component';
import { OcrComponent } from './ocr/ocr.component';

@Component({
  selector: 'app-root',
  imports: [
    AnalysisComponent,
    DeckComponent,
    OcrComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'guandan-card-helper';
}
