// Allowlist worker environment to exclude shell/CI credentials from third-party code.
import { getAppEnvironment, hasAppEnvironment } from '../../../shared/app-environment'
import { prependOrcaCliDirToChildPath } from '../../cli/orca-cli-child-path'

/** A worker's `orca` reaches the Orca that runs it, as its terminals' does; ORCA_CLI_COMMAND names that CLI. */
export function withOrcaCli(env: Record<string, string>): Record<string, string> {
  if (!hasAppEnvironment()) {
    return env
  }
  const app = getAppEnvironment()
  const launcher = prependOrcaCliDirToChildPath(env, {
    isPackaged: app.isPackaged(),
    userDataPath: app.getPath('userData'),
    resourcesPath: (process as { resourcesPath?: string }).resourcesPath ?? null
  })
  if (launcher) {
    env.ORCA_CLI_COMMAND = launcher
  }
  return env
}

const WORKER_ENV_ALLOWLIST = [
  'PATH',
  'HOME',
  'USERPROFILE',
  'LANG',
  'LC_ALL',
  'LC_CTYPE',
  'TZ',
  'TMPDIR',
  'TEMP',
  'TMP',
  // Windows Node/libuv need DLL and system-root lookup variables.
  'SYSTEMROOT',
  'SYSTEMDRIVE',
  'WINDIR',
  'COMSPEC',
  'PATHEXT',
  'PROCESSOR_ARCHITECTURE',
  'NUMBER_OF_PROCESSORS'
] as const

export function buildPluginWorkerEnv(
  baseEnv: NodeJS.ProcessEnv = process.env,
  platform: NodeJS.Platform = process.platform
): Record<string, string> {
  const env: Record<string, string> = {}
  const windowsLookup = new Map<string, string>()
  if (platform === 'win32') {
    // Fold keys only on Windows; POSIX folding could promote an attacker-set lowercase path.
    for (const [key, value] of Object.entries(baseEnv)) {
      if (typeof value === 'string') {
        windowsLookup.set(key.toUpperCase(), value)
      }
    }
  }
  for (const key of WORKER_ENV_ALLOWLIST) {
    const value = platform === 'win32' ? windowsLookup.get(key) : baseEnv[key]
    if (value !== undefined) {
      env[key === 'SYSTEMROOT' ? 'SystemRoot' : key] = value
    }
  }
  env.ELECTRON_RUN_AS_NODE = '1'
  return env
}
