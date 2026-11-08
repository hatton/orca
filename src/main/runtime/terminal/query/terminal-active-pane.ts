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

/** The first `limit` terminals, except that a selected terminal past the limit takes the place of the last unselected one. */
export function keepSelectedTerminalsWithinLimit<T extends { activeInWorkspace?: true }>(
  terminals: readonly T[],
  limit: number
): T[] {
  const head = terminals.slice(0, limit)
  const selectedPastLimit = terminals.slice(limit).filter((t) => t.activeInWorkspace)
  let toDrop = Math.min(selectedPastLimit.length, head.filter((t) => !t.activeInWorkspace).length)
  const kept: T[] = []
  for (let i = head.length - 1; i >= 0; i--) {
    if (toDrop > 0 && !head[i].activeInWorkspace) {
      toDrop--
    } else {
      kept.unshift(head[i])
    }
  }
  return [...kept, ...selectedPastLimit].slice(0, limit)
}
