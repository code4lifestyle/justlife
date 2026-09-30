import { StaticPageContent } from '../static-shell/static-shell.model';

/** `content/pages/<locale>/{privacy,terms}.json` */
export interface LegalContent extends StaticPageContent {
  /** Document HTML. Links to pages the app has use app routes (e.g. `/en-AE/privacy`); appContentLinks routes them in the app. */
  html: string;
}
