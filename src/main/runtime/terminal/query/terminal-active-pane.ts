import type { RuntimeMobileSessionTabsSnapshot } from '../../../../shared/runtime-session-contracts'
import { resolveMobileSessionActiveTab } from '../../session-tabs/mobile-session-tab-selection'

/** The workspace's selected terminal pane as `tabId:leafId`; null when its selected tab is not a terminal. */
export function resolveWorkspaceActivePaneKey(
  snapshot: RuntimeMobileSessionTabsSnapshot | undefined
): string | null {
  if (!snapshot) {
    return null
  }
  const active = resolveMobileSessionActiveTab(snapshot, snapshot.tabs)
  if (active?.type !== 'terminal') {
    return null
  }
  // Why: a split tab's selected surface can lag its layout; the layout's active leaf is the pane with focus.
  const leafId = active.parentLayout?.activeLeafId ?? active.leafId
  return `${active.parentTabId}:${leafId}`
}
