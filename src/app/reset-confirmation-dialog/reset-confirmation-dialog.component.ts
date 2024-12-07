import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reset-confirmation-dialog',
  template: `
    <h1 mat-dialog-title>确认操作</h1>
    <div mat-dialog-content>
      <p>确定要重置所有卡片库存吗？</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="cancel()">取消</button>
      <button mat-raised-button color="warn" (click)="confirm()">确定</button>
    </div>
  `,
  styleUrls: ['./reset-confirmation-dialog.component.css'], // 确保引用了 CSS 文件
})
export class ResetConfirmationDialogComponent {
  constructor(private dialogRef: MatDialogRef<ResetConfirmationDialogComponent>) {}

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
