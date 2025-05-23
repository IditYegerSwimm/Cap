import { Button } from "@cap/ui-solid";
import { useNavigate } from "@solidjs/router";
import { For, createResource } from "solid-js";

import "@total-typescript/ts-reset/filter-boolean";
import { commands } from "~/utils/tauri";

export default function AppsTab() {
  const navigate = useNavigate();
  // Add error handling for plan fetching
  const [isUpgraded] = createResource(async () => {
    try {
      return await commands.checkUpgradedAndUpdate();
    } catch (error) {
      console.error("Failed to fetch plan:", error);
      return false; // Default to not upgraded on error
    }
  });

  const apps = [
    {
      name: "S3 Config",
      description:
        "Connect your own S3 bucket. All new shareable link uploads will be uploaded here. Maintain complete ownership over your data.",
      icon: IconLucideDatabase,
      url: "/settings/integrations/s3-config",
      pro: true,
    },
  ];

  const handleAppClick = async (app: (typeof apps)[number]) => {
    try {
      if (app.pro && !isUpgraded()) {
        await commands.showWindow("Upgrade");
        return;
      }
      navigate(app.url);
    } catch (error) {
      console.error("Error handling app click:", error);
    }
  };

  return (
    <div class="p-4">
      <For each={apps}>
        {(app) => (
          <div class="p-1.5 bg-gray-100 rounded-lg border border-gray-200">
            <div class="flex justify-between items-center pb-2 border-b border-gray-200">
              <div class="flex gap-3 items-center">
                <div class="p-2 bg-gray-100 rounded-lg">
                  <app.icon class="w-4 h-4 text-[--text-tertiary]" />
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-sm font-medium text-primary">
                    {app.name}
                  </span>
                </div>
              </div>
              <Button
                variant={app.pro && !isUpgraded() ? "primary" : "secondary"}
                onClick={() => handleAppClick(app)}
                disabled={isUpgraded.loading}
              >
                {isUpgraded.loading
                  ? "Loading..."
                  : app.pro && !isUpgraded()
                  ? "Upgrade to Pro"
                  : "Configure"}
              </Button>
            </div>
            <div class="p-2">
              <p class="text-xs text-[--text-tertiary]">{app.description}</p>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
