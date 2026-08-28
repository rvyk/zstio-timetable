// Frames from injected scripts (browser extensions, in-app webviews) point at
// files we never shipped - if an error has frames but none of them are ours,
// it isn't our bug and shouldn't reach Sentry.
const APP_FRAME = /\/_next\/|node_modules|^(app:\/\/\/)?src\/|zstiojar/;

export const isOurError = (filenames: (string | undefined)[]) =>
  filenames.length === 0 ||
  filenames.some((name) => APP_FRAME.test(name ?? ""));
