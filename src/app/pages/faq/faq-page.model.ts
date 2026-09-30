import { AppDownloaderContent } from '../static-shell/app-downloader';
import { StaticPageContent } from '../static-shell/static-shell.model';

/** `content/pages/<locale>/faq.json` */
export interface FaqContent extends StaticPageContent {
  categories: FaqCategory[];
  appDownloader: AppDownloaderContent;
}

export interface FaqCategory {
  name: string;
  items: FaqItem[];
}

export interface FaqItem {
  question: string;
  /** Answer HTML. Links to pages the app has use app routes (e.g. `/en-AE/terms`); appContentLinks routes them in the app. */
  answer: string;
}
