// Read-aloud for young readers, using only the browser's built-in Web Speech API.
// No network calls and no third-party service: the voice comes from the device.
//
// Markup:
//   <button data-speak="Text to read">            reads the given text
//   <button data-speak-target="#some-id">         reads that element's text
// When the device has no voice for the page language the button stays visible
// but is blocked, and its tooltip says why and how to fix it.

const SPEAKING_CLASS = 'is-speaking';
const KID_RATE = 0.9;

// Regional fallbacks, closest accent first.
const FALLBACKS: Record<string, string[]> = {
  es: ['es-AR', 'es-419', 'es-US', 'es-MX', 'es-ES'],
  en: ['en-US', 'en-GB'],
};

type Reason = 'noVoice' | 'noSupport';

const BLOCKED_TITLES: Record<string, Record<Reason, string>> = {
  es: {
    noVoice:
      'Este dispositivo no tiene una voz en español. Para activarla, agregá una voz en español en Configuración → Idioma → Voz y volvé a cargar la página.',
    noSupport: 'Este navegador no puede leer en voz alta. Probá con Chrome, Edge o Safari.',
  },
  en: {
    noVoice:
      'This device has no English voice. To turn it on, add an English voice in Settings → Language → Speech and reload the page.',
    noSupport: 'This browser cannot read aloud. Try Chrome, Edge or Safari.',
  },
};

function block(buttons: HTMLElement[], lang: string, reason: Reason): void {
  const base = normalize(lang).split('-')[0];
  const title = (BLOCKED_TITLES[base] ?? BLOCKED_TITLES.es)[reason];
  buttons.forEach((button) => {
    // aria-disabled (not `disabled`) keeps the button focusable so the tooltip
    // is reachable by keyboard and shows on hover in every browser.
    button.setAttribute('aria-disabled', 'true');
    button.title = title;
    button.setAttribute('aria-description', title);
  });
}

function synth(): SpeechSynthesis | null {
  return typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
}

function normalize(tag: string): string {
  return tag.replace('_', '-').toLowerCase();
}

export function pickVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | null {
  const base = normalize(lang).split('-')[0];
  const sameLanguage = voices.filter((voice) => normalize(voice.lang).split('-')[0] === base);
  if (!sameLanguage.length) return null;

  const order = [lang, ...(FALLBACKS[base] ?? [])].map(normalize);
  for (const tag of order) {
    const matches = sameLanguage.filter((voice) => normalize(voice.lang) === tag);
    // Prefer a voice stored on the device so reading works offline and starts fast.
    const match = matches.find((voice) => voice.localService) ?? matches[0];
    if (match) return match;
  }
  return sameLanguage[0];
}

function loadVoices(engine: SpeechSynthesis): Promise<SpeechSynthesisVoice[]> {
  const ready = engine.getVoices();
  if (ready.length) return Promise.resolve(ready);

  return new Promise((resolve) => {
    const finish = (): void => resolve(engine.getVoices());
    engine.addEventListener('voiceschanged', finish, { once: true });
    // Some browsers never fire the event when there are no voices at all.
    window.setTimeout(finish, 1500);
  });
}

function textFor(button: HTMLElement): string {
  const direct = button.dataset.speak;
  if (direct) return direct;
  const selector = button.dataset.speakTarget;
  const target = selector ? document.querySelector<HTMLElement>(selector) : null;
  return target?.innerText?.replace(/\s+/g, ' ').trim() ?? '';
}

function setSpeaking(button: HTMLElement, speaking: boolean): void {
  button.classList.toggle(SPEAKING_CLASS, speaking);
  button.setAttribute('aria-pressed', String(speaking));
}

export async function initListenButtons(root: ParentNode = document): Promise<void> {
  const buttons = Array.from(root.querySelectorAll<HTMLElement>('[data-speak], [data-speak-target]'));
  if (!buttons.length) return;

  const lang = document.documentElement.lang || 'es-AR';
  const engine = synth();
  if (!engine) {
    block(buttons, lang, 'noSupport');
    return;
  }

  const voice = pickVoice(await loadVoices(engine), lang);
  if (!voice) {
    block(buttons, lang, 'noVoice');
    return;
  }

  let current: HTMLElement | null = null;

  const stop = (): void => {
    engine.cancel();
    if (current) setSpeaking(current, false);
    current = null;
  };

  buttons.forEach((button) => {
    button.setAttribute('aria-pressed', 'false');

    button.addEventListener('click', () => {
      const wasSpeaking = current === button;
      stop();
      if (wasSpeaking) return;

      const text = textFor(button);
      if (!text) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = KID_RATE;
      const done = (): void => {
        if (current === button) {
          setSpeaking(button, false);
          current = null;
        }
      };
      utterance.addEventListener('end', done);
      utterance.addEventListener('error', done);

      current = button;
      setSpeaking(button, true);
      engine.speak(utterance);
    });
  });

  // Never keep talking after the child leaves the page.
  window.addEventListener('pagehide', stop);
}
