import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Floating button that opens a WhatsApp chat with Aljory Cleaning Services. */
@Component({
  selector: 'app-whatsapp-button',
  templateUrl: './whatsapp.html',
  styleUrl: './whatsapp.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatsappButton {}
