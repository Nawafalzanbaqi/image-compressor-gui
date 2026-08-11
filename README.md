# Image Compressor

Batch image compression tools built with Python and [Pillow](https://python-pillow.org/) — available as both a **GUI application** and a **command-line script**. Compress entire folders of images while preserving visual quality, with optional resizing and WebP conversion.

> The user interface and console output are in Arabic.

## Features

- **Batch processing** — compress every image in a folder (optionally including subfolders, preserving their structure)
- **Supported formats**: JPG / JPEG / PNG / WebP / TIFF / BMP
- **Quality control** — adjustable JPEG/WebP quality (default: 85)
- **Smart resizing** — downscale images larger than a maximum dimension while keeping aspect ratio (default: 2000 px, LANCZOS resampling)
- **EXIF orientation fix** — phone photos keep their correct rotation
- **Optional WebP conversion** — convert everything to WebP for maximum savings (GUI)
- **Savings report** — per-file and total before/after sizes with percentage saved
- **Safe** — originals are never touched; compressed copies go to a separate output folder

## Requirements

- Python 3.8+
- Pillow (`pip install -r requirements.txt`)
- Tkinter for the GUI (bundled with most Python installs; on Debian/Ubuntu: `sudo apt install python3-tk`)

## Usage

### GUI

```bash
python compress_gui.py
```

Pick an input folder, tweak quality / max size / WebP options, and press start. Progress, per-file results, and total savings are shown live.

### Command line

```bash
# Simplest form: reads ./images, writes ./compressed
python compress_images.py

# Full control
python compress_images.py --input photos --output out --quality 80 --max-size 1600 --recursive
```

| Option | Short | Default | Description |
|---|---|---|---|
| `--input` | `-i` | `images` | Source folder |
| `--output` | `-o` | `compressed` | Destination folder |
| `--quality` | `-q` | `85` | JPEG/WebP quality (1–100) |
| `--max-size` | `-m` | `2000` | Max width/height in px (`0` = keep dimensions) |
| `--recursive` | `-r` | off | Process subfolders too |

### Example output

```
✅ photo1.jpg  |  4.2 MB → 812.3 KB  (81% saved)
✅ photo2.png  |  2.1 MB → 1.4 MB  (33% saved)
==================================================
Processed 2 images successfully, 0 failed.
Total: 6.3 MB → 2.2 MB — 65% saved
```

## How it works

- **JPEG**: re-encoded with `optimize=True` and progressive encoding
- **PNG**: lossless `optimize=True` compression
- **WebP**: quality-controlled encoding with `method=6` (best compression)
- **TIFF/BMP**: resized and re-saved as-is
- Images with transparency are converted to RGB before JPEG encoding

## License

MIT
