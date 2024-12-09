import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBomb } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-card',
  standalone: true,
  imports:[CommonModule,FontAwesomeModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  faBomb =faBomb;
  @Input() cardName!: string; // 卡片名称，例如 'A', 'K', '👑'
  @Input() count!: number; // 当前库存数量
  @Input() maxCount!: number; // 最大库存数量
  @Output() countChange = new EventEmitter<{ card: string; newCount: number }>(); // 用于向父组件发送库存变化事件

  /**
   * 更新库存数量
   * @param delta 增加或减少的数量
   */
  changeCount(delta: number) {
    const newCount = this.count + delta;

    // 确保库存在有效范围内
    if (newCount >= 0 && newCount <= this.maxCount) {
      this.count = newCount;
      this.countChange.emit({ card: this.cardName, newCount }); // 触发事件，将新库存发送给父组件
    }
  }

  /**
   * 获取卡片的库存状态，用于动态设置样式
   */
  getCardStatus(): string {
    if (this.count > 4) {
      return 'high'; // 高库存
    } else if (this.count === 4) {
      return 'medium'; // 中等库存
    } else if (this.count > 0) {
      return 'low'; // 低库存
    } else {
      return 'empty'; // 无库存
    }
  }

  reduceCount() {
    this.count -= 4;
  }
}
