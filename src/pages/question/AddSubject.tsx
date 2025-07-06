import { Button, Modal, TagsInput, TextInput } from '@mantine/core';
import React, { useEffect } from 'react';
import { useForm, yupResolver } from '@mantine/form';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { addSubject } from '../../store/action/master-action';

const schema = yup.object().shape({
  subject: yup.string().required('Subject name is required'),
  topics: yup
    .array()
    .of(yup.string().required('Topic name is required'))
    .min(1, 'At least one topic is required'),
});

const AddSubject = ({ opened, close }: any) => {
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm({
    initialValues: {
      subject: '',
      topics: [] as string[],
    },
    validate: yupResolver(schema),
  });

  useEffect(() => {
    if (opened) {
      form.reset();
    }
  }, [opened]);

  const handleSubmit = (values: typeof form.values) => {
    dispatch(addSubject(values));
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Add Subject"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      size="30%"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Subject Name"
          placeholder="Enter subject"
          {...form.getInputProps('subject')}
          autoComplete="off"
          className="mb-4"
        />

        <TagsInput
          data={[]} // Optional: can provide suggested tags
          placeholder="Add topics (max 10)"
          value={form.values.topics}
          onChange={(val) => {
            if (val.length <= 10) {
              form.setFieldValue('topics', val);
            }
          }}
          error={form.errors.topics}
        />

        <Button
          type="submit"
          variant="outline"
          className="mt-4"
          size="sm"
          fullWidth
        >
          Add
        </Button>
      </form>
    </Modal>
  );
};

export default AddSubject;
