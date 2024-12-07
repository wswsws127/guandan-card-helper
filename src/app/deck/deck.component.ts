import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { GlobalInputBoxComponent } from '../global-input-box/global-input-box.component';
import { SharedService } from '../shared.service';
import { MatDialog } from '@angular/material/dialog';
import { ResetConfirmationDialogComponent } from '../reset-confirmation-dialog/reset-confirmation-dialog.component'; // 引入弹窗组件


@Component({
  selector: 'app-deck',
  standalone: true,
  imports: [CardComponent, GlobalInputBoxComponent, CommonModule, ResetConfirmationDialogComponent],
  templateUrl: './deck.component.html',
  styleUrl: './deck.component.css'
})

export class DeckComponent {
  cards: { cardName: string; count: number; maxCount: number }[] = []; // 牌组信息

  // 初始化牌组
  constructor(private sharedService: SharedService, private dialog: MatDialog) {
    const initialCards = [
      { cardName: '👑', maxCount: 2 },
      { cardName: '⚔', maxCount: 2 },
      { cardName: 'A', maxCount: 8 },
      { cardName: 'K', maxCount: 8 },
      { cardName: 'Q', maxCount: 8 },
      { cardName: 'J', maxCount: 8 },
      { cardName: '10', maxCount: 8 },
      { cardName: '9', maxCount: 8 },
      { cardName: '8', maxCount: 8 },
      { cardName: '7', maxCount: 8 },
      { cardName: '6', maxCount: 8 },
      { cardName: '5', maxCount: 8 },
      { cardName: '4', maxCount: 8 },
      { cardName: '3', maxCount: 8 },
      { cardName: '2', maxCount: 8 },
    ];

    // 初始化卡片数组，每张卡片的初始库存为最大值
    this.cards = initialCards.map((card) => ({
      cardName: card.cardName,
      count: card.maxCount,
      maxCount: card.maxCount,
    }));
    this.sharedService.updateCards(this.cards); // 初始化时共享牌组数据
  }


  /**
   * 处理单张卡片库存变化事件
   * @param event 包含卡片名称和新的库存数量
   */
  handleCardCountChange(event: { card: string; newCount: number }) {
    const card = this.cards.find((c) => c.cardName === event.card);
    if (card) {
      card.count = event.newCount; // 更新卡片库存
    }
    this.sharedService.updateCards(this.cards); // 每次更新牌组时通知其他组件
  }

  adjustCardCounts(updates: { cardName: string; decrement: number }[]) {
    updates.forEach(update => {
      const card = this.cards.find(c => c.cardName === update.cardName);
      if (card) {
        card.count = Math.max(0, card.count - update.decrement); // 确保库存不会变成负数
      }
    });
  }

  /**
   * 打开确认弹窗，重置所有卡片库存
   */
  confirmResetAll() {
    const dialogRef = this.dialog.open(ResetConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // 如果用户确认，则重置
        this.resetAll();
      }
    });
  }


  /**
   * 重置所有卡片库存
   */
  resetAll() {
    this.cards.forEach((card) => {
      card.count = card.maxCount; // 重置为最大库存
    });
    this.sharedService.updateCards(this.cards); // 重置时通知其他组件
  }
}
