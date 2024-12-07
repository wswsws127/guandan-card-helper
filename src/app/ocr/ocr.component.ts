import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { createWorker } from 'tesseract.js';

@Component({
  selector: 'app-ocr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ocr.component.html',
  styleUrls: ['./ocr.component.css']
})
export class OcrComponent {
  ocrResult = '点击按钮开始识别';
  isLoading = false;
  imageUrl = 'http://localhost:3000/api/image'; // 后端提供图片 API 的 URL

  constructor(private http: HttpClient) { }

  async doOCR() {
    this.isLoading = true;
    this.ocrResult = '正在加载和识别，请稍候...';

    const worker = createWorker({
      logger: m => console.log(m) // 可选：记录日志信息
    });

    try {
      // Step 1: 预处理图片
      //const preprocessedImage = await this.preprocessImage(this.imageUrl);

      // Step 2: 配置 Tesseract.js
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789AKQJ', // 限制字符集
      });

      // Step 3: 将图片 URL 直接传递给 OCR 引擎
      const { data: { text } } = await worker.recognize(this.imageUrl); // 识别图片
      
      // Step 4: 后处理识别结果
      const filteredResult = text.replace(/[^0-9AKQJ]/g, ''); // 去除无关字符
      this.ocrResult = filteredResult; // 显示最终结果
      console.log('OCR 识别结果:', filteredResult);
    } catch (error) {
      console.error('OCR 识别失败:', error);
      this.ocrResult = '识别失败，请重试。';
    } finally {
      await worker.terminate(); // 释放资源
      this.isLoading = false;
    }


  }

  private async preprocessImage(imageUrl: string): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        // 遍历像素并模糊掉非数字区域（需要根据具体图片调整颜色范围）
        const imageData = ctx?.getImageData(0, 0, img.width, img.height);
        if (imageData) {
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const red = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];

            // 简单地基于颜色值过滤非数字区域，替换为白色背景
            if (red > 200 && green > 50 && blue < 50) {
              data[i] = 255;     // Red
              data[i + 1] = 255; // Green
              data[i + 2] = 255; // Blue
            }
          }
          ctx?.putImageData(imageData, 0, 0);
        }

        resolve(canvas.toDataURL()); // 返回处理后的图片 Base64 URL
      };

      img.onerror = reject;
      img.src = imageUrl;
    });
  }

}
