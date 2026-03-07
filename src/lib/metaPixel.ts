// Meta Pixel utility
// Replace 'YOUR_PIXEL_ID' with your actual Meta Pixel ID

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: (...args: unknown[]) => void;
  }
}

export function initMetaPixel(pixelId: string) {
  if (typeof window === "undefined") return;
  if (window.fbq) return; // Already initialized

  const f = window;
  const n = (f.fbq = function (...args: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (n as any).callMethod
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (n as any).callMethod(...args)
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (n as any).queue.push(args);
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (n as any).push = n;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (n as any).loaded = true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (n as any).version = "2.0";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (n as any).queue = [];

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  const firstScript = document.getElementsByTagName("script")[0];
  firstScript?.parentNode?.insertBefore(script, firstScript);

  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
}

export function trackContact(salesId: string) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Contact", { sales_id: salesId });
  }
}

export function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    isMobile: /Mobi|Android/i.test(navigator.userAgent),
  };
}
