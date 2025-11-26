import {
  MessageSquare,
  Heart,
  Calendar,
  MapPin,
  Link2,
  Folder,
  ChevronDown,
  ArrowLeft,
  Home,
  ExternalLink,
  Bell,
  Newspaper,
  Rocket,
  HelpCircle,
  ClipboardList,
  Lightbulb,
  Zap,
  Pin,
  Pencil,
  User,
  Settings,
  FileText,
  LogOut,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { CSSProperties } from 'react';

interface IconProps {
  icon: 'comment' | 'heart' | 'calendar' | 'mapMarker' | 'link' | 'folder' | 'chevronDown' | 'arrowLeft' | 'home' | 'external' | 'bell' | 'chat' | 'feed' | 'rocket' | 'help' | 'clipboard' | 'lightbulb' | 'zap' | 'pin' | 'pencil' | 'user' | 'settings' | 'fileText' | 'logOut' | 'sun' | 'moon' | 'monitor';
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export function Icon({ icon, size = 24, className = '', style }: IconProps) {
  const iconMap = {
    comment: MessageSquare,
    heart: Heart,
    calendar: Calendar,
    mapMarker: MapPin,
    link: Link2,
    folder: Folder,
    chevronDown: ChevronDown,
    arrowLeft: ArrowLeft,
    home: Home,
    external: ExternalLink,
    bell: Bell,
    chat: MessageSquare,
    feed: Newspaper,
    rocket: Rocket,
    help: HelpCircle,
    clipboard: ClipboardList,
    lightbulb: Lightbulb,
    zap: Zap,
    pin: Pin,
    pencil: Pencil,
    user: User,
    settings: Settings,
    fileText: FileText,
    logOut: LogOut,
    sun: Sun,
    moon: Moon,
    monitor: Monitor,
  };

  const LucideIcon = iconMap[icon];

  if (!LucideIcon) return null;

  return <LucideIcon size={size} className={className} style={style} />;
}
