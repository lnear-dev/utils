/**
 * `'installable'` event
 * @example pwa.dispatchEvent(new InstallableEvent());
 */
export class InstallableEvent extends Event {
  protected static readonly _name = "installable";
  constructor() {
    super(InstallableEvent._name);
  }
}

/**
 * `'installed'` event
 * @example pwa.dispatchEvent(new InstalledEvent(installed));
 */
export class InstalledEvent extends Event {
  protected static readonly _name = "installed";
  constructor(readonly installed: any) {
    super(InstalledEvent._name);
  }
}

/**
 * `'update-available'` event
 * @example pwa.dispatchEvent(new UpdateAvailableEvent());
 */
export class UpdateAvailableEvent extends Event {
  protected static readonly _name = "update-available";
  constructor() {
    super(UpdateAvailableEvent._name);
  }
}
