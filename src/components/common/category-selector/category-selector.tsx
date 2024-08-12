'use client';

import { useEffect } from 'react';

import { updateReportCategory } from '@/actions/reports/updateCategory';
import { pascalToSentenceCase } from '@/helpers/strings/pascalToSentenceCase';
import {
  Button,
  ButtonProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@nextui-org/react';
import { ReportCategory } from '@prisma/client';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

import {
  CLOSING_CATEGORIES,
  OPEN_CATEGORIES,
  ReportWithTags,
} from '@/types/reports';

import { Category } from '../category';
import Icon from '../Icon';

const FORM_ID = 'update-category-form';
export default function CategorySelector({
  report,
  size = 'md',
  variant,
  color = 'primary',
}: {
  report: ReportWithTags;
  size?: ButtonProps['size'];
  color?: ButtonProps['color'];
  variant?: ButtonProps['variant'];
}) {
  const [formState, action] = useFormState(
    updateReportCategory.bind(null, {
      id: report?.id,
    }),
    {
      errors: {},
    },
  );

  useEffect(() => {
    if (!formState.success) {
      toast.error(formState.errors._form?.join(', '));
    } else {
      toast.success(
        `Category updated successfully to ${pascalToSentenceCase(report.category)}`,
      );
    }
  }, [formState]);

  return (
    <Dropdown
      classNames={{ content: 'border-2 border-green-300 py-0' }}
      placement="bottom-end"
      offset={0}
    >
      <DropdownTrigger>
        <Button
          size={size}
          variant={variant}
          color={color}
          endContent={<Icon name={'chevron-down'} />}
        >
          Update category
        </Button>
      </DropdownTrigger>
      <form action={action} id={FORM_ID}>
        <DropdownMenu
          classNames={{ list: '' }}
          onAction={(lol) => console.log('', lol)}
          aria-label="Update report category"
        >
          <DropdownSection title="Open categories">
            {OPEN_CATEGORIES.filter((cat) => ReportCategory.New !== cat).map(
              (category) => (
                <DropdownItem
                  key={category!}
                  textValue={category}
                  className="p-0"
                >
                  <Button
                    id="category"
                    name="category"
                    value={category}
                    className="w-full justify-start p-0"
                    type="submit"
                    size="sm"
                    variant="light"
                    form={FORM_ID}
                  >
                    <Category category={category as ReportCategory} />
                  </Button>
                </DropdownItem>
              ),
            )}
          </DropdownSection>
          <DropdownSection title="Closed categories">
            {CLOSING_CATEGORIES.map((category) => (
              <DropdownItem
                key={category!}
                textValue={category}
                className="p-0"
              >
                <Button
                  id="category"
                  name="category"
                  value={category}
                  className="w-full justify-start p-0"
                  type="submit"
                  size="sm"
                  variant="light"
                  form={FORM_ID}
                >
                  <Category category={category as ReportCategory} />
                </Button>
              </DropdownItem>
            ))}
          </DropdownSection>
        </DropdownMenu>
      </form>
    </Dropdown>
  );
}
