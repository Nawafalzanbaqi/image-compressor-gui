#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
واجهة رسومية لضغط الصور دفعة واحدة
====================================
برنامج بواجهة رسومية يضغط كل الصور في مجلد مع الحفاظ على الجودة،
بدون الحاجة لكتابة أي أوامر — فقط اختر المجلد واضغط زر البدء.

طريقة التشغيل:
    python compress_gui.py

المتطلبات:
    pip install Pillow
(مكتبة Tkinter مدمجة مع Python غالبًا)
"""

import threading
import queue
from pathlib import Path

try:
    import tkinter as tk
    from tkinter import ttk, filedialog, messagebox
except ImportError:
    raise SystemExit("Tkinter غير متوفر. على لينكس ثبّته بـ: sudo apt install python3-tk")

try:
    from PIL import Image, ImageOps
except ImportError:
    raise SystemExit("مكتبة Pillow غير مثبتة. ثبّتها بالأمر: pip install Pillow")

SUPPORTED = {".jpg", ".jpeg", ".png", ".webp", ".tiff", ".tif", ".bmp"}


def human_size(num_bytes):
    for unit in ["B", "KB", "MB", "GB"]:
        if num_bytes < 1024:
            return f"{num_bytes:.1f} {unit}"
        num_bytes /= 1024
    return f"{num_bytes:.1f} TB"


def compress_one(src_path, dst_path, quality, max_size, to_webp):
    """ضغط صورة واحدة. يعيد (الحجم قبل، الحجم بعد)."""
    before = src_path.stat().st_size
    with Image.open(src_path) as img:
        img = ImageOps.exif_transpose(img)  # تصحيح اتجاه صور الجوال

        if max_size and max_size > 0:
            img.thumbnail((max_size, max_size), Image.LANCZOS)

        ext = src_path.suffix.lower()

        if to_webp:
            dst_path = dst_path.with_suffix(".webp")
            img.save(dst_path, "WEBP", quality=quality, method=6)

        elif ext in {".jpg", ".jpeg"}:
            if img.mode in ("RGBA", "P", "LA"):
                img = img.convert("RGB")
            img.save(dst_path, "JPEG", quality=quality,
                     optimize=True, progressive=True)

        elif ext == ".png":
            img.save(dst_path, "PNG", optimize=True)

        elif ext == ".webp":
            img.save(dst_path, "WEBP", quality=quality, method=6)

        else:
            img.save(dst_path)

    after = dst_path.stat().st_size
    return before, after


class App:
    def __init__(self, root):
        self.root = root
        root.title("ضغط الصور — أداة بسيطة")
        root.geometry("640x620")
        root.minsize(560, 560)

        self.msg_queue = queue.Queue()
        self.running = False

        pad = {"padx": 12, "pady": 6}

        # ---------- مجلد الصور ----------
        frm_in = ttk.LabelFrame(root, text="مجلد الصور الأصلية")
        frm_in.pack(fill="x", **pad)
        self.input_var = tk.StringVar()
        ttk.Entry(frm_in, textvariable=self.input_var).pack(
            side="left", fill="x", expand=True, padx=8, pady=8)
        ttk.Button(frm_in, text="استعراض...",
                   command=self.pick_input).pack(side="right", padx=8, pady=8)

        # ---------- مجلد الحفظ ----------
        frm_out = ttk.LabelFrame(root, text="مجلد حفظ الصور المضغوطة")
        frm_out.pack(fill="x", **pad)
        self.output_var = tk.StringVar()
        ttk.Entry(frm_out, textvariable=self.output_var).pack(
            side="left", fill="x", expand=True, padx=8, pady=8)
        ttk.Button(frm_out, text="استعراض...",
                   command=self.pick_output).pack(side="right", padx=8, pady=8)

        # ---------- الإعدادات ----------
        frm_set = ttk.LabelFrame(root, text="الإعدادات")
        frm_set.pack(fill="x", **pad)

        # الجودة
        q_row = ttk.Frame(frm_set)
        q_row.pack(fill="x", padx=8, pady=6)
        ttk.Label(q_row, text="الجودة:").pack(side="left")
        self.quality_var = tk.IntVar(value=85)
        self.quality_lbl = ttk.Label(q_row, text="85", width=4)
        self.quality_lbl.pack(side="right")
        q_scale = ttk.Scale(q_row, from_=10, to=100, variable=self.quality_var,
                            command=lambda v: self.quality_lbl.config(
                                text=str(int(float(v)))))
        q_scale.pack(side="left", fill="x", expand=True, padx=10)

        # أقصى أبعاد
        m_row = ttk.Frame(frm_set)
        m_row.pack(fill="x", padx=8, pady=6)
        ttk.Label(m_row, text="أقصى عرض/ارتفاع (بكسل):").pack(side="left")
        self.maxsize_var = tk.StringVar(value="2000")
        ttk.Entry(m_row, textvariable=self.maxsize_var, width=8).pack(
            side="left", padx=8)
        ttk.Label(m_row, text="(0 = إبقاء الأبعاد الأصلية)").pack(side="left")

        # خيارات
        opt_row = ttk.Frame(frm_set)
        opt_row.pack(fill="x", padx=8, pady=6)
        self.recursive_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(opt_row, text="تضمين المجلدات الفرعية",
                        variable=self.recursive_var).pack(side="left")
        self.webp_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(opt_row, text="تحويل إلى WebP (حجم أصغر)",
                        variable=self.webp_var).pack(side="left", padx=20)

        # ---------- زر البدء ----------
        self.start_btn = ttk.Button(root, text="▶  ابدأ الضغط",
                                    command=self.start)
        self.start_btn.pack(fill="x", padx=12, pady=10)

        # ---------- شريط التقدم ----------
        self.progress = ttk.Progressbar(root, mode="determinate")
        self.progress.pack(fill="x", padx=12, pady=4)

        # ---------- سجل العمليات ----------
        frm_log = ttk.LabelFrame(root, text="السجل")
        frm_log.pack(fill="both", expand=True, **pad)
        self.log = tk.Text(frm_log, height=10, wrap="word", state="disabled")
        self.log.pack(side="left", fill="both", expand=True, padx=(8, 0), pady=8)
        sb = ttk.Scrollbar(frm_log, command=self.log.yview)
        sb.pack(side="right", fill="y", pady=8)
        self.log.config(yscrollcommand=sb.set)

        self.poll_queue()

    # ---------- أزرار الاستعراض ----------
    def pick_input(self):
        d = filedialog.askdirectory(title="اختر مجلد الصور")
        if d:
            self.input_var.set(d)
            if not self.output_var.get():
                self.output_var.set(str(Path(d).parent / "compressed"))

    def pick_output(self):
        d = filedialog.askdirectory(title="اختر مجلد الحفظ")
        if d:
            self.output_var.set(d)

    # ---------- السجل ----------
    def write_log(self, text):
        self.log.config(state="normal")
        self.log.insert("end", text + "\n")
        self.log.see("end")
        self.log.config(state="disabled")

    # ---------- البدء ----------
    def start(self):
        if self.running:
            return
        input_dir = Path(self.input_var.get())
        output_dir = Path(self.output_var.get())

        if not self.input_var.get() or not input_dir.exists():
            messagebox.showerror("خطأ", "اختر مجلد صور صحيح أولًا.")
            return
        if not self.output_var.get():
            messagebox.showerror("خطأ", "اختر مجلد الحفظ.")
            return

        try:
            max_size = int(self.maxsize_var.get())
        except ValueError:
            messagebox.showerror("خطأ", "قيمة الأبعاد يجب أن تكون رقمًا.")
            return

        quality = self.quality_var.get()
        recursive = self.recursive_var.get()
        to_webp = self.webp_var.get()

        # تنظيف السجل
        self.log.config(state="normal")
        self.log.delete("1.0", "end")
        self.log.config(state="disabled")

        self.running = True
        self.start_btn.config(state="disabled", text="جارٍ المعالجة...")

        t = threading.Thread(
            target=self.worker,
            args=(input_dir, output_dir, quality, max_size, recursive, to_webp),
            daemon=True)
        t.start()

    # ---------- الخيط العامل ----------
    def worker(self, input_dir, output_dir, quality, max_size, recursive, to_webp):
        pattern = "**/*" if recursive else "*"
        files = [f for f in input_dir.glob(pattern)
                 if f.is_file() and f.suffix.lower() in SUPPORTED]

        if not files:
            self.msg_queue.put(("log", "⚠️ لم يتم العثور على صور في هذا المجلد."))
            self.msg_queue.put(("done", None))
            return

        self.msg_queue.put(("max", len(files)))
        self.msg_queue.put(("log", f"📁 وُجدت {len(files)} صورة. جارٍ المعالجة...\n"))

        total_before = total_after = ok = failed = 0

        for i, f in enumerate(files, 1):
            relative = f.relative_to(input_dir)
            dst = output_dir / relative
            dst.parent.mkdir(parents=True, exist_ok=True)
            try:
                before, after = compress_one(f, dst, quality, max_size, to_webp)
                total_before += before
                total_after += after
                ok += 1
                pct = (1 - after / before) * 100 if before else 0
                self.msg_queue.put(("log",
                    f"✅ {relative}  |  {human_size(before)} → "
                    f"{human_size(after)}  ({pct:.0f}% توفير)"))
            except Exception as e:
                failed += 1
                self.msg_queue.put(("log", f"❌ فشل: {relative}  ({e})"))
            self.msg_queue.put(("progress", i))

        self.msg_queue.put(("log", "\n" + "=" * 40))
        self.msg_queue.put(("log", f"تم بنجاح: {ok} | فشل: {failed}"))
        if total_before:
            saved = (1 - total_after / total_before) * 100
            self.msg_queue.put(("log",
                f"الإجمالي: {human_size(total_before)} → "
                f"{human_size(total_after)}  ({saved:.0f}% توفير)"))
        self.msg_queue.put(("log", f"📂 الحفظ في: {output_dir.resolve()}"))
        self.msg_queue.put(("done", None))

    # ---------- استقبال رسائل الخيط ----------
    def poll_queue(self):
        try:
            while True:
                kind, val = self.msg_queue.get_nowait()
                if kind == "log":
                    self.write_log(val)
                elif kind == "max":
                    self.progress.config(maximum=val, value=0)
                elif kind == "progress":
                    self.progress.config(value=val)
                elif kind == "done":
                    self.running = False
                    self.start_btn.config(state="normal", text="▶  ابدأ الضغط")
                    messagebox.showinfo("اكتمل", "تمّت معالجة الصور.")
        except queue.Empty:
            pass
        self.root.after(100, self.poll_queue)


if __name__ == "__main__":
    root = tk.Tk()
    App(root)
    root.mainloop()
