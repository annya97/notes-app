import { useRef, useState, type FormEvent } from 'react';
import { Row, Col, Form, Stack, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import CreatableReactSelect from 'react-select/creatable';
import { v4 as uuidV4 } from 'uuid';
import type { NoteData, Tag } from './App';

type NoteFormProps = {
  onSubmit: (data: NoteData) => void,
  onAddTag: (tag: Tag) => void,
  availableTags: Tag[]
} & Partial<NoteData>;

export function NoteForm({
  onSubmit,
  onAddTag,
  availableTags,
  title = '',
  markdown = '',
  tags = []
}: NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    onSubmit({
      // Title and markdown will never be null, because these are required fields.
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selectedTags
    });

    navigate('..');
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                ref={titleRef}
                defaultValue={title}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <CreatableReactSelect
                options={availableTags.map(tag =>
                  ({label: tag.label, value: tag.id})
                )}
                value={selectedTags.map(tag =>
                  ({label: tag.label, value: tag.id})
                )}
                onChange={tags =>
                  setSelectedTags(tags.map(tag =>
                    ({label: tag.label, id: tag.value})
                  ))
                }
                onCreateOption={label => {
                  const newTag = {id: uuidV4(), label};
                  onAddTag(newTag);
                  setSelectedTags(prev => [...prev, newTag]);
                }}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="markdown">
          <Form.Label>Body</Form.Label>
          <Form.Control
            ref={markdownRef}
            defaultValue={markdown}
            as="textarea"
            rows={15}
            required
          />
        </Form.Group>
        <Stack direction="horizontal" gap={2} className="justify-content-end">
          <Button type="submit" variant="primary">Save</Button>
          <Link to="..">
            <Button type="button" variant="outline-secondary">Cancel</Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  );
}
