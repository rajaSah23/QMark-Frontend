import { useEffect, useState, useRef } from 'react';
import { TextInput, ActionIcon } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';

const SearchBox = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialValue = searchParams.get('search') || '';
  const [value, setValue] = useState(initialValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setValue(initialValue); // sync when route/query changes externally
  }, [initialValue]);

  const updateQueryParam = (val: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (val) {
      newParams.set('search', val);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.currentTarget.value;
    setValue(newVal);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      updateQueryParam(newVal);
    }, 700);
  };

  const handleClear = () => {
    setValue('');
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('search');
    setSearchParams(newParams);
  };

  return (
    <TextInput
      value={value}
      onChange={handleChange}
      placeholder="Search..."
      size="sm"
      leftSection={<IconSearch size={16} />}
      rightSection={
        value && (
          <ActionIcon variant="subtle" size="sm" onClick={handleClear}>
            <IconX size={14} />
          </ActionIcon>
        )
      }
    />
  );
};

export default SearchBox;
