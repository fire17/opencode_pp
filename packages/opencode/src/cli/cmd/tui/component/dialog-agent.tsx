import { createMemo } from "solid-js"
import { useLocal } from "@tui/context/local"
import { DialogSelect } from "@tui/ui/dialog-select"
import { useDialog } from "@tui/ui/dialog"
import { useKeybind } from "../context/keybind"

export function DialogAgent() {
  const local = useLocal()
  const dialog = useDialog()
  const keybind = useKeybind()

  const options = createMemo(() =>
    local.agent.list().map((item) => {
      const isMain = local.agent.isMain(item.name)
      return {
        value: item.name,
        title: item.name,
        description: (item.native ? "native" : item.description) + (isMain ? " (Main)" : ""),
      }
    }),
  )

  return (
    <DialogSelect
      keybind={[
        {
          keybind: (keybind.all as any).agent_main_toggle?.[0],
          title: "Toggle main",
          onTrigger: (option) => {
            local.agent.toggleMain(option.value as string)
          },
        },
      ]}
      title="Select agent"
      current={local.agent.current().name}
      options={options()}
      onSelect={(option) => {
        local.agent.set(option.value)
        dialog.clear()
      }}
    />
  )
}
