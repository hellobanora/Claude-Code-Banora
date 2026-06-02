# SpineView — Cervical Landmark Detection Model

Train a precise keypoint detection model for cervical lateral X-ray landmark detection.

## What you need

1. **CSXA Dataset** — Download from https://www.scidb.cn/en/detail?dataSetId=8e3b3d5e60a348ba961e19d48b881c90
2. **Google account** — For Google Colab (free GPU)
3. **~2-4 hours** — Training time on Colab free tier

## Steps

### 1. Download the CSXA dataset
- Go to the link above, register/login, download V3.0 zip
- Upload the zip to your Google Drive

### 2. Open the training notebook
- Go to https://colab.research.google.com
- Upload `notebooks/train_cervical_landmarks.ipynb`
- Set runtime to **GPU** (Runtime → Change runtime type → T4 GPU)

### 3. Run the notebook
- Update `DATASET_ZIP` path to where you put the zip in Drive
- Run the "Explore" cell first to see the JSON annotation format
- **IMPORTANT:** Fill in the `CSXA_TO_SPINEVIEW` mapping based on the JSON keys you see
- Then run all remaining cells

### 4. Collect the output
After training, you'll have in Google Drive (`SpineView_Model/`):
- `spine_landmarks_cervical.onnx` — The model (~15MB)
- `model_metadata.json` — Config for browser inference
- `training_curves.png` — Loss/accuracy plots
- `prediction_sample.png` — Visual check of predictions

### 5. Add to PosturePro
```bash
mkdir -p posture-pro/public/models
cp spine_landmarks_cervical.onnx posture-pro/public/models/
cp model_metadata.json posture-pro/public/models/
npm install onnxruntime-web
```

Then tell Claude Code to wire up `onnx-detect.ts` in the analyse page (the code is already written at `src/lib/xray/onnx-detect.ts`).

## Model details

- **Architecture:** HRNet-W18 Small V2 + heatmap head
- **Input:** 384×384 RGB image
- **Output:** 17 heatmaps (96×96), one per landmark
- **Size:** ~15MB ONNX
- **Inference:** ~200ms in browser (ONNX Runtime Web/WASM)
- **Accuracy target:** PCK@5% > 90%
