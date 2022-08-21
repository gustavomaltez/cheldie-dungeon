import { getRandomHexColor } from '@utils';

import { Logger } from './abstract';

export class BrowserLogger extends Logger {

  private ownerColor = getRandomHexColor(this.settings.owner);

  public info(message: string, data?: unknown): void {
    const text = this.getMessageText(message, 'INFO');
    if (!data) console.log(text, 'color: #cbebfb', `color: #${this.ownerColor}`, 'background: #202124; color: #ececec');
    else console.log(text, 'color: #cbebfb', `color: #${this.ownerColor}`, 'background: #202124; color: #ececec', data);
  }

  public warn(message: string, data?: unknown): void {
    const text = this.getMessageText(message, 'WARN');
    if (!data) console.log(text, 'color: #ffe186', `color: #${this.ownerColor}`, 'background: #202124; color: #ececec');
    else console.log(text, 'color: #ffe186', `color: #${this.ownerColor}`, 'background: #202124; color: #ececec', data);
  }

  public error(message: string, data?: unknown): void {
    const text = this.getMessageText(message, 'ERROR');
    if (!data) console.log(text, 'color: #ff6c6b', `color: #${this.ownerColor}`, 'background: #202124; color: #ececec');
    else console.log(text, 'color: #ff6c6b', `color: #${this.ownerColor}`, 'background: #202124; color: #ececec', data);
  }

  // Helpers -------------------------------------------------------------------

  private getMessageText(message: string, level: string): string {
    return `%c[${level}] %c[${this.settings.owner}] %c${message}`;
  }
}