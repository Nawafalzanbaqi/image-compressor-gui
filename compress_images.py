#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ضغط الصور دفعة واحدة مع الحفاظ على الجودة
==========================================
سكربت يضغط كل الصور الموجودة في مجلد معيّن ويحفظها في مجلد آخر،
مع المحافظة على الأبعاد والجودة قدر الإمكان وتصغير حجم الملف.

يدعم: JPG / JPEG / PNG / WebP / TIFF / BMP

طريقة التشغيل (أبسط صورة):
    python compress_images.py

أو مع تحديد المجلدات والإعدادات:
    python compress_images.py --input images --output compressed --quality 85 --max-size 2000
"""

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    print("⚠️  مكتبة Pillow غير مثبتة. ثبّتها بالأمر:")
    print("    pip install Pillow")
    sys.exit(1)

# الامتدادات المدعومة
SUPPORTED = {".jpg", ".jpeg", ".png", ".webp", ".tiff", ".tif", ".bmp"}


def human_size(num_bytes):
    """تحويل الحجم بالبايت إلى صيغة مقروءة (KB / MB)."""
    for unit in ["B", "KB", "MB", "GB"]:
        if num_bytes < 1024:
            return f"{num_bytes:.1f} {unit}"
        num_bytes /= 1024
    return f"{num_bytes:.1f} TB"


def compress_image(src_path, dst_path, quality, max_size):
    """ضغط صورة واحدة وحفظها في المسار الجديد."""
    with Image.open(src_path) as img:
        # تصحيح اتجاه الصورة بناءً على بيانات EXIF (مهم لصور الجوال)
        img = ImageOps.exif_transpose(img)

        ext = src_path.suffix.lower()

        # تصغير الأبعاد فقط إذا كانت أكبر من الحد الأقصى (مع الحفاظ على النِسَب)
        if max_size and max_size > 0:
            img.thumbnail((max_size, max_size), Image.LANCZOS)

        save_kwargs = {}

        if ext in {".jpg", ".jpeg"}:
            # تحويل أي وضع غير متوافق إلى RGB
            if img.mode in ("RGBA", "P", "LA"):
                img = img.convert("RGB")
            save_kwargs = {
                "quality": quality,
                "optimize": True,
                "progressive": True,  # تحميل تدريجي + حجم أصغر غالبًا
            }
            img.save(dst_path, "JPEG", **save_kwargs)

        elif ext == ".png":
            # PNG ضغطه بدون فقدان جودة؛ optimize يقلّل الحجم قدر الإمكان
            save_kwargs = {"optimize": True}
            img.save(dst_path, "PNG", **save_kwargs)

        elif ext == ".webp":
            save_kwargs = {"quality": quality, "method": 6}
            img.save(dst_path, "WEBP", **save_kwargs)

        else:
            # TIFF / BMP وغيرها — نحفظها كما هي بعد التصغير
            img.save(dst_path)


def main():
    parser = argparse.ArgumentParser(
        description="ضغط الصور دفعة واحدة مع الحفاظ على الجودة."
    )
    parser.add_argument("--input", "-i", default="images",
                        help="مجلد الصور الأصلية (الافتراضي: images)")
    parser.add_argument("--output", "-o", default="compressed",
                        help="مجلد الصور المضغوطة (الافتراضي: compressed)")
    parser.add_argument("--quality", "-q", type=int, default=85,
                        help="جودة JPEG/WebP من 1 إلى 100 (الافتراضي: 85)")
    parser.add_argument("--max-size", "-m", type=int, default=2000,
                        help="أقصى عرض/ارتفاع بالبكسل، 0 = عدم تغيير الأبعاد (الافتراضي: 2000)")
    parser.add_argument("--recursive", "-r", action="store_true",
                        help="معالجة المجلدات الفرعية أيضًا")
    args = parser.parse_args()

    input_dir = Path(args.input)
    output_dir = Path(args.output)

    if not input_dir.exists():
        print(f"❌ المجلد غير موجود: {input_dir.resolve()}")
        print("   تأكد من اسم المجلد أو ضع الصور بداخله.")
        sys.exit(1)

    # جمع كل ملفات الصور
    pattern = "**/*" if args.recursive else "*"
    files = [f for f in input_dir.glob(pattern)
             if f.is_file() and f.suffix.lower() in SUPPORTED]

    if not files:
        print(f"⚠️  لم يتم العثور على صور في: {input_dir.resolve()}")
        sys.exit(0)

    print(f"📁 وُجدت {len(files)} صورة. جارٍ المعالجة...\n")

    total_before = 0
    total_after = 0
    ok = 0
    failed = 0

    for f in files:
        # الحفاظ على بنية المجلدات الفرعية في حالة recursive
        relative = f.relative_to(input_dir)
        dst = output_dir / relative
        dst.parent.mkdir(parents=True, exist_ok=True)

        try:
            before = f.stat().st_size
            compress_image(f, dst, args.quality, args.max_size)
            after = dst.stat().st_size

            total_before += before
            total_after += after
            ok += 1

            saved_pct = (1 - after / before) * 100 if before else 0
            print(f"✅ {relative}  |  {human_size(before)} → "
                  f"{human_size(after)}  ({saved_pct:.0f}% توفير)")
        except Exception as e:
            failed += 1
            print(f"❌ فشل: {relative}  ({e})")

    # ملخص نهائي
    print("\n" + "=" * 50)
    print(f"تمّت معالجة {ok} صورة بنجاح، وفشلت {failed}.")
    if total_before:
        total_saved = (1 - total_after / total_before) * 100
        print(f"الحجم الإجمالي: {human_size(total_before)} → "
              f"{human_size(total_after)}")
        print(f"إجمالي التوفير: {total_saved:.0f}%")
    print(f"📂 الصور المضغوطة في: {output_dir.resolve()}")
    print("=" * 50)


if __name__ == "__main__":
    main()
