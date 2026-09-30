import { Link } from '../../core/models';
import { StaticPageContent } from '../static-shell/static-shell.model';

/** `content/pages/<locale>/my-account/help.json` */
export interface HelpContent extends StaticPageContent {
  /** Terms and Conditions / Privacy Policy links at the bottom of the help card. */
  supportLinks: Link[];
}
