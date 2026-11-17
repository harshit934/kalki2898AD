# Telugu Kalki 2898 AD dialogue placeholders

No movie audio is bundled. The application only loads a clip after a matching
dialogue event or a manual preview. Add only recordings you have permission to
use from the Telugu feature film. Do not scrape streaming/video sites, extract
unauthorized movie audio, or include material from the separate animated prelude.

## Candidate clip inventory

| Character | Dialogue identification / scene target | Meme category | Suggested trigger | Verification | Placeholder |
| --- | --- | --- | --- | --- | --- |
| Bhairava | Undefeated-fighter boast; the user identified the line as “Oka fight kuda odipoledu.” Exact film scene and wording still need confirmation. | Confident / bravado | Enemy encounter; special attack | User-supplied identification only; not independently verified | `bhairava/confident/undefeated-fighter.ogg` |
| Bhairava | Bounty-hunter swagger / self-promotional quip. This is a scene-level research lead, not a confirmed transcript. | Confident / comic bravado | Enemy encounter only after scene verification | Character role is sourced; specific line is unverified and not mapped automatically | `bhairava/comic/bounty-hunter-brag.ogg` |
| Ashwatthama | Guardian / prophecy warning. No exact line or timestamp is asserted. | Dramatic / grave | No automatic trigger until an in-film clip is matched to the event | Character/story context sourced; dialogue unverified | `ashwatthama/dramatic/guardian-warning.ogg` |
| Supreme Yaskin | Complex ruler / immortality menace. No exact line or timestamp is asserted. | Menacing / dramatic | Boss encounter | Character/story context sourced; dialogue unverified | `yaskin/menacing/complex-ruler.ogg` |

These are not an exhaustive dialogue list. The audio manager currently maps only
the user-identified Bhairava boast to enemy/special-attack contexts. The other
entries are manual-preview research leads, not automatic triggers. Other gameplay
events intentionally have no automatic dialogue until a relevant feature-film
line is verified. Unmapped events return `no-match` rather than playing an
unrelated clip.

No Bujji dialogue is included yet: the sources located during this pass discussed
Bujji in promotional footage or the separately released *Bujji & Bhairava*
animated prelude, and did not verify a meme-worthy Bujji line from the Telugu
feature film. That animated-series material is intentionally excluded.

## Add a clip

Create the matching subdirectory and place the authorized recording at its
placeholder path, for example:

```text
public/audio/kalki/bhairava/confident/undefeated-fighter.ogg
```

Use short, trimmed Ogg Vorbis clips. Keep a separate record of source, written
permission, and any required attribution. Confirm that each recording is the
Telugu theatrical feature-film audio before enabling its trigger or subtitle.

## Research references

- [The Indian Express: Kalki 2898 AD prelude titled Bujji and Bhairava](https://indianexpress.com/article/entertainment/telugu/kalki-2898-ad-prelude-titled-bujji-and-bhairava-9355256/) distinguishes the animated prelude from the feature film.
- [First India / Prime Video announcement: B&B animated prelude](https://firstindia.co.in/news/bollywood/prime-video-to-premiere-bb-bujji-bhairava-the-two-episode-riveting-animated-prelude-to-the-groundbreaking-prabhas-starrer-kalki-2898-ad-streaming-exclusively-from-may-31) explicitly describes the separate series.
- [The Indian Express: Bujji and Bhairava feature-film roles](https://indianexpress.com/article/entertainment/telugu/kalki-2898-ad-meet-prabhas-aka-bhairavas-best-friend-bujj-9338174/) supports character/vehicle context, but its quoted remarks are from a making-of promotional video and are not treated here as movie dialogue.
- [Telugu Adda: release-day meme roundup](https://teluguadda.co.in/trending-memes-on-kalki-2898-ad-release/) documents general social-media meme activity, not the popularity of a specific dialogue.
- [Filmy Focus: dialogue roundup](https://telugu.filmyfocus.com/kalki-2898-ad-movie-best-dialogues) is a lead for checking the film, but its dialogue cards are images and do not establish meme popularity or exact scene timing in this implementation.
- [JustWatch synopsis](https://www.justwatch.com/in/movie/kalki-2898-ad) and [the film overview](https://en.wikipedia.org/wiki/Kalki_2898_AD) were used only as story/character context, not as dialogue transcripts.
