'use client';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';

export default function Playground() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light">Status</Button>
      </DropdownTrigger>
      <DropdownMenu classNames={{ list: 'w-60' }} onAction={alert}>
        {['lol', 'lil'].map((status: string) => (
          <DropdownItem key={status} textValue={status}>
            <div className="flex gap-4 justify-between">
              <Button size="sm" variant="light">
                {status}
              </Button>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
