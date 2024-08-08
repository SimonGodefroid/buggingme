'use client'
import { Listbox, ListboxItem } from '@nextui-org/react';

export default function ListboxTabs() {
  return (
    <Listbox>
      <ListboxItem key="home" href="/">
        Home
      </ListboxItem>
      <ListboxItem key="comapnies" href="/companies">
        Companies
      </ListboxItem>
    </Listbox>
  );
}
