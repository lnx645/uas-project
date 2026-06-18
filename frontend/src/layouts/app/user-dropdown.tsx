import { Container, LogOut01, Settings01, User01 } from "@untitledui/icons";
import { Button as AriaButton } from "react-aria-components";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { cx } from "@/utils/cx";
import { useAsyncValue, useNavigate } from "react-router";
import { AvatarLabelGroup } from "@/components/base/avatar/avatar-label-group";

export const UserDropdown = () => {
  const user: any = useAsyncValue();
  const navigate = useNavigate();
  return (
    <Dropdown.Root>
      <AriaButton
        className={({ isPressed, isFocusVisible }) =>
          cx(
            "group relative inline-flex cursor-pointer rounded-full outline-offset-2 outline-focus-ring",
            (isPressed || isFocusVisible) && "outline-2",
          )
        }
      >
        <Avatar alt={user?.user?.name} src={user?.user?.avatarUrl} size="sm" />
      </AriaButton>

      <Dropdown.Popover className="w-60">
        <div className="flex gap-3 border-b border-secondary p-3">
          <AvatarLabelGroup
            size="md"
            title={user?.user?.name}
            subtitle={user?.user?.email}
            src={user?.user?.avatarUrl}
            status={user?.user?.online ? "online" : "offline"}
          />
        </div>
        <Dropdown.Menu>
          <Dropdown.Item
            onPress={() => navigate("/user/profile")}
            icon={User01}
            addon="⌘K->P"
          >
            View profile
          </Dropdown.Item>
          <Dropdown.Item
            onPress={() => navigate("/user/profile/settings")}
            icon={Settings01}
            addon="⌘S"
          >
            Settings
          </Dropdown.Item>
          <Dropdown.Item icon={Container}>API</Dropdown.Item>
        </Dropdown.Menu>
        <div className="flex flex-col gap-3 border-t border-secondary p-3">
          <Button
            size="xs"
            color="primary-destructive"
            iconLeading={LogOut01}
            className="text-center"
          >
            Sign out
          </Button>
        </div>
      </Dropdown.Popover>
    </Dropdown.Root>
  );
};
