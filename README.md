# 🖼️ ضاغط الصور | Image Compressor (GUI)

أداة سطح مكتب بواجهة رسومية عربية لضغط الصور دفعة واحدة مع الحفاظ على الجودة — بدون كتابة أي أوامر.

A desktop GUI tool (Arabic interface) for batch-compressing images while preserving quality — no command line needed.

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Pillow](https://img.shields.io/badge/Pillow-11557C?style=for-the-badge)

## ✨ المميزات | Features

- 📁 ضغط كل صور المجلد دفعة واحدة | Batch-compress an entire folder
- 🎚️ تحكم في الجودة (10-100) | Adjustable quality (10–100)
- 📐 تحديد أقصى أبعاد للصورة | Max width/height limit
- 🔄 تحويل تلقائي إلى WebP | Optional WebP conversion
- 📂 دعم المجلدات الفرعية | Recursive subfolder support
- 📱 تصحيح اتجاه صور الجوال (EXIF) | Auto EXIF orientation fix
- ⚡ معالجة متعددة الخيوط + شريط تقدّم حيّ | Multi-threaded with live progress
- 🇸🇦 واجهة عربية بالكامل | Fully Arabic interface

## 🛠️ التقنيات | Tech Stack

**Python** · **Pillow** · **Tkinter**

## 🚀 التشغيل | Getting Started

```bash
# المتطلبات | Requirements
pip install Pillow

# التشغيل | Run
python compress_gui.py
```

> Tkinter مدمجة مع Python غالباً. على لينكس: `sudo apt install python3-tk`

## 📖 طريقة الاستخدام | Usage

1. اختر مجلد الصور الأصلية | Select the source folder
2. اختر مجلد الحفظ | Select the output folder
3. اضبط الجودة والأبعاد | Adjust quality & dimensions
4. اضغط "ابدأ الضغط" | Click start

---

Built by **Nawaf Alzanbaqi** — Full-Stack Web Developer
🌐 [nawaf-alzanbaqi.dev](https://nawaf-alzanbaqi.dev) · 💼 [LinkedIn](https://linkedin.com/in/nawaf-alzanbaqi)