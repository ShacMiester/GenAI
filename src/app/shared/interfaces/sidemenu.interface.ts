import { Color } from "../ui-elements/gen-ai-typography/typography.models";

export interface SideMenuAction {
  icon: string;
  callback: () => void;
}

export interface SideMenuItem {
  title: string;
  logo: string;
  subItems?: SideMenuItem[];
  titleColor?: Color;
  action?: SideMenuAction;
}