export interface Ui5DistVersion {
  name: string;
  version: Version;
  buildTimestamp: string;
  scmRevision: string;
  gav: string;
  libraries: Library[];
  components: Components;
}

export interface Components {
  "sap.ui.documentation.sdk": SapUI;
  "sap.ui.fl.support.apps.contentbrowser.app": SapUI;
  "sap.ui.fl.support.apps.uiFlexibilityDiagnostics": SapUI;
  "sap.ui.rta.appVariant.manageApps": SapUIRtaAppVariantManageApps;
}

export interface SapUI {
  library: string;
  manifestHints: SapUIDocumentationSDKManifestHints;
}

export interface SapUIDocumentationSDKManifestHints {
  dependencies: PurpleDependencies;
}

export interface PurpleDependencies {
  libs: PurpleLibs;
}

export interface PurpleLibs {
  "sap.m": Sap;
  "sap.ui.core": Sap;
  "sap.ui.layout"?: Sap;
  "sap.ui.unified": SapUIUnified;
}

export interface Sap {
}

export interface SapUIUnified {
  lazy?: boolean;
}

export interface SapUIRtaAppVariantManageApps {
  library: string;
  manifestHints: SapUIRtaAppVariantManageAppsManifestHints;
}

export interface SapUIRtaAppVariantManageAppsManifestHints {
  dependencies: FluffyDependencies;
}

export interface FluffyDependencies {
  libs: FluffyLibs;
}

export interface FluffyLibs {
  "sap.m": Sap;
  "sap.ui.core": Sap;
  "sap.ui.dt": Sap;
  "sap.ui.fl": Sap;
  "sap.ui.layout": Sap;
  "sap.ui.unified": SapUIUnified;
}

export interface Library {
  name?: string;
  version?: Version;
  buildTimestamp?: string;
  scmRevision?: string;
  gav?: string;
  manifestHints?: LibraryManifestHints;
  patchHistory?: Version[];
}

export interface LibraryManifestHints {
  dependencies: TentacledDependencies;
}

export interface TentacledDependencies {
  libs: TentacledLibs;
}

export interface TentacledLibs {
  "sap.m"?: Sap;
  "sap.ui.core": Sap;
  "sap.ui.unified"?: SapUIUnified;
  "sap.ui.layout"?: Sap;
  "sap.f"?: Sap;
  "sap.ui.dt"?: Sap;
  "sap.ui.fl"?: Sap;
  "sap.ui.commons"?: Sap;
}

export enum Version {
  The1630 = "1.63.0",
  The1631 = "1.63.1",
}
