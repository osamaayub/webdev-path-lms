export const THEME_KEY = "webdev-path:theme";

/** Runs before first paint (inline in <head>) so the page never flashes the wrong theme. */
export const themeScript = `try{var t=localStorage.getItem("${THEME_KEY}");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;
