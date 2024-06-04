import {
  InstallableEvent,
  InstalledEvent,
  UpdateAvailableEvent,
} from "./events.js";
import { capabilities } from "./capabilities.js";
import { createLogger } from "../log.js";
import { media } from "../media.js";
const log = createLogger("pwa");

type BeforeInstallPromptEvent = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};
let installable: boolean, installPrompt: BeforeInstallPromptEvent | undefined;
class Pwa extends EventTarget {
  updateAvailable = false;
  installable = false;
  installPrompt?: BeforeInstallPromptEvent;
  __waitingServiceWorker?: ServiceWorker;
  isInstalled = media.STANDALONE((matches) => {
    if (matches) {
      this.dispatchEvent(new InstalledEvent(true));
    }
  });

  triggerPrompt = async () => {
    log("Triggering prompt");
    if (this.installPrompt) {
      this.installPrompt.prompt();
      const { outcome } = await this.installPrompt?.userChoice;

      if (outcome === "accepted") {
        log("Prompt accepted");
        this.dispatchEvent(new InstalledEvent(true));
        this.installPrompt = undefined;
      } else {
        log("Prompt denied");
        this.dispatchEvent(new InstalledEvent(false));
      }
    }
  };

  update = () => {
    log("Skip waiting");
    this.__waitingServiceWorker?.postMessage({ type: "SKIP_WAITING" });
  };

  register(
    swPath: string,
    opts?: RegistrationOptions
  ): Promise<ServiceWorkerRegistration> | Promise<void> {
    if (capabilities.SERVICEWORKER) {
      if (opts) {
        return navigator.serviceWorker.register(swPath, opts);
      } else {
        return navigator.serviceWorker.register(swPath);
      }
    }
    return Promise.resolve();
  }

  async kill() {
    if (capabilities.SERVICEWORKER) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        registration.unregister();
      }
      log("Killed service worker");
    }

    const cachesList = await caches.keys();
    await Promise.all(cachesList.map((key) => caches.delete(key)));
    log("Cleared cache");

    setTimeout(() => {
      window.location.reload();
    });
  }
}

const pwa = new Pwa();

window.addEventListener("beforeinstallprompt", (e) => {
  log("Before install prompt fired");
  installable = true;
  installPrompt = e as BeforeInstallPromptEvent;
  pwa.installable = installable;
  pwa.installPrompt = installPrompt;
  pwa.dispatchEvent(new InstallableEvent());
});

if (capabilities.SERVICEWORKER) {
  let newWorker: ServiceWorker | null;

  navigator.serviceWorker.getRegistration().then((reg) => {
    if (reg) {
      /**
       * If there is already a waiting service worker in line, AND an active, controlling
       * service worker, it means there is an update ready
       */
      if (reg.waiting && navigator.serviceWorker.controller) {
        log("New service worker available");
        pwa.updateAvailable = true;
        pwa.__waitingServiceWorker = reg.waiting;
        pwa.dispatchEvent(new UpdateAvailableEvent());
      }

      /**
       * If there is no waiting service worker yet, it might still be parsing or installing
       */
      reg.addEventListener("updatefound", () => {
        newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker?.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              log("New service worker available");
              pwa.updateAvailable = true;
              pwa.__waitingServiceWorker = newWorker;
              pwa.dispatchEvent(new UpdateAvailableEvent());
            }
          });
        }
      });
    }
  });

  /**
   * Handle the reload whenever the service worker has updated. This can happen either via:
   * - The service worker calling skipWaiting itself (skipWaiting pattern)
   * - Or calling `pwa.update()` after the `'update-available'` event has fired, to let the user choose when they would like to activate the update
   *
   * This logic prevents an unnecessary page reload the first time the service worker has installed and activated
   */
  let refreshing: boolean;
  async function handleUpdate() {
    // check to see if there is a current active service worker
    const oldSw = (await navigator.serviceWorker.getRegistration())?.active
      ?.state;

    navigator.serviceWorker.addEventListener("controllerchange", async () => {
      log("Controller change");
      if (refreshing) return;

      // when the controllerchange event has fired, we get the new service worker
      const newSw = (await navigator.serviceWorker.getRegistration())?.active
        ?.state;

      // if there was already an old activated service worker, and a new activating service worker, do the reload
      if (oldSw === "activated" && newSw === "activating") {
        log("Reloading");
        refreshing = true;
        window.location.reload();
      }
    });
  }

  if (capabilities.SERVICEWORKER) {
    handleUpdate();
  }
}

export { pwa };
