import { Component, Input } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [],
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css'],
})

export class AnalysisComponent {
  @Input() cards!: { cardName: string; count: number; maxCount: number }[]; // 从父组件接收的牌组数据

  // 分析结果
  threePairs: string[] = [];
  steelPlates: string[] = [];
  sequences: string[] = [];
  bombs: Record<number, string[]> = {}; // 显式定义类型，确保安全访问
  hasHeavenlyKingBomb = false;

  // 牌点的顺序
  private readonly cardOrder = ['👑', '⚔', 'A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

  constructor(private sharedService: SharedService) {}

    ngOnInit() {
    this.sharedService.cards$.subscribe((cards) => {
      this.cards = cards;
      this.analyzeRemainingCards(); // 数据更新时重新分析
    });
  }

  /**
   * 分析剩余的牌
   */
  private analyzeRemainingCards() {
    this.resetAnalysis();

    const cardMap = Object.fromEntries(
      this.cards.map((card) => [card.cardName, card.count])
    );

    // 分析三连对
    this.threePairs = this.findPatterns(cardMap, 2, 3);

    // 分析钢板
    this.steelPlates = this.findPatterns(cardMap, 3, 2);

    // 分析顺子
    this.sequences = this.findSequences(cardMap, 5);

    // 分析炸弹
    this.analyzeBombs(cardMap);

      // 分析天王炸
  this.analyzeHeavenlyKingBomb(cardMap);
  }

  /**
   * 找到特定模式（如三连对、钢板等）
   * @param cardMap 牌点到数量的映射
   * @param count 每张牌的最小数量
   * @param length 连续长度
   */
  private findPatterns(cardMap: Record<string, number>, count: number, length: number): string[] {
    const patterns: string[] = [];
    for (let i = 2; i <= this.cardOrder.length - length; i++) {
      const slice = this.cardOrder.slice(i, i + length);
      if (slice.every((card) => cardMap[card] >= count)) {
        patterns.push(slice.map((card) => card.repeat(count)).join(''));
      }
    }
    return patterns;
  }

  /**
   * 找到顺子
   * @param cardMap 牌点到数量的映射
   * @param length 顺子的长度
   */
  private findSequences(cardMap: Record<string, number>, length: number): string[] {
    const sequences: string[] = [];
    for (let i = 2; i <= this.cardOrder.length - length; i++) {
      const slice = this.cardOrder.slice(i, i + length);
      if (slice.every((card) => cardMap[card] >= 1)) {
        sequences.push(slice.join(''));
      }
    }
    return sequences;
  }

  /**
   * 分析炸弹
   * @param cardMap 牌点到数量的映射
   */
  private analyzeBombs(cardMap: Record<string, number>) {
    const bombLevels = [4, 5, 6, 7, 8];
    bombLevels.forEach((level) => {
      this.bombs[level] = Object.entries(cardMap)
        .filter(([_, count]) => count >= level)
        .map(([card, _]) => `${level}个${card}`);
    });
  }

  /**
 * 检查天王炸（👑和⚔是否都满足条件）
 * @param cardMap 牌点到数量的映射
 */
private analyzeHeavenlyKingBomb(cardMap: Record<string, number>) {
  this.hasHeavenlyKingBomb = cardMap['👑'] >= 2 && cardMap['⚔'] >= 2;
}

  /**
   * 重置分析结果
   */
  private resetAnalysis() {
    this.threePairs = [];
    this.steelPlates = [];
    this.sequences = [];
    this.bombs = {};
    this.hasHeavenlyKingBomb = false;
  }
}
