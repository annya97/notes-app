import { useMemo, useState } from 'react';
import { Badge, Button, Card, Col, Form, Modal, Row, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactSelect from 'react-select';
import type { Tag } from './App';
import styles from './NoteList.module.css';

type SimplifiedNoteProps = {
  id: string,
  title: string,
  tags: Tag[]
};

type NoteListProps = {
  notes: SimplifiedNoteProps[],
  availableTags: Tag[],
  onUpdateTag: (id: string, label: string) => void
  onDeleteTag: (id: string) => void
};

type EditTagsModalProps = {
  availableTags: Tag[],
  show: boolean,
  onClose: () => void,
  onUpdateTag: (id: string, label: string) => void
  onDeleteTag: (id: string) => void
};

export function NoteList({
  notes,
  availableTags,
  onUpdateTag,
  onDeleteTag
}: NoteListProps) {
  const [title, setTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isEditTagsModalOpen, setIsEditTagsModalOpen] = useState(false);

  const filteredNotes = useMemo(() =>
    notes.filter(note =>
      (title === ''
        || note.title.toLowerCase().includes(title.toLowerCase()))
      && (selectedTags.length === 0
        || selectedTags.every(tag =>
          note.tags.some(noteTag =>
            noteTag.id === tag.id
          )
        )
      )
    )
  , [notes, title, selectedTags]);
  
  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Notes</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/new">
              <Button variant="primary">Create</Button>
            </Link>
            <Button
              variant="outline-secondary"
              onClick={() => setIsEditTagsModalOpen(true)}
            >
              Edit tags
            </Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelect
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
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Row className="g-3" xs={1} sm={2} lg={3} xl={4}>
        {filteredNotes.map(note => (
          <Col key={note.id}>
            <NoteCard
              id={note.id}
              title={note.title}
              tags={note.tags}
            />
          </Col>
        ))}
      </Row>
      <EditTagsModal
        availableTags={availableTags}
        show={isEditTagsModalOpen}
        onClose={() => setIsEditTagsModalOpen(false)}
        onUpdateTag={onUpdateTag}
        onDeleteTag={onDeleteTag}
      />
    </>
  );
}

function NoteCard({id, title, tags}: SimplifiedNoteProps) {
  return (
    <Card
      as={Link}
      to={`/${id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center justify-content-center h-100"
        >
          <span className="fs-5">{title}</span>
          {tags.length > 0 && (
            <Stack
              direction="horizontal"
              gap={1}
              className="justify-content-center flex-wrap"
            >
              {tags.map(tag => (
                <Badge
                  key={tag.id}
                  className="text-truncate"
                >
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
}

function EditTagsModal({
  availableTags,
  show,
  onClose,
  onUpdateTag,
  onDeleteTag
}: EditTagsModalProps) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {availableTags.map(tag => (
              <Row key={tag.id}>
                <Col>
                  <Form.Control
                    type="text"
                    value={tag.label}
                    onChange={e => onUpdateTag(tag.id, e.target.value)}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    variant="outline-danger"
                    onClick={() => onDeleteTag(tag.id)}
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
