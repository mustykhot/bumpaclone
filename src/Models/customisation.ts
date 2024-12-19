export interface ILayoutContent {
  status: boolean;
  use_content?: boolean;
  message?: string;
  twitter?: null | string;
  facebook?: null | string;
  whatsapp?: null | string;
  instagram?: null | string;
  banner_image?: string;
  banner_title?: string;
  banner_subtitle?: string;
  heading?: string;
  subheading?: string;
  url?: string;
}

export interface ITheme {
  red: string;
  blue: string;
  green: string;
}

export interface ILayout {
  about_us: ILayoutContent;
  newsletter: ILayoutContent;
  hero_banner: ILayoutContent;
  favicon: ILayoutContent;
  theme_color?: ITheme;
  social_links: ILayoutContent;
  return_policy: ILayoutContent;
  custom_message: ILayoutContent;
  banner: ILayoutContent;
  product_listing: string;
  first_time_customize?: boolean;
}

export interface IColor {
  color: string;
  desktop_image: string;
}
