import { setThemeMode, type ThemeMode } from '@utils/theme';
import { copyText } from './clipboard';
import { showToast } from './toast';

// The commands of the site, described as plain data (the server builds the list for the current language,
// see utils/palette-commands.ts) and run here. The command palette and the terminal share both.
export type CommandAction =
  | { type: 'go'; id: string }
  | { type: 'open'; url: string }
  | { type: 'copy'; text: string; success: string; error: string }
  | { type: 'download'; href: string }
  | { type: 'theme'; mode: ThemeMode }
  | { type: 'language'; href: string }
  | { type: 'top' };

export type CommandGroup = 'navigation' | 'actions' | 'theme' | 'language' | 'links' | 'projects';

export interface Command {
  id: string;
  group: CommandGroup;
  title: string;
  // Extra words the search also looks at (other spellings, English names).
  keywords: string;
  action: CommandAction;
}

export const runAction = async (action: CommandAction) => {
  switch (action.type) {
    case 'go': {
      document.getElementById(action.id)?.scrollIntoView();
      history.replaceState(null, '', `#${action.id}`);
      break;
    }
    case 'top':
      window.scrollTo({ top: 0 });
      break;
    case 'open':
      window.open(action.url, '_blank', 'noopener,noreferrer');
      break;
    case 'copy': {
      const copied = await copyText(action.text);
      showToast(copied ? action.success : action.error, copied ? 'success' : 'error');
      break;
    }
    case 'download': {
      const link = document.createElement('a');
      link.href = action.href;
      link.download = '';
      link.click();
      break;
    }
    case 'theme': {
      setThemeMode(action.mode);
      break;
    }
    case 'language':
      window.location.assign(action.href);
      break;
  }
};
