import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";

const DISMISS_KEY = "app_install_prompt_dismissed_v1";
const DEFAULT_INSTALL_URL = "/downloads/b-different.apk";

export default function AppInstallPrompt() {
  const [dismissed, setDismissed] = useState(true);
  const [showQr, setShowQr] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const installUrl = useMemo(() => {
    const envUrl = import.meta.env.VITE_APP_INSTALL_URL as string | undefined;
    return envUrl && envUrl.trim().length > 0 ? envUrl.trim() : DEFAULT_INSTALL_URL;
  }, []);
  const [resolvedInstallUrl, setResolvedInstallUrl] = useState(installUrl);

  useEffect(() => {
    if (installUrl.startsWith("/") && typeof window !== "undefined") {
      setResolvedInstallUrl(`${window.location.origin}${installUrl}`);
    } else {
      setResolvedInstallUrl(installUrl);
    }
  }, [installUrl]);

  useEffect(() => {
    const isDismissed = localStorage.getItem(DISMISS_KEY) === "1";
    setDismissed(isDismissed);
  }, []);

  useEffect(() => {
    let isActive = true;
    if (!showQr) return;

    QRCode.toDataURL(resolvedInstallUrl, { width: 220, margin: 1 })
      .then((url: string) => {
        if (isActive) setQrDataUrl(url);
      })
      .catch(() => {
        if (isActive) setQrDataUrl(null);
      });

    return () => {
      isActive = false;
    };
  }, [resolvedInstallUrl, showQr]);

  if (dismissed) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-[9998] bg-white/95 backdrop-blur-md border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">
              Get the app for faster checkout and order tracking.
            </span>
            <span className="text-xs text-slate-500">
              Tap yes to show a QR code for the mobile app.
            </span>
            <span className="text-[10px] text-amber-600 font-medium mt-1">
              Note: The app is still under development. Some features may not be fully functional.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowQr(true)}
              className="px-4 py-2 text-sm font-semibold rounded-full bg-slate-900 text-white hover:bg-slate-800 transition"
            >
              Yes, show QR
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.setItem(DISMISS_KEY, "1");
                setDismissed(true);
              }}
              className="px-3 py-2 text-sm font-semibold rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
            >
              No thanks
            </button>
          </div>
        </div>
      </div>

      {showQr && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Scan to install</h3>
                <p className="text-xs text-slate-500">
                  This opens your install link in the browser.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowQr(false)}
                className="text-slate-500 hover:text-slate-700 text-sm"
                aria-label="Close"
              >
                Close
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="App install QR code"
                  className="w-56 h-56"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-sm text-slate-400 border border-dashed border-slate-300 rounded-xl">
                  QR code loading...
                </div>
              )}
            </div>


            <div className="mt-4 flex items-center justify-between gap-2">
              <a
                href={resolvedInstallUrl}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                target="_blank"
                rel="noreferrer"
              >
                Open install link
              </a>
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem(DISMISS_KEY, "1");
                  setDismissed(true);
                  setShowQr(false);
                }}
                className="px-3 py-2 text-sm font-semibold rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              >
                Don’t show again
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
