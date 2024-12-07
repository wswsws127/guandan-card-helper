import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher } from '@angular/material/core';

/** 自定义错误状态匹配器 */
export class InputErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

@Component({
  selector: 'app-global-input-box',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './global-input-box.component.html',
  styleUrls: ['./global-input-box.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class GlobalInputBoxComponent {
  @Output() adjustCounts = new EventEmitter<{ cardName: string; decrement: number }[]>(); // 明确类型
  inputValueControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[a-zA-Z0-9]+$/), // 仅允许字母和数字
  ]);

  matcher = new InputErrorStateMatcher();

  /**
   * 处理用户输入并计算需要减少的库存
   */
  processInput() {
    if (this.inputValueControl.invalid) {
      return; // 如果输入无效，直接返回
    }

    const input = this.inputValueControl.value?.trim().toUpperCase() || ''; // 标准化输入
    const specialMap: Record<string, string> = {
      '1': 'A', // 映射 1 为 A
      'D': '👑', // 映射 D 为 大王
      'X': '⚔', // 映射 X 为 小王
      'S': '10', // 映射 S 为 10
    };

    const normalizedInput = [...input].map((char) => specialMap[char] || char); // 映射特殊符号
    const inputCounts: Record<string, number> = {};

    for (const char of normalizedInput) {
      inputCounts[char] = (inputCounts[char] || 0) + 1; // 统计每种牌的数量
    }

    const updates = Object.entries(inputCounts).map(([cardName, decrement]) => ({
      cardName,
      decrement,
    }));

    this.adjustCounts.emit(updates); // 发送减少库存的事件
    this.inputValueControl.reset(); // 清空输入框
  }
}
