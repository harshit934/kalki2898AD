---
license: cc-by-4.0
language:
- te
pipeline_tag: text-to-speech
datasets:
- sulabhkatiyar/indic-tts-mini-24k
- sulabhkatiyar/indic-tts-multilingual-prepared
- ai4bharat/Rasa
tags:
- text-to-speech
- tts
- telugu
- speech-synthesis
- on-device
- cpu
- onnx
inference: false
---

# Indic Tiny TTS: Telugu

<!-- r6:begin:summary -->
A tiny Telugu text-to-speech model: 22.5 million parameters, a female and a male voice, reads Telugu script. On FLORES-200 news sentences it makes fewer recognition errors (2.0 % CER) than 3 other open Telugu models tested. It runs 38× faster than real time on one Apple M1 CPU thread and 7× on one x86 CPU thread, with PyTorch or ONNX Runtime; no GPU needed.
<!-- r6:end:summary -->

<!-- r6:begin:collection -->
Part of the [INDIC TINY TTS MODELS](https://huggingface.co/collections/sulabhkatiyar/indic-tiny-tts-models-6aeae36f954418631a68676d) collection: 12 tiny open models, one per language, for 11 Indian languages and Indian English, with the datasets they were trained on.
<!-- r6:end:collection -->

<!-- r6:begin:traindata -->
**Training data:** [sulabhkatiyar/indic-tts-mini-24k](https://huggingface.co/datasets/sulabhkatiyar/indic-tts-mini-24k): the Telugu female and male voices of AI4Bharat Rasa, 24 kHz, derived from the full-resolution [sulabhkatiyar/indic-tts-multilingual-prepared](https://huggingface.co/datasets/sulabhkatiyar/indic-tts-multilingual-prepared).
<!-- r6:end:traindata -->

<!-- r6:begin:bench -->
## Other open Telugu models, same test

### FLORES-200 news sentences (100)

**Fewer recognition errors than these 3 open Telugu models; the same as 3 larger models.**

![Character error rate: this model and the other open Telugu models](https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu/resolve/main/assets/bench_flores.png)

| Model | Size | CER, % | Extra errors vs this model, points (95 % CI) | Result |
|---|---:|---:|---:|---|
| **This model** | 22.5 M | **1.99** | | |
| `ai4bharat/IndicF5` | 350.6 M | 1.29 | -0.70 [-1.10, -0.22] | theirs better |
| `github.com/AI4Bharat/Indic-TTS` (te.zip) | 65.6 M | 2.00 | +0.01 [-0.37, +0.40] | same |
| `ai4bharat/indic-parler-tts` | 937.8 M | 2.12 | +0.13 [-0.29, +0.54] | same |
| `SYSPIN/vits_Telugu_Female` + `SYSPIN/vits_Telugu_Male` | 29.1 M | 2.39 | +0.41 [-0.01, +0.83] | same |
| `rhasspy/piper-voices` (te_IN-padmavathi-medium, te_IN-venkatesh-medium) | 15.9 M | 2.97 | +0.98 [+0.43, +1.58] | ours better |
| `ai4bharat/vits_rasa_13` | 31.3 M | 3.56 | +1.57 [+0.91, +2.24] | ours better |
| `facebook/mms-tts-tel` | 29.1 M | 4.59 | +2.60 [+1.97, +3.25] | ours better |

### Held-out test sentences (300)

**Fewer recognition errors than these 3 open Telugu models; the same as one larger model.**

![Character error rate: this model and the other open Telugu models](https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu/resolve/main/assets/bench_rasa.png)

| Model | Size | CER, % | Extra errors vs this model, points (95 % CI) | Result |
|---|---:|---:|---:|---|
| **This model** | 22.5 M | **4.66** | | |
| `github.com/AI4Bharat/Indic-TTS` (te.zip) | 65.6 M | 5.20 | +0.53 [-0.48, +1.66] | same |
| `rhasspy/piper-voices` (te_IN-padmavathi-medium, te_IN-venkatesh-medium) | 15.9 M | 6.67 | +2.00 [+0.81, +3.17] | ours better |
| `SYSPIN/vits_Telugu_Female` + `SYSPIN/vits_Telugu_Male` | 29.1 M | 8.82 | +4.16 [+2.15, +6.33] | ours better |
| `facebook/mms-tts-tel` | 29.1 M | 10.02 | +5.36 [+3.87, +7.09] | ours better |
| *Also trained on same speaker voices:* | | | | |
| `ai4bharat/vits_rasa_13` | 31.3 M | 6.78 | +2.12 [+1.17, +3.08] | ours better |

### Larger models, same held-out sentences

- ~120× faster than `ai4bharat/indic-parler-tts` on T4
- Same error rate as `ai4bharat/IndicF5` at 1/16 the size, ~169× faster on T4

![Character error rate: this model and the larger open Telugu models, on the same sentences](https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu/resolve/main/assets/bench_big.png)

| Model | Size | Sentences | CER, % | This model, same sentences, % | Extra errors vs this model, points (95 % CI) | Result |
|---|---:|---:|---:|---:|---:|---|
| *Also trained on same speaker voices:* | | | | | | |
| `ai4bharat/IndicF5` | 350.6 M | 40 | 2.64 | 4.69 | -2.04 [-4.13, +0.14] | same |
| `ai4bharat/indic-parler-tts` | 937.8 M | 40 | 3.15 | 4.69 | -1.53 [-2.94, -0.45] | theirs better |

CER = character error rate, lower is better; size = parameters. Method: see the Appendix.
<!-- r6:end:bench -->

<!-- r6:begin:speed -->
## Speed

| Hardware | Setting | Faster than real time | Real-time factor |
|---|---|---:|---:|
| x86 CPU (Kaggle notebook, Intel Xeon @ 2.20GHz, 4 vCPU) | PyTorch, 1 thread | **7×** | 0.136 |
| Apple M1 laptop, CPU | PyTorch, 1 thread | **38×** | 0.026 |
| NVIDIA T4 GPU | PyTorch | **62×** | 0.016 |

Real-time factor = total synthesis time ÷ total audio length over 30 held-out sentences (lower is faster).
<!-- r6:end:speed -->

<!-- r6:begin:samples -->
## Listen

Clips made by this model for sentences from the held-out evaluation set; never used in training.

**Female voice** (`voice="female"`)

<audio controls src="https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu/resolve/main/samples/female_1.wav"></audio>

ఉపాధ్యాయులను కూడా చాలా తరచుగా సహాయం కోసం అడుగుతూ ఉండాలి.<br>
*Transliteration:* Upadhyayulanu kuda chala tarachuga sahayam kosam adugutu undali.<br>
*Translation (approx.):* You should also keep asking the teachers for help quite often.

<audio controls src="https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu/resolve/main/samples/female_2.wav"></audio>

అవును, నువ్వు ఆస్ట్రేలియాలో మీ తమ్ముడికి చాలా తరచుగా డబ్బు పంపుతావని తెలుసు.<br>
*Transliteration:* Avunu, nuvvu astreliyalo mi tammudiki chala tarachuga dabbu pamputavani telusu.<br>
*Translation (approx.):* Yes, I know you send money to your younger brother in Australia quite often.

<audio controls src="https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu/resolve/main/samples/female_3.wav"></audio>

ఇంతేకాకుండా, పట్టణ స్థావరాల కోసం రూపొందించబడని కోటలను మినహాయించారు.<br>
*Transliteration:* Intekakunda, pattana sthavarala kosam rupondinchabadani kotalanu minahayincharu.<br>
*Translation (approx.):* Besides this, forts not designed for urban settlements were left out.

<audio controls src="https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu/resolve/main/samples/female_4.wav"></audio>

కానీ వ్యాసం బాగా కనిపించడం కోసం బొమ్మలు స్థానాలు మార్చాను.<br>
*Transliteration:* Kani vyasam baga kanipinchadam kosam bommalu sthanalu marchanu.<br>
*Translation (approx.):* But I moved the pictures around so the article would look good.

**Male voice** (`voice="male"`)

<audio controls src="https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu/resolve/main/samples/male_1.wav"></audio>

అందుకే ప్రభుత్వం సాధ్యమైనంత ఎక్కువ గ్రామాలకు శుభ్రమైన నీటిని అందిస్తోంది.<br>
*Transliteration:* Anduke prabhutvam sadhyamainanta ekkuva gramalaku shubhramaina nitini andistondi.<br>
*Translation (approx.):* That is why the government is supplying clean water to as many villages as possible.

<audio controls src="https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu/resolve/main/samples/male_2.wav"></audio>

రాష్ట్రంలో అనేక కొత్త విద్యుత్ ప్రాజెక్టులు రాబోతున్నాయి, ఇవి రాష్ట్రంలో అదనపు విద్యుత్ సామర్థ్యాన్ని ఉత్పత్తి చేయగలవని భావిస్తున్నారు.<br>
*Transliteration:* Rashtranlo aneka kotta vidyut prajektulu rabotunnayi, ivi rashtranlo adanapu vidyut samarthyanni utpatti cheyagalavani bhavistunnaru.<br>
*Translation (approx.):* Many new power projects are coming up in the state, and they are expected to generate additional power capacity in the state.

<audio controls src="https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu/resolve/main/samples/male_3.wav"></audio>

దాద్రా మరియు నగర్ హవేలీ మరియు డామన్ మరియు డయ్యూ ఇద్దరు సభ్యులను భారత పార్లమెంటు దిగువ సభ అయిన లోక్సభకు పంపుతుంది.<br>
*Transliteration:* Dadra mariyu nagar haveli mariyu daman mariyu dayyu iddaru sabhyulanu bharata parlamentu diguva sabha ayina loksabhaku pamputundi.<br>
*Translation (approx.):* Dadra and Nagar Haveli and Daman and Diu sends two members to the Lok Sabha, the lower house of the Indian Parliament.

<audio controls src="https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu/resolve/main/samples/male_4.wav"></audio>

మీ వ్యాపారం యొక్క స్వరూపము బట్టి, మీరు కొత్త రాష్ట్రంలో నడిపించడానికి లైసెన్సులు అవసరం ఉంటుంది.<br>
*Transliteration:* Mi vyaparam yokka svarupamu batti, miru kotta rashtranlo nadipinchadaniki laisensulu avasaram untundi.<br>
*Translation (approx.):* Depending on the nature of your business, you will need licences to operate in the new state.

If the players do not show, the files are in [samples/](https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu/tree/main/samples).
<!-- r6:end:samples -->

## Quick start

```bash
pip install torch numpy safetensors huggingface_hub
```

```python
import sys
from huggingface_hub import snapshot_download

sys.path.insert(0, snapshot_download("sulabhkatiyar/indic-tiny-tts-telugu", ignore_patterns=["onnx/*"]))  # model + its small Python package
from indic_tiny_tts import TinyTTS

tts = TinyTTS.from_pretrained("sulabhkatiyar/indic-tiny-tts-telugu")  # uses the NVIDIA GPU if there is one, else the CPU
wav = tts.synthesize("నమస్కారం! ఈ రోజు వాతావరణం చాలా బాగుంది.", voice="female")
tts.save_wav(wav, "hello.wav")
```

`wav` is a NumPy array of 24 kHz audio. `voice` is `"female"` or `"male"`. Optional: `speed=1.2` speaks faster, and `seed=0` gives the same output every time.

### Choose where it runs

```python
tts = TinyTTS.from_pretrained("sulabhkatiyar/indic-tiny-tts-telugu", device="cpu")               # any computer
tts = TinyTTS.from_pretrained("sulabhkatiyar/indic-tiny-tts-telugu", device="cuda")              # NVIDIA GPU
tts = TinyTTS.from_pretrained("sulabhkatiyar/indic-tiny-tts-telugu", device="cpu", threads=1)    # Mac with Apple silicon (fastest there)
```

On a Mac, `device="mps"` (the Apple GPU) also works, but for a model this small the CPU with one thread is faster.

### Without PyTorch (ONNX Runtime)

The `onnx/` folder holds the same model as three ONNX graphs. This path needs only NumPy and ONNX Runtime:

```bash
pip install onnxruntime numpy huggingface_hub
```

```python
import sys
from huggingface_hub import snapshot_download

folder = snapshot_download("sulabhkatiyar/indic-tiny-tts-telugu", ignore_patterns=["*.safetensors"])
sys.path.insert(0, folder)
from indic_tiny_tts import TinyTTSOnnx

tts = TinyTTSOnnx.from_pretrained(folder)
wav = tts.synthesize("నమస్కారం! ఈ రోజు వాతావరణం చాలా బాగుంది.", voice="male")
tts.save_wav(wav, "hello.wav")
```

### Install as a package (optional)

This adds an `indic-tiny-tts` command:

```bash
hf download sulabhkatiyar/indic-tiny-tts-telugu --local-dir indic-tiny-tts-telugu
pip install ./indic-tiny-tts-telugu
indic-tiny-tts "నమస్కారం! ఈ రోజు వాతావరణం చాలా బాగుంది." --model ./indic-tiny-tts-telugu --voice male -o hello.wav
```

<!-- r6:begin:speedcode -->
### Measure the speed

Inside the downloaded folder:

```bash
python -m indic_tiny_tts.latency --model . --device cpu --threads 1
python -m indic_tiny_tts.latency --model . --backend onnx --threads 4   # the ONNX version
```
<!-- r6:end:speedcode -->

## Details

| | |
|---|---|
| Language | Telugu (Telugu script) |
| Voices | `female`, `male` |
| Audio | 24 kHz, mono |
| Size | 22.5 million parameters (about 90 MB per format: PyTorch or ONNX) |
| Runs on | CPU (Windows, Linux, Mac), NVIDIA GPU (CUDA), Apple silicon |
| Needs | Python 3.9+ and PyTorch, or ONNX Runtime. No eSpeak or other system packages. |

## How good is it?

On held-out sentences a speech recogniser understood this model about as well as the real recordings: 4.66 % vs 4.11 % of characters misheard.

## Good to know

- **Telugu script only.** English words in Latin letters (`hello`) are skipped with a warning. Write them in Telugu script.
- **Whole numbers are read out in Telugu:** `25` becomes ఇరవై ఐదు and `2024` becomes రెండు వేల ఇరవై నాలుగు. Decimals, percentages and currency (`3.5%`, `₹500`) are not converted yet and are skipped, so write them in words. Times such as `10:30` and phone numbers are not read correctly yet, so write them out in words if that matters.
- **Long text is fine.** It is split into sentences at `।`, `?`, `!` and `.`, which are spoken one after another.
- **Style:** a calm reading voice. The model learned from about 32 hours of studio speech by two speakers.
- **Female voice: some sounds are held a little long.** In 31 of 150 test sentences, one or two sounds last 0.28 to 0.40 s. The real recordings of this speaker show the same pattern (37 of 150 sentences), so the model learned it from the data. Our automatic check for stuck or drawn-out sounds therefore flags this voice.
- **Speaking rate:** each voice has a default speed matched to its speaker on held-out data (`length_scale` in `config.json`: te_F 0.994, te_M 1.002). `speed=` scales it further.
- **Please use it responsibly.** Do not use it to pass yourself off as the original speakers or to mislead people.

## Training data and credits

- **Voices: the Rasa dataset by AI4Bharat** ([ai4bharat/Rasa](https://huggingface.co/datasets/ai4bharat/Rasa)), licence CC-BY-4.0. We used the Telugu female (16.8 h) and male (15.3 h) speakers: the read, conversation and command recordings, leaving out the emotional ones. Our changes: audio resampled from 48 kHz to 24 kHz; clips shorter than 0.5 s or longer than 20 s left out; text normalised (for example, numbers written out in words); training clips that a speech recogniser could not match to their text (character error rate above 25 %, or a length mismatch) left out: 1.45 % of the female and 1.32 % of the male clips. Prepared data: [sulabhkatiyar/indic-tts-mini-24k](https://huggingface.co/datasets/sulabhkatiyar/indic-tts-mini-24k) (revision `8fe16c93`).
- **Vocoder:** [Vocos](https://github.com/gemelo-ai/vocos), with the pretrained [charactr/vocos-mel-24khz](https://huggingface.co/charactr/vocos-mel-24khz) weights used unchanged (MIT licence; trained by its authors on LibriTTS).
- **Model design:** based on [Matcha-TTS](https://github.com/shivammehta25/Matcha-TTS) (MIT licence). The acoustic model (8.9 million parameters) reads characters directly (no phonemiser) and was trained from scratch on the data above for 145,825 steps (batch 32, about 10 hours on one NVIDIA T4); the released weights are the averaged (EMA) weights at that step.
- **Number reading:** word tables adapted from AI4Bharat's [indic-numtowords](https://github.com/AI4Bharat/indic-numtowords) (MIT licence).
- **Evaluation tools:** AI4Bharat IndicConformer (speech recognition) and SpeechBrain ECAPA (speaker similarity).

## Licence

- Acoustic model weights (`model.safetensors`, `onnx/text_encoder.onnx`, `onnx/flow_decoder.onnx`): **CC-BY-4.0**. You may use them, also commercially, if you give credit to this model and to the Rasa dataset (see Citation).
- Vocoder weights (`vocoder.safetensors`, `onnx/vocoder.onnx`): the unchanged pretrained Vocos weights, **MIT** licence by their authors.
- Code (`indic_tiny_tts/`): **MIT**.
- Details and third-party notices: [LICENSE.md](LICENSE.md).

## Citation

If you use this model, please cite it:

```bibtex
@misc{katiyar2026indictinyttstelugu,
  author       = {Sulabh Katiyar},
  title        = {Indic Tiny TTS: Telugu},
  year         = {2026},
  publisher    = {Hugging Face},
  howpublished = {\url{https://huggingface.co/sulabhkatiyar/indic-tiny-tts-telugu}}
}
```

Please also cite the dataset and the work it builds on:

```bibtex
@inproceedings{ai4bharat2024rasa,
  author    = {Praveen Srinivasa Varadhan and Ashwin Sankar and Giri Raju and Mitesh M. Khapra},
  title     = {{Rasa: Building Expressive Speech Synthesis Systems for Indian Languages in Low-resource Settings}},
  booktitle = {Proc. INTERSPEECH 2024},
  year      = {2024}
}

@inproceedings{mehta2024matcha,
  author    = {Shivam Mehta and Ruibo Tu and Jonas Beskow and {\'E}va Sz{\'e}kely and Gustav Eje Henter},
  title     = {{Matcha-TTS}: A fast {TTS} architecture with conditional flow matching},
  booktitle = {Proc. ICASSP 2024},
  year      = {2024}
}

@inproceedings{siuzdak2024vocos,
  author    = {Hubert Siuzdak},
  title     = {Vocos: Closing the gap between time-domain and Fourier-based neural vocoders for high-quality audio synthesis},
  booktitle = {Proc. ICLR 2024},
  year      = {2024}
}
```

<!-- r6:begin:appendix -->
## Appendix: how we evaluated

Every model spoke the same text: 300 held-out test sentences from both voices, never used in training, and 100 FLORES-200 news sentences. A speech recognition model (AI4Bharat IndicConformer-600M) transcribed each clip, and the score is its character error rate (CER). A paired bootstrap 95 % confidence interval of the CER difference over the same sentences decides each result: better when the whole interval favours this model, the same when it includes zero, worse when it favours the other model. The larger models read the first 40 of the held-out sentences (20 per voice) unless the table shows a larger number, and all 100 FLORES-200 sentences.
<!-- r6:end:appendix -->
