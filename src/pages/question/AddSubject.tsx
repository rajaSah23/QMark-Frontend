import { Button, Modal, TagsInput, TextInput } from '@mantine/core';
import React, { useEffect } from 'react';
import { useForm, yupResolver } from '@mantine/form';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { addSubject } from '../../store/action/master-action';

const schema = yup.object().shape({
  subject: yup.string().required('Subject name is required'),
  // topics are no longer required for the new standalone endpoint
  topics: yup.array().of(yup.string()),
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
    // Only send the subject name to the new endpoint
    dispatch(addSubject({ subject: values.subject }));
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

        {/* Topics input removed since we are just adding a generic subject now. Topics can be added later or we use the specific endpoint if we wanted both. */}

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
