enum MediaSize {
  XXXL = "min-width: 1440px",
  XXL = "min-width: 1280px",
  XL = "min-width: 960px",
  LG = "min-width: 840px",
  MD = "min-width: 600px",
  SM = "min-width: 480px",
  XS = "min-width: 320px",
  XXS = "min-width: 0px",
  XXXS = "min-width: 0px",

  XXXL_MAX = "max-width: 1600px",
  XXL_MAX = "max-width: 1440px",
  XL_MAX = "max-width: 1280px",
  LG_MAX = "max-width: 960px",
  MD_MAX = "max-width: 840px",
  SM_MAX = "max-width: 600px",
  XS_MAX = "max-width: 480px",
  XXS_MAX = "max-width: 320px",
  XXXS_MAX = "max-width: 0px",
}

export const media = {
  MIN: {
    XXXL: createMatch(MediaSize.XXXL),
    XXL: createMatch(MediaSize.XXL),
    XL: createMatch(MediaSize.XL),
    LG: createMatch(MediaSize.LG),
    MD: createMatch(MediaSize.MD),
    SM: createMatch(MediaSize.SM),
    XS: createMatch(MediaSize.XS),
    XXS: createMatch(MediaSize.XXS),
    XXXS: createMatch(MediaSize.XXXS),
  },
  MAX: {
    XXXL: createMatch(MediaSize.XXXL_MAX),
    XXL: createMatch(MediaSize.XXL_MAX),
    XL: createMatch(MediaSize.XL_MAX),
    LG: createMatch(MediaSize.LG_MAX),
    MD: createMatch(MediaSize.MD_MAX),
    SM: createMatch(MediaSize.SM_MAX),
    XS: createMatch(MediaSize.XS_MAX),
    XXS: createMatch(MediaSize.XXS_MAX),
    XXXS: createMatch(MediaSize.XXXS_MAX),
  },
  STANDALONE: createMatch("(display-mode: standalone)"),
  REDUCED_MOTION: createMatch("(prefers-reduced-motion: reduce)"),
  DARK_MODE: createMatch("(prefers-color-scheme: dark)"),
  LIGHT_MODE: createMatch("(prefers-color-scheme: light)"),
};

function createMatch(
  query: string
): (callback?: (matches: boolean) => void) => boolean | (() => void) {
  return function match(callback?: (matches: boolean) => void) {
    const mediaQuery = window.matchMedia(query);
    if (callback) {
      function executeCb({ matches }: MediaQueryListEvent) {
        callback?.(matches);
      }
      mediaQuery.addEventListener("change", executeCb);
      callback(mediaQuery.matches);
      return () => {
        mediaQuery.removeEventListener("change", executeCb);
      };
    }
    return mediaQuery.matches;
  };
}
