// Ikony Lucide używane w designie (architektura: „Komponenty i ich podpięcie”).
// Renderowane w buildzie jako inline SVG przez @lucide/astro, bez JS w przeglądarce.
import ArrowRight from '@lucide/astro/icons/arrow-right';
import Check from '@lucide/astro/icons/check';
import ChevronDown from '@lucide/astro/icons/chevron-down';
import ChevronUp from '@lucide/astro/icons/chevron-up';
import ClipboardCheck from '@lucide/astro/icons/clipboard-check';
import CodeXml from '@lucide/astro/icons/code-xml';
import Coins from '@lucide/astro/icons/coins';
import Cpu from '@lucide/astro/icons/cpu';
import FileText from '@lucide/astro/icons/file-text';
import FlaskConical from '@lucide/astro/icons/flask-conical';
import GraduationCap from '@lucide/astro/icons/graduation-cap';
import Recycle from '@lucide/astro/icons/recycle';
import Rocket from '@lucide/astro/icons/rocket';
import SearchCheck from '@lucide/astro/icons/search-check';
import Send from '@lucide/astro/icons/send';
import ShieldCheck from '@lucide/astro/icons/shield-check';
import UserCog from '@lucide/astro/icons/user-cog';

import type { IconName } from './icon-names';

export type { IconName };

export const icons: Record<IconName, typeof ArrowRight> = {
  'arrow-right': ArrowRight,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'clipboard-check': ClipboardCheck,
  'code-xml': CodeXml,
  coins: Coins,
  cpu: Cpu,
  'file-text': FileText,
  'flask-conical': FlaskConical,
  'graduation-cap': GraduationCap,
  recycle: Recycle,
  rocket: Rocket,
  'search-check': SearchCheck,
  send: Send,
  'shield-check': ShieldCheck,
  'user-cog': UserCog,
};
